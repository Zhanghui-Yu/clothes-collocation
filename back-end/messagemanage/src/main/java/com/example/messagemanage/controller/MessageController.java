package com.example.messagemanage.controller;

import com.example.messagemanage.entity.Message;
import com.example.messagemanage.service.FeignService;
import com.example.messagemanage.service.MessageService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping(value = "/findMessages", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<Message> findMessages(HttpServletRequest request, HttpServletResponse response) {
        String recipient = request.getParameter("recipient");
        response.setHeader("Access-Control-Allow-Origin", "*");
        return messageService.findByRecipient(recipient);
    }
    @PostMapping(value = "/manageInvitation", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int manageInvitation(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        int flag = Integer.parseInt(request.getParameter("flag"));
        return messageService.manageInvitation(id,flag);
    }

    @PostMapping(value = "/addMessage", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int addMessage(HttpServletRequest request, HttpServletResponse response) {
        String sender = request.getParameter("sender");
        String recipient = request.getParameter("recipient");
        String content = request.getParameter("content");
        String time = request.getParameter("time");
        response.setHeader("Access-Control-Allow-Origin", "*");
        if(content.equals(""))
            messageService.addInvitation(sender,recipient,time);
        else
            messageService.addMessage(sender,recipient,content,time);
        return 1;
    }

    @PostMapping(value = "/deleteMessage", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int deleteMessage(HttpServletRequest request, HttpServletResponse response) {
        String id = request.getParameter("id");
        response.setHeader("Access-Control-Allow-Origin", "*");
        return messageService.deleteMessage(id);
    }

}
