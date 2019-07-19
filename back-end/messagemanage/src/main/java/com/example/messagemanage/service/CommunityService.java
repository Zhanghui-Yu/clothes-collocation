package com.example.messagemanage.service;


import com.example.messagemanage.entity.Community;
import com.example.messagemanage.entity.Message;
import net.sf.json.JSONObject;

import java.util.List;

public interface CommunityService {
    List<JSONObject> findCommunity(int uid);
    void addCommunity(int senderUid, String time, String picture);
    JSONObject findCommunityById(String id);
    int updateLike(String id, int uid);
    int addComment(String id, String account, String content);
}
