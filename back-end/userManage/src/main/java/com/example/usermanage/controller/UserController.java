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
        String account = request.getParameter("account");
        String password = request.getParameter("password");
        response.setHeader("Access-Control-Allow-Origin", "*");
        User tmp = userService.findByAccountAndPassword(account,password);
        System.out.println(account);
        System.out.println(password);
        return tmp;
    }

    @PostMapping(value = "/findAllCustomers", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<User> findAllCustomer(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        System.out.println(1);
        return userService.findAllCustomers();
    }

    @GetMapping(value = "/updateState", produces = "application/json;charset=UTF-8")
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
        System.out.println(1);
        response.setHeader("Access-Control-Allow-Origin", "*");
        User tmp = userService.findByAccount(account);
        System.out.println(1);
        if(tmp == null) {
            System.out.println(1);
            userService.addUser(account,password,email);
            System.out.println(1);
            return 1;
        }
        else
            return  -1;
    }
    
}
