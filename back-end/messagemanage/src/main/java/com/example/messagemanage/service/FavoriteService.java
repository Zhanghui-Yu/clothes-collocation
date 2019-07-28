package com.example.messagemanage.service;


import com.example.messagemanage.entity.Favorite;
import net.sf.json.JSONObject;

import java.util.List;

public interface FavoriteService {
    int deleteFavorite(String id);
    int addFavorite(int uid,String picture);
    List<JSONObject> findFavoriteByUid(int uid);
}
