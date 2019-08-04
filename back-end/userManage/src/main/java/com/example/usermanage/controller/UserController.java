package com.example.usermanage.controller;

import com.example.usermanage.entity.User;
import com.example.usermanage.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import net.sf.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping(value = "/findUser", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public User findUser(HttpServletRequest request, HttpServletResponse response) {
        System.out.println(1);
        String account = request.getParameter("account");
        String password = request.getParameter("password");
        response.setHeader("Access-Control-Allow-Origin", "*");
        User tmp = userService.findByAccountAndPassword(account, password);
        return tmp;
    }

    @PostMapping(value = "/findAllCustomers", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<User> findAllCustomer(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        return userService.findAllCustomers();
    }

    @PostMapping(value = "/updateState", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public void updateState(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        userService.updateState(Integer.parseInt(request.getParameter("uid")));
    }


    @PostMapping(value = "/addUser", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int addUser(HttpServletRequest request, HttpServletResponse response) {
        String account = request.getParameter("account");
        String password = request.getParameter("password");
        String email = request.getParameter("phone");
        response.setHeader("Access-Control-Allow-Origin", "*");
        return  userService.addUser(account, password, email);
    }

    @PostMapping(value = "/findFriendByAccount", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public JSONObject findFriendByAccount(HttpServletRequest request, HttpServletResponse response) {
        String account = request.getParameter("account");
        int uid = Integer.parseInt(request.getParameter("uid"));
        response.setHeader("Access-Control-Allow-Origin", "*");
        System.out.println(account);
        System.out.println(uid);
        return userService.findFriendByAccount(account,uid);
    }

    @PostMapping(value = "/findFriends", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<JSONObject> findFriends(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        return userService.findFriends(Integer.parseInt(request.getParameter("uid")));
    }

    @PostMapping(value = "/addFriend", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public void addFriend(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String sender = request.getParameter("sender");
        String recipient = request.getParameter("recipient");
        userService.addFriend(sender,recipient);
    }

    @PostMapping(value = "/deleteFriend", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int deleteFriend(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String account1 = request.getParameter("account1");
        String account2 = request.getParameter("account2");
        userService.deleteFriend(account1,account2);
        return 1;
    }

    @PostMapping(value = "/updatePicture", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int updatePicture(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        userService.updatePicture(Integer.parseInt(request.getParameter("uid")),Integer.parseInt(request.getParameter("picture")));
        return 1;
    }

    @PostMapping(value = "/updateInfo", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int updateInfo(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        userService.updateInfo(Integer.parseInt(request.getParameter("uid")),request.getParameter("phone"));
        return 1;
    }

    @PostMapping(value = "/updatePassword", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int updatePassword(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int uid = Integer.parseInt(request.getParameter("uid"));
        String oldPassword = request.getParameter("oldPassword");
        String newPassword = request.getParameter("newPassword");
        return userService.updatePassword(uid,oldPassword,newPassword);
    }

    @PostMapping(value = "/findByUid", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public JSONObject findByUid (HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int uid = Integer.parseInt(request.getParameter("uid"));
        return userService.findByUid(uid);
    }
}
