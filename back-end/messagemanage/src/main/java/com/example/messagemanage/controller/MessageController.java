package com.example.messagemanage.controller;

import com.example.messagemanage.entity.Message;
import com.example.messagemanage.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;


    @GetMapping(value = "/findMessage", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<Message> findMessage(HttpServletRequest request, HttpServletResponse response) {
        System.out.println(1);
        String recipient = request.getParameter("recipient");
        response.setHeader("Access-Control-Allow-Origin", "*");
        return messageService.findByRecipient(recipient);
    }

    @GetMapping(value = "/addMessage", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public void addMessage(HttpServletRequest request, HttpServletResponse response) {
        System.out.println(1);
        String sender = request.getParameter("sender");
        String recipient = request.getParameter("recipient");
        String content = request.getParameter("content");
        String time = request.getParameter("time");
        response.setHeader("Access-Control-Allow-Origin", "*");
        messageService.addMessage(sender,recipient,content,time);
    }
}
