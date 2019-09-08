package com.example.usermanage.service;

import com.example.usermanage.entity.User;
import net.sf.json.JSONObject;

import java.util.List;

public interface UserService {
    User findByAccountAndPassword(String account, String password);

    JSONObject findFriendByAccount(String account,int uid);

    User findByAccount(String account);

    int addUser(String account, String password, String phone);

    JSONObject findAllCustomers(int page);

    JSONObject findCustomersByText(int page, String text);

    String updateState(int uid);

    List<JSONObject>findFriends(int uid);

    void updatePicture(int uid, int picture);

    int updateInfo(int uid,String phone);

    void addFriend(String sender, String recipient);

    void deleteFriend(String account1, String account2);

    int updatePassword(int uid, String oldPassword, String newPassword);

    JSONObject findByUid(int uid);
}
