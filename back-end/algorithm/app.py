import base64
import json
import time

from io import BytesIO
from pymongo import MongoClient
import requests
import glob
import cv2
from PIL import Image


import math
from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from model.tf_run import TFRun
from util.analysis import Analysis
from bson import json_util
from color import cloth_color
import bson
app = Flask(__name__)
tf_run = TFRun()
analysis = Analysis()
CORS(app, supports_credentials=True)

conn = conn = MongoClient('localhost', 27017)
db = conn.fashion_base  #连接mydb数据库，没有则自动创建
my_table = db.fashion_match
DETECT_NUM = 10


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


def bit_to_str(bit):
    return bit.tobytes().decode('utf-8')


def process_part(ret, result, key):
    if key in result:
        begin = time.time()
        pic_binary = base64.b64decode(result[key])
        attr = tf_run.get_label(pic_binary)
        analysed_attr = analysis.analysis_attr(attr)
        ret[key] = analysed_attr
        end = time.time()
        print("{}: {}s".format(key, end - begin))


@app.route('/hello', methods=["POST", "GET"])
def hello():
    print('hello')
    return 'hello'


@app.route('/buildDB', methods=["POST", "GET"])
def build_db():
    img_path = '/Users/gzhy 1/Desktop/Summer Project/detect/fashion_base'
    paths = glob.glob(cv2.os.path.join(img_path, '*.jpg'))
    num = 0
    for path in paths:
        num += 1
        print(num)
        print(path)
        img_raw = open(path, 'rb')
        pic = base64.b64encode(img_raw.read())
        get_label_by_url(pic)


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


@app.route('/getLabel', methods=["POST", "GET"])
def get_label():
    pic_base64 = request.form['pic']
    print(pic_base64)
    begin = time.time()
    r = requests.post("http://127.0.0.1:6230/cropClothes", {"content": pic_base64})
    img_crops = r.json()
    print('img_crop')
    print(img_crops)
    end = time.time()
    print("yolo-v3: {}s".format(end - begin))

    ret = {}
    img_crop_base64 = []
    for obj in img_crops:
        img_crop_base64.append(img_crops[obj])
        for key in ('short_sleeve_top', 'long_sleeve_top', 'short_sleeve_outwear', 'long_sleeve_outwear',
                  'vest', 'sling', 'shorts', 'trousers', 'skirt', 'short_sleeve_dress',
                  'long_sleeve_dress', 'vest_dress', 'sling_dress'):
            process_part(ret, img_crops, key)
    print(list(ret.keys()))

    # 前端衣服无法识别
    if len(ret) == 0:
        print(1)
        error = set()
        error.add('error')
        return json_util.dumps(error)

    # 寻找数据库中搭配的衣服
    clo_type = list(ret.keys())[0]
    pic_match = match(pic_base64, clo_type, ret[clo_type]['attr'])

    # 存入数据库
    # rest = ret
    # rest['pic'] = pic_base64
    # store(rest)

    # 根据颜色对loss更新并排序
    # print(pic_match)
    # main_color = cloth_color(pic_base64)
    # for loss in pic_match:
    #     color = cloth_color(pic_match[loss])
    #     color_loss = 0
    #     color_loss = ColourDistance(color, main_color)
    #     #color_loss /= 1000
    #     new_loss = loss + color_loss
    #     print('oldloss '+str(loss)+' newloss '+str(new_loss)+' colorloss '+str(color_loss))
    #     pic_match[new_loss] = pic_match[loss]
    #     del pic_match[loss]


    # 构造返回的base64集合
    pic = set()
    for loss in pic_match:
        pic.add(pic_match[loss])
    print(len(pic))
    return json_util.dumps(pic)


@app.route('/getLabelByUrl', methods=["POST", "GET"])
def get_label_by_url(pic_base64):
    # print(pic_base64)
    begin = time.time()
    r = requests.post("http://127.0.0.1:6230/cropClothes", {"content": pic_base64})
    img_crops = r.json()
    # print(img_crops)
    end = time.time()
    print("RCNN: {}s".format(end - begin))

    ret = {}
    # if "upper" in r_json and "lower" in r_json:
    for obj in img_crops:
        for key in ('short_sleeve_top', 'long_sleeve_top', 'short_sleeve_outwear', 'long_sleeve_outwear',
                    'vest', 'sling', 'shorts', 'trousers', 'skirt', 'short_sleeve_dress',
                    'long_sleeve_dress', 'vest_dress', 'sling_dress'):
            process_part(ret, img_crops, key)
    # match(ret)
    rest = ret
    rest['pic'] = pic_base64
    store(rest)
    return json_util.dumps(ret)


def ColourDistance(rgb_1, rgb_2):
    R_1, G_1, B_1 = rgb_1
    R_2, G_2, B_2 = rgb_2
    rmean = (R_1 + R_2) / 2
    R = R_1 - R_2
    G = G_1 - G_2
    B = B_1 - B_2
    return math.sqrt((2 + rmean / 256) * (R ** 2) + 4 * (G ** 2) + (2 + (255 - rmean) / 256) * (B ** 2))


def store(info):
    keys = list(info.keys())
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
    if flag == 0:
        my_table.insert(info)
    else:
        print('the picture only contains upper or lower')


def match(pic_base64, clo_type, attr):
    match_cloth = {}
    for i in my_table.find():
        # 衣服类型一致约束
        if clo_type in i:
            db_attr = i[clo_type]['attr']
            pic = i['pic']
            if isinstance(pic, bytes):
                pic = str(pic, 'utf-8')
            loss = 0.0
            for j in range(len(attr)):
                loss += (attr[j] - db_attr[j]) * (attr[j] - db_attr[j])
            # 选出偏差最小的前几个搭配图片
            if len(match_cloth) < DETECT_NUM:
                # 直接加到推荐列表中
                match_cloth[loss] = pic
            else:
                # 对match_cloth所有的图片进行遍历比较
                for key in match_cloth:
                    if loss < key:
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

    # 对筛选出样式类似的图片增加颜色属性
    # std_color = cloth_color(pic_base64)
    # for key in match_cloth:


    print(match_cloth)
    return match_cloth


# def run(pic_base64):
#     begin = time.time()
#     r = requests.post("http://202.120.40.4:16222", {"content": pic_base64})
#     end = time.time()
#     print("RCNN: {}s".format(end - begin))
#
#
#     r_json = r.json()
#     # print(r_json)
#
#     ret = {}
#
#     # if "upper" in r_json and "lower" in r_json:
#     for key in ("upper", "lower", "suit"):
#         process_part(ret, r_json, key)
#
#     print(ret)
#     return json.dumps(ret)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=False)
