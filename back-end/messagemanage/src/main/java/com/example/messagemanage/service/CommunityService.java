package com.example.messagemanage.service;


import com.example.messagemanage.entity.Community;
import com.example.messagemanage.entity.Message;
import net.sf.json.JSONObject;

import java.util.List;

public interface CommunityService {
    List<JSONObject> findCommunity(int uid, int times);
    void addCommunity(int senderUid, String time, String picture,String text, int isClothes);
    JSONObject findCommunityById(String id, int uid);
    int updateLike(String id, int uid);
    int addComment(String id, String account, String content);
    double markPoint(int point, String id, int uid);
    int deleteCommunity(String id);
    List<JSONObject>  findCommunityBySenderUid(int senderUid, int times);
    List<JSONObject>  findCommunityByText(int uid, String text, int times);
}
