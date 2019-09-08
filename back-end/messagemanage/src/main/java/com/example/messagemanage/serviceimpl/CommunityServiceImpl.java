package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.entity.Community;
import com.example.messagemanage.entity.Message;
import com.example.messagemanage.repository.CommunityRepository;
import com.example.messagemanage.repository.MessageRepository;
import com.example.messagemanage.service.CommunityService;
import com.example.messagemanage.service.FeignService;
import com.example.messagemanage.service.MessageService;
import net.sf.json.JSONObject;
import org.apdplat.word.WordSegmenter;
import org.apdplat.word.segmentation.Word;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.util.*;

@Service
public class CommunityServiceImpl implements CommunityService {


    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private FeignService feignService;

    @Override
    public List<JSONObject> findCommunity(int uid, int times){
        List<Community> communities = communityRepository.findAll();
        if(communities.size() <= times*5){
            List<JSONObject> result = new ArrayList<JSONObject>();
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("flag","Not Found");
            result.add(jsonObject);
            System.out.println("Not Found");
            return result;
        }
        int end = communities.size()<(times+1)*5? communities.size():(times+1)*5;
        Collections.reverse(communities);
        communities = communities.subList(times*5,end);
        List<JSONObject> result = new ArrayList<JSONObject>();
        Iterator<Community> it = communities.iterator();
        while (it.hasNext()) {
            Community community = (Community) it.next();
            int uidTmp = community.getSenderUid();
            JSONObject user = feignService.getUserInfo(String.valueOf(uidTmp));
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id",community.getId());
            jsonObject.put("flag","Found");
            jsonObject.put("isClothes", community.getIsClothes());
            jsonObject.put("picture",community.getPicture());
            jsonObject.put("text", community.getText());
            jsonObject.put("likeFlag",community.getLikeList().contains(uid));
            jsonObject.put("point",community.getPoint());
            jsonObject.put("like", community.getLikeList().size());
            jsonObject.put("comment",community.getCommentList().size());
            jsonObject.put("headPicture", user.get("picture"));
            jsonObject.put("account", user.get("account"));
            jsonObject.put("time",community.getTime());
            result.add(jsonObject);
        }
        System.out.println("Found");
        return result;
    }

    @Override
    public void addCommunity(int senderUid, String time, String picture,String text, int isClothes){
        Community community = new Community(senderUid,time,picture,text,isClothes);
        communityRepository.save(community);
    }

    @Override
    public JSONObject findCommunityById(String id, int uid){
        Optional<Community> communityTmp = communityRepository.findById(id);
        JSONObject jsonObject = new JSONObject();
        if (!communityTmp.isPresent()) {
            jsonObject.put("flag","Not Found");
            System.out.println(12);
        }
        else {
            Community community = communityTmp.get();
            int uidTmp = community.getSenderUid();
            JSONObject user = feignService.getUserInfo(String.valueOf(uidTmp));
            jsonObject.put("flag","Found");
            jsonObject.put("id", community.getId());
            jsonObject.put("headPicture", user.get("picture"));
            jsonObject.put("account", user.get("account"));
            jsonObject.put("text", community.getText());
            jsonObject.put("picture", community.getPicture());
            jsonObject.put("isClothes", community.getIsClothes());
            jsonObject.put("like", community.getLikeList());
            jsonObject.put("likeNum", community.getLikeList().size());
            jsonObject.put("point", community.getPoint());
            jsonObject.put("likeFlag", community.getLikeList().contains(uid));
            jsonObject.put("markFlag", community.getMarkList().contains(uid));
            jsonObject.put("commentNum", community.getCommentList().size());
            jsonObject.put("comment", community.getCommentList());
        }
        return jsonObject;
    }

    @Override
    public int updateLike(String id, int uid){
        Community community = communityRepository.findById(id).get();
        List<Integer> likes = community.getLikeList();
        if(likes.contains(uid)){
            likes.remove((Integer)uid);
        }
        else{
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
        jsonObject.put("message",content);
        comments.add(jsonObject);
        community.setCommentList(comments);
        communityRepository.save(community);
        return 1;
    }

    @Override
    public double markPoint(int point, String id, int uid){
        Community community = communityRepository.findById(id).get();
        List<Integer> marks = community.getMarkList();
        if(marks.contains(uid))
            return -1;
        else {
            marks.add(uid);
            DecimalFormat format = new DecimalFormat("#0.##");
            format.setRoundingMode(RoundingMode.FLOOR);
            double newPoint = Double.parseDouble(format.format((community.getPoint()*marks.size()+point)/(marks.size()+1)));
            community.setPoint(newPoint);
            communityRepository.save(community);
            return newPoint;
        }
    }

    @Override
    public int deleteCommunity(String id){
        communityRepository.deleteById(id);
        return 1;
    }

    @Override
    public List<JSONObject> findCommunityBySenderUid(int senderUid, int times){
        List<Community> communities = communityRepository.findBySenderUid(senderUid);
        if(communities.size() <= times*5){
            List<JSONObject> result = new ArrayList<JSONObject>();
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("flag","Not Found");
            result.add(jsonObject);
            return result;
        }
        int end = communities.size()<(times+1)*5? communities.size():(times+1)*5;
        Collections.reverse(communities);
        communities = communities.subList(times*5,end);
        List<JSONObject> result = new ArrayList<JSONObject>();
        Iterator<Community> it = communities.iterator();
        while (it.hasNext()) {
            Community community = (Community) it.next();
            int uidTmp = community.getSenderUid();
            JSONObject user = feignService.getUserInfo(String.valueOf(uidTmp));
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id",community.getId());
            jsonObject.put("flag","Found");
            jsonObject.put("isClothes", community.getIsClothes());
            jsonObject.put("picture",community.getPicture());
            jsonObject.put("text", community.getText());
            jsonObject.put("likeFlag",community.getLikeList().contains(senderUid));
            jsonObject.put("point",community.getPoint());
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
    public List<JSONObject> findCommunityByText(int uid, String text,int times){
        List<Word> words = WordSegmenter.seg(text);
        System.out.println(words);
        int numOfWords = words.size();
        if(numOfWords == 0){
            List<JSONObject> result = new ArrayList<JSONObject>();
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("flag","Not Found");
            result.add(jsonObject);
            return result;
        }
        List<Community> allCommunities = communityRepository.findAll();
        List<Community> communities = new ArrayList<Community>();
        int[] arr=new int[numOfWords];
        Iterator<Community> itAll = allCommunities.iterator();
        while (itAll.hasNext()) {
            Community community = (Community) itAll.next();
            int match = 0;
            for(int j = 0; j < numOfWords; j++){
                if(community.getText().contains(words.get(j).getText())){
                    match++;
                }
            }
            if(match != 0){
                int bef = 0;
                for(int k = 0; k < match; k++){
                    bef += arr[k];
                }
                communities.add(bef,community);
                arr[match -1] += 1 ;
            }
        }
        if(communities.size() <= times*5){
            List<JSONObject> result = new ArrayList<JSONObject>();
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("flag","Not Found");
            result.add(jsonObject);
            return result;
        }
        int end = communities.size()<(times+1)*5? communities.size():(times+1)*5;
        Collections.reverse(communities);
        communities = communities.subList(times*5,end);
        List<JSONObject> result = new ArrayList<JSONObject>();
        Iterator<Community> it = communities.iterator();
        while (it.hasNext()) {
            Community community = (Community) it.next();
            int uidTmp = community.getSenderUid();
            JSONObject user = feignService.getUserInfo(String.valueOf(uidTmp));
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id",community.getId());
            jsonObject.put("flag","Found");
            jsonObject.put("isClothes", community.getIsClothes());
            jsonObject.put("picture",community.getPicture());
            jsonObject.put("text", community.getText());
            jsonObject.put("likeFlag",community.getLikeList().contains(uid));
            jsonObject.put("point",community.getPoint());
            jsonObject.put("like", community.getLikeList().size());
            jsonObject.put("comment",community.getCommentList().size());
            jsonObject.put("headPicture", user.get("picture"));
            jsonObject.put("account", user.get("account"));
            jsonObject.put("time",community.getTime());
            result.add(jsonObject);
        }
        return result;
    }
}
