#! /usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 22 16:01:13 2019

@author: Wei-Hsiang, Shen
"""
import base64
import numpy as np
import time
import tensorflow as tf
import json
import cv2
import glob
from flask import Flask, request, make_response
from flask_cors import CORS, cross_origin
from utils import Read_Img_2_Tensor, Load_DeepFashion2_Yolov3, Draw_Bounding_Box

model = Load_DeepFashion2_Yolov3()
app = Flask(__name__)
CORS(app, supports_credentials=True)


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


@app.route('/', methods=["POST", "GET"])
def hello():
    print("hello")
    return "hello"


@app.route('/detectClothes', methods=["POST", "GET"])
def Detect_Clothes(img, model_yolov3, eager_execution=True):
    """Detect clothes in an image using Yolo-v3 model trained on DeepFashion2 dataset"""
    img = tf.image.resize(img, (416, 416))

    t1 = time.time()
    if eager_execution==True:
        boxes, scores, classes, nums = model_yolov3(img)
        # change eager tensor to numpy array
        boxes, scores, classes, nums = boxes.numpy(), scores.numpy(), classes.numpy(), nums.numpy()
    else:
        boxes, scores, classes, nums = model_yolov3.predict(img)
    t2 = time.time()
    print('Yolo-v3 feed forward: {:.2f} sec'.format(t2 - t1))

    class_names = ['short_sleeve_top', 'long_sleeve_top', 'short_sleeve_outwear', 'long_sleeve_outwear',
                  'vest', 'sling', 'shorts', 'trousers', 'skirt', 'short_sleeve_dress',
                  'long_sleeve_dress', 'vest_dress', 'sling_dress']

    # Parse tensor
    list_obj = []
    for i in range(nums[0]):
        obj = {'label':class_names[int(classes[0][i])], 'confidence':scores[0][i]}
        obj['x1'] = boxes[0][i][0]
        obj['y1'] = boxes[0][i][1]
        obj['x2'] = boxes[0][i][2]
        obj['y2'] = boxes[0][i][3]
        list_obj.append(obj)
    print(list_obj)
    return list_obj


@app.route('/cropClothes', methods=["POST", "GET"])
def Detect_Clothes_and_Crop():
    threshold = 0.5
    pic_base64 = request.form['content']
    print(pic_base64)
    img_tensor = Read_Img_2_Tensor(pic_base64)
    list_obj = Detect_Clothes(img_tensor, model)
    img = np.squeeze(img_tensor.numpy())
    img_width = img.shape[1]
    img_height = img.shape[0]

    pic_img_crop = {}
    num = 0
    # crop out one cloth
    for obj in list_obj:
        num += 1
        img_crop = img[int(obj['y1']*img_height):int(obj['y2']*img_height), int(obj['x1']*img_width):int(obj['x2'] * img_width), :]
        retval, buffer = cv2.imencode('.jpg', img_crop)
        base64_img_crop = base64.b64encode(buffer)
        label = obj['label']

        pic_img_crop[label] = str(base64_img_crop, 'utf-8')

    print(pic_img_crop)
    return pic_img_crop


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=6230, debug=True)
