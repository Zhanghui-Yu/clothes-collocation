package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.entity.Message;
import com.example.messagemanage.repository.MessageRepository;
import com.example.messagemanage.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {


    @Autowired
    private MessageRepository messageRepository;

    @Override
    public List<Message> findByRecipient(String recipient) {
        return messageRepository.findByRecipient(recipient);
    }

    @Override
    public void addMessage(String sender, String recipient, String content, String time){
        Message message = new Message(sender,recipient,content,time);
        messageRepository.save(message);
        System.out.println("Save Success");
    }
}
