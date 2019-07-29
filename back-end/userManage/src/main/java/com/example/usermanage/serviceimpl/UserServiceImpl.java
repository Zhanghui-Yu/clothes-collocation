package com.example.usermanage.serviceimpl;

import com.example.usermanage.UsermanageApplication;
import com.example.usermanage.entity.User;
import com.example.usermanage.repository.UserRepository;
import com.example.usermanage.service.UserService;
import com.example.usermanage.repository.UserRepository;
import com.example.usermanage.service.UserService;
import com.netflix.discovery.util.StringUtil;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {


    @Autowired
    private UserRepository userRepository;

    @Override
    public User findByAccountAndPassword(String account, String password) {
        User user = userRepository.findByAccountAndPassword(account, password);
        if (user == null) {
            user = new User();
            user.setUid(-1);
            user.setAccount("error");
            user.setPhone("error");
            user.setPassword("error");
            user.setState("error");
            user.setRole("error");
        }
        return user;
    }

    @Override
    public JSONObject findFriendByAccount(String account,int uid) {
        User user = userRepository.findByAccount(account);
        JSONObject jsonObject = new JSONObject();
        if (user == null||user.getUid()==uid) {
            jsonObject.put("flag","not found");
        }
        else{
            jsonObject.put("flag","found");
            jsonObject.put("account",user.getAccount());
            jsonObject.put("picture",user.getPicture());
            jsonObject.put("uid",user.getUid());
            String[] friends = user.getFriends().split(",");
            List<String>  friendsList = new ArrayList<String>(Arrays.asList(friends));
            boolean isFriend = friendsList.contains(String.valueOf(uid));
            jsonObject.put("isFriend",isFriend);
        }
        return jsonObject;
    }

    @Override
    public User findByAccount(String account){
        return userRepository.findByAccount(account);
    }

    @Override
    public int addUser(String account, String password, String phone) {
        if (userRepository.findByAccount(account) == null) {
            User user = new User();
            user.setAccount(account);
            user.setPhone(phone);
            user.setPassword(password);
            user.setState("permit");
            user.setRole("customer");
            user.setFriends("-1");
            return userRepository.save(user).getUid();
        } else
            return -1;
    }

    @Override
    public List<User> findAllCustomers() {
        return userRepository.findByRole("customer");
    }

    @Override
    public String updateState(int uid) {
        User user = userRepository.getOne(uid);
        if (user.getState().equals("permit"))
            user.setState("forbid");
        else
            user.setState("permit");
        return userRepository.save(user).getState();
    }

    @Override
    public List<JSONObject>findFriends(int uid){
        User user = userRepository.getOne(uid);
        String friendsString = user.getFriends();
        List<JSONObject> result = new ArrayList<JSONObject>();
        String[] friends = friendsString.split(",");
        for(int i = 1; i < friends.length; i++){
            int fid = Integer.parseInt(friends[i]);
            JSONObject jsonObject = new JSONObject();
            User friend = userRepository.getOne(fid);
            jsonObject.put("name", friend.getAccount());
            jsonObject.put("picture", friend.getPicture());
            result.add(jsonObject);
        }
        return result;
    }

    @Override
    public void  deleteFriend(String account1, String account2){
        User user1 = userRepository.findByAccount(account1);
        User user2 = userRepository.findByAccount(account2);
        int uid1 = user1.getUid();
        int uid2 = user2.getUid();
        String[] friends1 = user1.getFriends().split(",");
        String[] friends2 = user2.getFriends().split(",");
        List<String>  friendsList1 = new ArrayList<String>(Arrays.asList(friends1));
        List<String>  friendsList2 = new ArrayList<String>(Arrays.asList(friends2));
        friendsList2.remove(String.valueOf(uid1));
        friendsList1.remove(String.valueOf(uid2));
        String newFriends1 = StringUtils.join(friendsList1,",");
        String newFriends2 = StringUtils.join(friendsList2,",");
        user1.setFriends(newFriends1);
        user2.setFriends(newFriends2);
        userRepository.save(user1);
        userRepository.save(user2);
    }

    @Override
    public void  addFriend(String sender, String recipient){
        User user1 = userRepository.findByAccount(sender);
        User user2 = userRepository.findByAccount(recipient);
        int uid1 = user1.getUid();
        int uid2 = user2.getUid();
        String[] friendsArray1 = user1.getFriends().split(",");
        List<String>  friendsList1 = new ArrayList<String>(Arrays.asList(friendsArray1));
        if(friendsList1.contains(String.valueOf(uid2)))
            return;
        String friends1 = user1.getFriends() + "," + uid2;
        String friends2 = user2.getFriends() + "," + uid1;
        user1.setFriends(friends1);
        user2.setFriends(friends2);
        userRepository.save(user1);
        userRepository.save(user2);
    }

    @Override
    public void  updatePicture(int uid, int picture){
        User user = userRepository.getOne(uid);
        user.setPicture(picture);
        userRepository.save(user);
    }

    @Override
    public int updateInfo(int uid,  String phone){
        User user = userRepository.getOne(uid);
        user.setPhone(phone);
        userRepository.save(user);
        return 1;
    }

    @Override
    public int updatePassword(int uid, String oldPassword, String newPassword){
        User user = userRepository.getOne(uid);
        if(user.getPassword().equals(oldPassword)){
            user.setPassword(newPassword);
            userRepository.save(user);
            return 1;
        }
        else {
            return -1;
        }
    }

    @Override
    public JSONObject findByUid(int uid){
        User user = userRepository.getOne(uid);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("account", user.getAccount());
        jsonObject.put("picture", user.getPicture());
        jsonObject.put("phone", user.getPhone());
        return  jsonObject;
    }
}
