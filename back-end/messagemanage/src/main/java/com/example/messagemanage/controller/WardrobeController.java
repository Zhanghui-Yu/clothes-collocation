package com.example.messagemanage.controller;

import com.example.messagemanage.entity.Message;
import com.example.messagemanage.entity.Wardrobe;
import com.example.messagemanage.service.MessageService;
import com.example.messagemanage.service.WardrobeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
public class WardrobeController {

    @Autowired
    private WardrobeService wardrobeService;

    @PostMapping(value = "/findWardrobe", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<Wardrobe> findWardrobes(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int uid = Integer.parseInt(request.getParameter("uid"));
        return wardrobeService.findWardrobeByUid(uid);
    }

    @PostMapping(value = "/addWardrobe", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int addWardrobe(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int uid = Integer.parseInt(request.getParameter("uid"));
        String time = request.getParameter("time");
        String picture = request.getParameter("picture");
        return wardrobeService.addWardrobe(uid,time,picture);
    }

    @PostMapping(value = "/updateWardrobe", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int updateWardrobe(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        return wardrobeService.updateWardrobeLike(id);
    }

    @PostMapping(value = "/updateWardrobeTag", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int updateWardrobeTag(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        String tag = request.getParameter("tag");
        return wardrobeService.updateWardrobeTag(id,tag);
    }

    @PostMapping(value = "/deleteWardrobe", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int deleteMessage(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        return wardrobeService.deleteWardrobe(id);
    }
}
