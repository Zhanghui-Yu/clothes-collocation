package com.example.usermanage.service;

import com.example.usermanage.entity.User;
import net.sf.json.JSONObject;

import java.util.List;

public interface UserService {
    User findByAccountAndPassword(String account, String password);

    User findByAccount(String account);

    int addUser(String account, String password, String phone);

    List<User> findAllCustomers();

    String updateState(int uid);
}
