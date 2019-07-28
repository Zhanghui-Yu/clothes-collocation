package com.example.messagemanage.service;


import com.example.messagemanage.entity.Message;

import java.util.List;

public interface MessageService {
    List<Message> findByRecipient(String recipient);
    void addMessage(String sender, String recipient, String content, String time);
    void addInvitation(String sender, String recipient,String time);
    int manageInvitation(String id,int flag);
    int deleteMessage(String id);
}
