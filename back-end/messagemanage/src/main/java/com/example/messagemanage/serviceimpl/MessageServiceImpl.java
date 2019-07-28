package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.entity.Message;
import com.example.messagemanage.repository.MessageRepository;
import com.example.messagemanage.service.FeignService;
import com.example.messagemanage.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {


    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private FeignService feignService;

    @Override
    public List<Message> findByRecipient(String recipient) {
        List <Message> messages = messageRepository.findByRecipient(recipient);
        Collections.reverse(messages);
        return messages;
    }

    @Override
    public void addMessage(String sender, String recipient, String content, String time){
        Message message = new Message(sender,recipient,content,time);
        messageRepository.save(message);
    }

    @Override
    public int deleteMessage(String id){
        messageRepository.deleteById(id);
        return 1;
    }

    @Override
    public void addInvitation(String sender, String recipient, String time){
        Message message = messageRepository.findBySenderAndRecipientAndContent(sender,recipient,"");
        if(message == null) {
            message = new Message(sender, recipient, "",time);
            messageRepository.save(message);
        }
        else{
            message.setTime(time);
            messageRepository.save(message);
        }
    }

    @Override
    public int manageInvitation(String id,int flag){
        if(flag!=1){
            messageRepository.deleteById(id);
            return -1;
        }
        else{
            Message message = messageRepository.findById(id).get();
            String sender = message.getSender();
            String recipient = message.getRecipient();
            feignService.addFriend(sender,recipient);
            Message tmp = messageRepository.findBySenderAndRecipientAndContent(recipient,sender,"");
            if(tmp != null){
                messageRepository.delete(tmp);
            }
            messageRepository.deleteById(id);
            return 1;
        }
    }
}
