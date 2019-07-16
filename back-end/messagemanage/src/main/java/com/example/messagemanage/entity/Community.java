package com.example.messagemanage.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import net.sf.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "community")
public class Community {

    @Id
    private String id;
    private int senderUid;
    private String time;
    private List<Integer> likeList;
    private List<JSONObject> commentList;

    public Community() {
    }

    public Community(int senderUid, String time) {
        this.senderUid = senderUid;
        this.time = time;
        this.likeList = new ArrayList<Integer>();
        this.commentList = new ArrayList<JSONObject>();
    }

    public String getId() { return this.id; }

    public void setId(String id) { this.id = id; }

    public int getSenderUid() { return this.senderUid; }

    public void setSenderUid(int senderUid) { this.senderUid = senderUid; }

    public String getTime() { return this.time; }

    public void setTime(String time) { this.time = time; }

    public List<Integer> getLikeList() { return this.likeList; }

    public void setLikeList(List<Integer> likeList) { this.likeList = likeList; }

    public List<JSONObject> getCommentList() { return this.commentList; }

    public void setCommentList(List<JSONObject> commentList) { this.commentList = commentList; }

}