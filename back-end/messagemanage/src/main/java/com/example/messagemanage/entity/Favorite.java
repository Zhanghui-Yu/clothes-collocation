package com.example.messagemanage.entity;

import net.sf.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "favorite")
public class Favorite {

    @Id
    private String id;
    private int uid;
    private String picture;

    public Favorite() {
    }

    public Favorite(int uid, String picture) {
        this.uid = uid;
        this.picture = picture;
    }

    public String getId() { return this.id; }
    public void setId(String id) { this.id = id; }

    public int getUid() { return this.uid; }
    public void setUid(int uid) { this.uid = uid; }

    public String getPicture() { return this.picture; }
    public void setPicture(String picture) { this.picture = picture; }

}