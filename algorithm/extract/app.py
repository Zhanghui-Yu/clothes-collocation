# -*- coding: utf-8 -*-

import os
import sys
import numpy as np
from scipy.spatial.distance import cdist
from torch.autograd import Variable
from config import *
from utils import *
from data import Fashion_attr_prediction
from net import f_model, c_model, p_model
from sklearn.externals import joblib
import glob
import cv2
import base64
import json
import time
import json
from bson import json_util
from io import BytesIO
from pymongo import MongoClient
import requests
from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, supports_credentials=True)

conn = MongoClient('localhost', 27017)
db = conn.fashion_base  #连接mydb数据库，没有则自动创建
my_table = db.match


@app.after_request
def af_request(resp):
    """
    #请求钩子，在所有的请求发生后执行，加入headers。
    :param resp:
    :return:
    """
    resp = make_response(resp)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET,POST'
    resp.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return resp


@timer_with_task("Loading model")
def load_test_model():
    if not os.path.isfile(DUMPED_MODEL) and not os.path.isfile(os.path.join(DATASET_BASE, "models", DUMPED_MODEL)):
        print("No trained model file!")
        return
    main_model = f_model(model_path=DUMPED_MODEL).cuda(GPU_ID)
    color_model = c_model().cuda(GPU_ID)
    pooling_model = p_model().cuda(GPU_ID)
    extractor = FeatureExtractor(main_model, color_model, pooling_model)
    return extractor


@timer_with_task("Loading feature database")
def load_feat_db():
    feat_all = os.path.join(DATASET_BASE, 'all_feat.npy')
    feat_list = os.path.join(DATASET_BASE, 'all_feat.list')
    color_feat = os.path.join(DATASET_BASE, 'all_color_feat.npy')
    if not os.path.isfile(feat_list) or not os.path.isfile(feat_all) or not os.path.isfile(color_feat):
        print("No feature db file! Please run feature_extractor.py first.")
        return
    deep_feats = np.load(feat_all)
    color_feats = np.load(color_feat)
    with open(feat_list) as f:
        labels = list(map(lambda x: x.strip(), f.readlines()))
    return deep_feats, color_feats, labels


@timer_with_task("Loading feature K-means model")
def load_kmeans_model():
    clf_model_path = os.path.join(DATASET_BASE, r'models', r'kmeans.m')
    clf = joblib.load(clf_model_path)
    return clf


def read_lines(path):
    with open(path) as fin:
        lines = fin.readlines()[2:]
        lines = list(filter(lambda x: len(x) > 0, lines))
        names = list(map(lambda x: x.strip().split()[0], lines))
    return names


def get_top_n(dist, labels, retrieval_top_n):
    ind = np.argpartition(dist, -retrieval_top_n)[-retrieval_top_n:][::-1]
    ret = list(zip([labels[i] for i in ind], dist[ind]))
    ret = sorted(ret, key=lambda x: x[1], reverse=True)
    return ret


def get_similarity(feature, feats, metric='cosine'):
    dist = -cdist(np.expand_dims(feature, axis=0), feats, metric)[0]
    return dist


def get_deep_color_top_n(features, deep_feats, color_feats, labels, retrieval_top_n=5):
    deep_scores = get_similarity(features[0], deep_feats, DISTANCE_METRIC[0])
    color_scores = get_similarity(features[1], color_feats, DISTANCE_METRIC[1])
    results = get_top_n(deep_scores + color_scores * COLOR_WEIGHT, labels, retrieval_top_n)
    return results


@timer_with_task("Doing naive query")
def naive_query(features, deep_feats, color_feats, labels, retrieval_top_n=5):
    results = get_deep_color_top_n(features, deep_feats, color_feats, labels, retrieval_top_n)
    return results


@timer_with_task("Doing query with k-Means")
def kmeans_query(clf, features, deep_feats, color_feats, labels, retrieval_top_n=5):
    label = clf.predict(features[0].reshape(1, features[0].shape[0]))
    ind = np.where(clf.labels_ == label)
    d_feats = deep_feats[ind]
    c_feats = color_feats[ind]
    n_labels = list(np.array(labels)[ind])
    results = get_deep_color_top_n(features, d_feats, c_feats, n_labels, retrieval_top_n)
    return results


@timer_with_task("Extracting image feature")
def dump_single_feature(img_path, extractor):
    paths = [img_path, os.path.join(DATASET_BASE, img_path), os.path.join(DATASET_BASE, 'in_shop', img_path)]
    for i in paths:
        if not os.path.isfile(i):
            continue
        single_loader = torch.utils.data.DataLoader(
            Fashion_attr_prediction(type="single", img_path=i, transform=data_transform_test),
            batch_size=1, num_workers=NUM_WORKERS, pin_memory=True
        )
        data = list(single_loader)[0]
        data = Variable(data).cuda(GPU_ID)
        deep_feat, color_feat = extractor(data)
        deep_feat = deep_feat[0].squeeze()
        color_feat = color_feat[0]
        return deep_feat, color_feat
    return None


def visualize(original, result, cols=5):
    import matplotlib.pyplot as plt
    import cv2
    n_images = len(result) + 1
    titles = ["Original"] + ["Score: {:.4f}".format(v) for k, v in result]
    images = [original] + [k for k, v in result]
    mod_full_path = lambda x: os.path.join(DATASET_BASE, x) \
        if os.path.isfile(os.path.join(DATASET_BASE, x)) \
        else os.path.join(DATASET_BASE, 'in_shop', x,)
    images = list(map(mod_full_path, images))
    images = list(map(lambda x: cv2.cvtColor(cv2.imread(x), cv2.COLOR_BGR2RGB), images))
    fig = plt.figure()
    for n, (image, title) in enumerate(zip(images, titles)):
        a = fig.add_subplot(cols, np.ceil(n_images / float(cols)), n + 1)
        plt.imshow(image)
        a.set_title(title)
    fig.set_size_inches(np.array(fig.get_size_inches()) * n_images * 0.25)
    plt.show()


def similarity(deep_feats1, color_feats1, deep_feats2, color_feats2):
    deep_num = np.dot(deep_feats1, deep_feats2.T) #若为行向量则 A * B.T
    deep_denom = np.linalg.norm(deep_feats1) * np.linalg.norm(deep_feats2)
    deep_cos = deep_num / deep_denom #余弦值
    deep_sim = 0.5 + 0.5 * deep_cos #归一化

    color_num = np.dot(color_feats1, color_feats2.T)  # 若为行向量则 A * B.T
    color_denom = np.linalg.norm(color_feats1) * np.linalg.norm(color_feats2)
    color_cos = color_num / color_denom  # 余弦值
    color_sim = 0.5 + 0.5 * color_cos  # 归一化

    score = deep_sim + color_sim * COLOR_WEIGHT
    return score[0][0]
    # deep_dist = np.linalg.norm(deep_feats1 - deep_feats2)
    # color_dist = np.linalg.norm(color_feats1 - color_feats2)
    # score = deep_dist + color_dist * COLOR_WEIGHT
    # return score


def match(clo_type, feats):
    deep_feats1 = np.expand_dims(feats[0], axis=0)
    color_feats1 = np.expand_dims(feats[1], axis=0)

    # deep_feats1 = feats[0]
    # color_feats1 = feats[1]

    match_cloth = {}
    num = 0
    for image in my_table.find():
        num += 1
        # print(num)
        if clo_type == 'upper':
            db_feats = image['feature']['upper']
        elif clo_type == 'lower':
            db_feats = image['feature']['lower']
        pic = str(image['pic'], 'utf-8')
        deep_feats2 = np.expand_dims(db_feats['deep_feats'], axis=0)
        color_feats2 = np.expand_dims(db_feats['color_feats'], axis=0)
        # deep_feats2 = db_feats['deep_feats']
        # color_feats2 = db_feats['color_feats']

        loss = similarity(deep_feats1, color_feats1, deep_feats2, color_feats2)
        print(loss)
        # 选出偏差最小的前几个搭配图片
        if len(match_cloth) < DETECT_NUM:
            # 直接加到推荐列表中
            match_cloth[loss] = pic
        else:
            # 对match_cloth所有的图片进行遍历比较
            for key in list(match_cloth.keys()):
                if loss > key:                      # 余弦距离 >    欧式距离 <
                    # 保存当前较差的推荐
                    tmp_loss = key
                    tmp_pic = match_cloth[key]
                    # 删除较差的推荐
                    del match_cloth[key]
                    # 保存更优的衣服
                    match_cloth[loss] = pic
                    # 将暂时较差的与剩下元组中的元素比较
                    loss = tmp_loss
                    pic = tmp_pic
    sorted(match_cloth.keys(), reverse=True)
    print(match_cloth.keys())
    print(len(match_cloth))
    return match_cloth


@app.route('/getLabel', methods=["POST", "GET"])
def getLabel():
    pic = request.form['pic']

    # 从输入图片中找到服装
    img_crop = crop(pic)
    print(img_crop)

    # 判断输入
    flag = True
    if len(img_crop) == 1:
        clo_type = list(img_crop.keys())[0]
        if clo_type in ('short_sleeve_top', 'long_sleeve_top', 'short_sleeve_outwear', 'long_sleeve_outwear', 'vest'):
            clo_type = 'upper'
        elif clo_type in ('shorts', 'trousers', 'skirt'):
            clo_type = 'lower'
        else:
            flag = False
    else:
        flag = False

    if not flag:
        error = set()
        error.add('error')
        return json_util.dumps(error)

    # 提取特征
    image = base64.b64decode(list(img_crop.values())[0])
    file = open('cache/1.jpg', 'wb')
    file.write(image)
    file.close()
    img_path = os.path.join(PROJECT_PATH, r'cache/1.jpg')

    feats_raw = dump_single_feature(img_path, extract)
    os.remove(img_path)
    pic_match = match(clo_type, feats_raw)

    pic = set()
    for loss in pic_match:
        pic.add(pic_match[loss])
    return json_util.dumps(pic)


@app.route('/checkSuit', methods=["POST", "GET"])
def checkSuit():
    pic_base64 = request.form['pic']
    print(pic_base64)
    begin = time.time()
    r = requests.post("http://127.0.0.1:6230/cropClothes", {"content": pic_base64})
    img_crops = r.json()
    print('img_crop')
    print(img_crops)
    end = time.time()
    print("yolo-v3: {}s".format(end - begin))

    keys = list(img_crops.keys())
    flag = 2
    for i in range(len(keys)):
        # upper
        if keys[i] in ('short_sleeve_top', 'long_sleeve_top', 'short_sleeve_outwear', 'long_sleeve_outwear', 'vest'):
            flag -= 1
        # suit
        elif keys[i] in ('sling', 'short_sleeve_dress', 'long_sleeve_dress', 'vest_dress', 'sling_dress'):
            flag = 0
            break
        # lower
        elif keys[i] in ('shorts', 'trousers', 'skirt'):
            flag -= 1

    check = set()
    if flag == 0:
        check.add(1)
    else:
        print('the picture only contains upper or lower')
        check.add(0)
    print(check)
    return json_util.dumps(check)


@app.route('/buildDB', methods=["POST", "GET"])
def build_db():
    img_path = 'D:/SJTU/test/deeplearning/Clothes-Recognition-and-Retrieval-master/fashion_base'
    paths = glob.glob(cv2.os.path.join(img_path, '*.jpg'))
    num = 0
    for path in paths:
        num += 1
        print(num)
        print(path)
        # f = dump_single_feature(path, extractor)
        # deep_feats = np.expand_dims(f[0], axis=0)
        # color_feats = np.expand_dims(f[1], axis=0)
        feature = {}

        # 切割图片
        img_raw = open(path, 'rb')
        pic_base64 = base64.b64encode(img_raw.read())
        img_crops = crop(pic_base64)

        # 判别图片是否是整套
        if len(img_crops) < 2:
            continue

        # 提取图片上下装特征
        for key in img_crops:
            feats = get_feature(img_crops[key])
            if key in ('short_sleeve_top', 'long_sleeve_top', 'short_sleeve_outwear', 'long_sleeve_outwear', 'vest'):
                feature['upper'] = feats
            elif key in ('shorts', 'trousers', 'skirt'):
                feature['lower'] = feats
        print(feature)

        # 向mongodb存储图片以及对应特征向量
        picture = {}
        img_raw = open(path, 'rb')
        pic_base64 = base64.b64encode(img_raw.read())
        picture['pic'] = pic_base64
        picture['feature'] = feature
        if len(feature) == 2:
            my_table.insert(picture)

        # if num == 500:
        #     break
    return '1'


def crop(pic_base64):
    begin = time.time()
    r = requests.post("http://127.0.0.1:6230/cropClothes", {"content": pic_base64})
    img_crops = r.json()
    print('img_crop')
    print(img_crops)
    end = time.time()
    print("yolo-v3: {}s".format(end - begin))
    return img_crops


def get_feature(pic):
    image = base64.b64decode(pic)
    file = open('cache/1.jpg', 'wb')
    file.write(image)
    file.close()
    img_path = os.path.join(PROJECT_PATH, r'cache/1.jpg')
    feats_raw = dump_single_feature(img_path, extract)
    os.remove(img_path)
    deep_feats = feats_raw[0]
    color_feats = feats_raw[1]
    feats = dict()
    feats['deep_feats'] = deep_feats.tolist()
    feats['color_feats'] = color_feats.tolist()
    return feats


if __name__ == "__main__":
    global extract
    extract = load_test_model()
    app.run(host="0.0.0.0", port=5000, debug=False)
    # example = "img/Sheer_Pleated-Front_Blouse/img_00000005.jpg"
    # if len(sys.argv) > 1 and sys.argv[1].endswith("jpg"):
    #     example = sys.argv[1]
    # else:
    #     print("Usage: python {} img_path\nNo input image, use default.".format(sys.argv[0]))

    # deep_feats, color_feats, labels = load_feat_db()

    # f = dump_single_feature(example, extractor)

    # if any(list(map(lambda x: x is None, f))):
    #     print("Input feature is None")
    #     exit()
    #
    # clf = load_kmeans_model()
    # print('deep_feats', deep_feats.shape)
    # print('color_feats', color_feats.shape)
    # print('labels', labels)
    # print('f', len(f[0]), '  ', len(f[1]))
    # print('clf', clf)
    #
    # result = naive_query(f, deep_feats, color_feats, labels, 100)
    # result_kmeans = kmeans_query(clf, f, deep_feats, color_feats, labels, 100)

    # print("Naive query result:", result)
    # print("K-Means query result:", result_kmeans)
    # visualize(example, result)
    # visualize(example, result_kmeans)
