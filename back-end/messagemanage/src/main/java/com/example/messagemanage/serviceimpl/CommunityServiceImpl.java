package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.entity.Community;
import com.example.messagemanage.entity.Message;
import com.example.messagemanage.repository.CommunityRepository;
import com.example.messagemanage.repository.MessageRepository;
import com.example.messagemanage.service.CommunityService;
import com.example.messagemanage.service.FeignService;
import com.example.messagemanage.service.MessageService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

@Service
public class CommunityServiceImpl implements CommunityService {


    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private FeignService feignService;

    @Override
    public List<JSONObject> findCommunity(int uid){
        List<Community> communities = communityRepository.findAll();
        if(communities.size() > 20){
            communities = communities.subList(communities.size()-20,communities.size() - 1);
        }
        Collections.reverse(communities);
        List<JSONObject> result = new ArrayList<JSONObject>();
        Iterator<Community> it = communities.iterator();
        while (it.hasNext()) {
            Community community = (Community) it.next();
            int uidTmp = community.getSenderUid();
            JSONObject user = feignService.getUserInfo(String.valueOf(uidTmp));
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id",community.getId());
            jsonObject.put("picture",community.getPicture());
            jsonObject.put("likeFlag",community.getLikeList().contains(uid));
            jsonObject.put("like", community.getLikeList().size());
            jsonObject.put("comment",community.getCommentList().size());
            jsonObject.put("headPicture", user.get("picture"));
            jsonObject.put("account", user.get("account"));
            jsonObject.put("time",community.getTime());
            result.add(jsonObject);
        }
        return result;
    }

    @Override
    public void addCommunity(int senderUid, String time, String picture){
        Community community = new Community(senderUid,time,picture);
        communityRepository.save(community);
    }

    @Override
    public JSONObject findCommunityById(String id){
        Community community = communityRepository.findById(id).get();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id",community.getId());
        jsonObject.put("picture",community.getPicture());
        jsonObject.put("like", community.getLikeList());
        jsonObject.put("comment",community.getCommentList());
        return jsonObject;
    }

    @Override
    public int updateLike(String id, int uid){
        Community community = communityRepository.findById(id).get();
        List<Integer> likes = community.getLikeList();
        if(likes.contains(uid)){
            likes.remove((Integer)uid);
        }else{
            likes.add(uid);
        }
        community.setLikeList(likes);
        communityRepository.save(community);
        return 1;
    }

    @Override
    public int addComment(String id, String account, String content){
        Community community = communityRepository.findById(id).get();
        List<JSONObject> comments = community.getCommentList();
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("account",account);
        jsonObject.put("content",content);
        comments.add(jsonObject);
        community.setCommentList(comments);
        communityRepository.save(community);
        return 1;
    }
}
