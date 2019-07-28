package com.example.messagemanage.entity;

import net.sf.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "wardrobe")
public class Wardrobe {

    @Id
    private String id;
    private String time;
    private String picture;
    private int like;
    private int uid;
    String tag;
    public Wardrobe() {
    }

    public Wardrobe(int uid, String time, String picture) {
        this.time = time;
        this.uid = uid;
        this.picture = picture;
        this.like = 0;
        this.tag = "未分类";
    }

    public String getId() { return this.id; }
    public void setId(String id) { this.id = id; }

    public String getTime() { return this.time; }
    public void setTime(String time) { this.time = time; }

    public String getPicture() { return this.picture; }
    public void setPicture(String picture) { this.picture = picture; }

    public int getLike() { return this.like; }
    public void setLike(int like) { this.like = like; }

    public int getUid() { return this.uid; }
    public void setUid(int uid) { this.uid = uid; }

    public String getTag() { return this.tag; }
    public void setTag(String tag) { this.tag = tag; }

}