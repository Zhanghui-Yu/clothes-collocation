package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.entity.Message;
import com.example.messagemanage.repository.MessageRepository;
import com.example.messagemanage.service.FeignService;
import com.example.messagemanage.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {


    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private FeignService feignService;

    @Override
    public List<Message> findByRecipient(String recipient) {
        return messageRepository.findByRecipient(recipient);
    }

    @Override
    public void addMessage(String sender, String recipient, String content, String time){
        Message message = new Message(sender,recipient,content,time);
        messageRepository.save(message);
    }

    @Override
    public void addInvitation(String sender, String recipient, String time){
        Message message = messageRepository.findBySenderAndRecipientAndContent(sender,recipient,"");
        if(message == null) {
            message = new Message(sender, recipient, time);
            messageRepository.save(message);
        }else{
            message.setTime(time);
            messageRepository.save(message);
        }
    }

    @Override
    public int manageInvitation(String id,int flag){
        if(flag!=1){
            messageRepository.deleteById(id);
            return -1;
        }else{
            Message message = messageRepository.findById(id).get();
            String sender = message.getSender();
            String recipient = message.getRecipient();
            feignService.addFriend(sender,recipient);
            messageRepository.deleteById(id);
            return 1;
        }
    }

}
