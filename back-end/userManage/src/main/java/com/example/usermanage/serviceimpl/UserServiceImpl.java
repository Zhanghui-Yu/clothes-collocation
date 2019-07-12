package com.example.usermanage.serviceimpl;

import com.example.usermanage.UsermanageApplication;
import com.example.usermanage.entity.User;
import com.example.usermanage.repository.UserRepository;
import com.example.usermanage.service.UserService;
import com.example.usermanage.repository.UserRepository;
import com.example.usermanage.service.UserService;
import net.sf.json.JSONObject;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    public User findByAccount(String account) {
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
}
