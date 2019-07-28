package com.example.messagemanage.controller;

import com.example.messagemanage.entity.Community;
import com.example.messagemanage.entity.Message;
import com.example.messagemanage.service.CommunityService;
import com.example.messagemanage.service.FeignService;
import com.example.messagemanage.service.MessageService;
import com.example.messagemanage.serviceimpl.CommunityServiceImpl;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import sun.misc.BASE64Decoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.FormParam;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.List;

@RestController
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @PostMapping(value = "/findCommunity", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<JSONObject> findCommunity(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int uid = Integer.parseInt(request.getParameter("uid"));
        int times = Integer.parseInt(request.getParameter("times"));
        return communityService.findCommunity(uid,times);
    }

    @PostMapping(value = "/addCommunity", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int addCommunity(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int senderUid = Integer.parseInt(request.getParameter("senderUid"));
        String time = request.getParameter("time");
        String picture = request.getParameter("picture");
        String text = request.getParameter("text");
        communityService.addCommunity(senderUid,time,picture,text);
        return 1;
    }

    @PostMapping(value = "/findCommunityById", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public JSONObject findCommunityById(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        int uid = Integer.parseInt(request.getParameter("uid"));
        return communityService.findCommunityById(id,uid);
    }

    @PostMapping(value = "/updateLike", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int updateLike(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        int uid = Integer.parseInt(request.getParameter("uid"));
        return communityService.updateLike(id,uid);
    }

    @PostMapping(value = "/addComment", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int addComment(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        String account = request.getParameter("account");
        String message = request.getParameter("message");
        return communityService.addComment(id,account,message);
    }

    @PostMapping(value = "/markPoint", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public double markPoint (HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        int uid = Integer.parseInt(request.getParameter("uid"));
        int point = Integer.parseInt(request.getParameter("point"));
        return communityService.markPoint(point,id,uid);
    }

    @PostMapping(value = "/deleteCommunity", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int deleteCommunity (HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        return communityService.deleteCommunity(id);
    }

    @PostMapping(value = "/findCommunityBySenderUid", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<JSONObject> findCommunityBySenderUid (HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int senderUid = Integer.parseInt(request.getParameter("senderUid"));
        int times = Integer.parseInt(request.getParameter("times"));
        return communityService.findCommunityBySenderUid(senderUid, times);
    }

    @PostMapping(value = "/findCommunityByText", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<JSONObject> findCommunityByText(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int uid = Integer.parseInt(request.getParameter("uid"));
        String text = request.getParameter("text");
        return communityService.findCommunityByText(uid, text);
    }
}
