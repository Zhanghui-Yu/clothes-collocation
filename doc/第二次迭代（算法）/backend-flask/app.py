import base64
import json
import time

from io import BytesIO
from pymongo import MongoClient
import requests
import glob
import cv2
from PIL import Image



from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from model.tf_run import TFRun
from util.analysis import Analysis
from bson import json_util
import bson
app = Flask(__name__)
tf_run = TFRun()
analysis = Analysis()
CORS(app, supports_credentials=True)

conn = conn = MongoClient('localhost', 27017)
db = conn.fashion_base  #连接mydb数据库，没有则自动创建
my_table = db.fashion_match
RECOMMEND_NUM = 5

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


@app.route('/getLabel', methods=["POST", "GET"])
def get_label():
    pic_base64 = request.form['pic']
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
    print(list(ret.keys()))
    clo_type = list(ret.keys())[0]
    pic_match = match(clo_type, ret[clo_type]['attr'])
    # 存入数据库
    # rest = ret
    # rest['pic'] = pic_base64
    # store(rest)
    pic = str(pic_match, 'utf-8')
    print(pic)
    return pic


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


def match(clo_type, attr):
    match_cloth = {}
    for i in my_table.find():
        # 衣服类型一致约束
        if clo_type in i:
            db_attr = i[clo_type]['attr']
            pic = i['pic']
            loss = 0.0
            for j in range(len(attr)):
                loss += (attr[j] - db_attr[j]) * (attr[j] - db_attr[j])
            # 选出偏差最小的前几个搭配图片
            if len(match_cloth) < RECOMMEND_NUM:
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

    print(match_cloth)
    return match_cloth


def run(pic_base64):
    begin = time.time()
    r = requests.post("http://202.120.40.4:16222", {"content": pic_base64})
    end = time.time()
    print("RCNN: {}s".format(end - begin))


    r_json = r.json()
    # print(r_json)

    ret = {}

    # if "upper" in r_json and "lower" in r_json:
    for key in ("upper", "lower", "suit"):
        process_part(ret, r_json, key)

    print(ret)
    return json.dumps(ret)


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=False)
