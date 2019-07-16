package com.example.messagemanage.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "message")
public class Message {

    @Id
    private String id;
    private String sender;
    private String recipient;
    private String content;
    private String time;

    public Message() {}

    public Message(String sender, String recipient, String content, String time) {
        this.sender = sender;
        this.recipient = recipient;
        this.content = content;
        this.time = time;
    }
    public String getId() {
        return this.id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getSender() { return this.sender; }
    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getRecipient() {
        return this.recipient;
    }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getContent() {
        return this.content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public String getTime() {
        return this.time;
    }
    public void setTime(String time) {
        this.time = time;
    }
}
