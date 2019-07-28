package com.example.messagemanage.repository;

import com.example.messagemanage.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    public List<Message> findByRecipient(String recipient);
    public Message findBySenderAndRecipientAndContent(String sender, String recipient, String content);
    public void deleteBySenderAndRecipientAndTimeAndContent(String sender, String recipient, String time, String content);
}