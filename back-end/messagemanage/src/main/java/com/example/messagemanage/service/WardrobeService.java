package com.example.messagemanage.service;


import com.example.messagemanage.entity.Message;
import com.example.messagemanage.entity.Wardrobe;

import java.util.List;

public interface WardrobeService {
    List<Wardrobe> findWardrobeByUid(int uid);
    int deleteWardrobe(String id);
    int updateWardrobeLike(String id);
    int addWardrobe(int uid, String time, String picture);
    int updateWardrobeTag(String id, String tag);
}
