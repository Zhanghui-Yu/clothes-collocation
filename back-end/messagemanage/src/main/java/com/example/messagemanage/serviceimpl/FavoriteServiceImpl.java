package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.entity.Community;
import com.example.messagemanage.entity.Favorite;
import com.example.messagemanage.repository.FavoriteRepository;
import com.example.messagemanage.service.FavoriteService;
import com.example.messagemanage.service.FeignService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
public class FavoriteServiceImpl implements FavoriteService {


    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private FeignService feignService;

    @Override
    public int deleteFavorite(String id){
        favoriteRepository.deleteById(id);
        return 1;
    }

    @Override
    public int addFavorite(int uid,String picture){
        Favorite favorite = new Favorite(uid,picture);
        favoriteRepository.save(favorite);
        return 1;
    }

    @Override
    public List<JSONObject> findFavoriteByUid(int uid){
        List<Favorite> favorites = favoriteRepository.findByUid(uid);
        List<JSONObject> result = new ArrayList<JSONObject>();
        Iterator<Favorite> it = favorites.iterator();
        while (it.hasNext()) {
            Favorite favorite = (Favorite) it.next();
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id",favorite.getId());
            jsonObject.put("picture",favorite.getPicture());
            result.add(jsonObject);
        }
        return result;
    }
}
