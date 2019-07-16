package com.example.messagemanage.controller;

import com.example.messagemanage.entity.Community;
import com.example.messagemanage.entity.Message;
import com.example.messagemanage.service.CommunityService;
import com.example.messagemanage.service.MessageService;
import com.example.messagemanage.serviceimpl.CommunityServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @GetMapping(value = "/findCommunity", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<Community> findCommunity(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        return communityService.findCommunity();
    }
}
