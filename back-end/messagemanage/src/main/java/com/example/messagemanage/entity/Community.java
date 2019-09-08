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
    private int isClothes;
    private String picture;
    private String text;
    private List<Integer> likeList;
    private List<Integer> markList;
    private double point;
    private List<JSONObject> commentList;

    public Community() {
    }

    public Community(int senderUid, String time, String picture,String text, int isClothes) {
        this.senderUid = senderUid;
        this.time = time;
        this.picture = picture;
        this.likeList = new ArrayList<Integer>();
        this.markList = new ArrayList<Integer>();
        this.text = text;
        this.point = 90.00;
        this.isClothes = isClothes;
        this.commentList = new ArrayList<JSONObject>();
    }

    public String getId() { return this.id; }
    public void setId(String id) { this.id = id; }

    public int getSenderUid() { return this.senderUid; }
    public void setSenderUid(int senderUid) { this.senderUid = senderUid; }

    public int getIsClothes() { return this.isClothes; }
    public void setIsClothes(int isClothes) { this.isClothes = isClothes; }

    public double getPoint() { return this.point; }
    public void setPoint(double point) { this.point = point; }

    public String getTime() { return this.time; }
    public void setTime(String time) { this.time = time; }

    public String getText() { return this.text; }
    public void setText(String text) { this.text = text; }

    public String getPicture() { return this.picture; }
    public void setPicture(String picture) { this.picture = picture; }

    public List<Integer> getLikeList() { return this.likeList; }
    public void setLikeList(List<Integer> likeList) { this.likeList = likeList; }

    public List<Integer> getMarkList() { return this.markList; }
    public void setMarkList(List<Integer> markList) { this.markList = markList; }

    public List<JSONObject> getCommentList() { return this.commentList; }
    public void setCommentList(List<JSONObject> commentList) { this.commentList = commentList; }

}