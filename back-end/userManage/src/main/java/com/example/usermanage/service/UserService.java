package com.example.usermanage.service;

import com.example.usermanage.entity.User;

import java.util.List;

public interface UserService {
    User findByAccountAndPassword(String account, String password);
    User findByAccount(String account);
    void addUser(String account, String password, String phone);
    List<User> findAllCustomers();
    void updateState(int uid);
}
