package com.example.messagemanage.service;

import net.sf.json.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(value = "service-user")
public interface FeignService {
    @RequestMapping(value = "/findByUid",method = RequestMethod.POST)
    JSONObject getUserInfo(@RequestParam(value = "uid") String uid);

    @RequestMapping(value = "/addFriend",method = RequestMethod.POST)
    void addFriend(@RequestParam(value = "sender") String sender,@RequestParam(value = "recipient") String recipient);
}
