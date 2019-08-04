package com.example.messagemanage.controller;

import com.example.messagemanage.service.CommunityService;
import com.example.messagemanage.service.FavoriteService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @PostMapping(value = "/findFavoriteByUid", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public List<JSONObject> findFavoriteByUid(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int uid = Integer.parseInt(request.getParameter("uid"));
        return favoriteService.findFavoriteByUid(uid);
    }

    @PostMapping(value = "/addFavorite", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int addFavorite(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        int uid = Integer.parseInt(request.getParameter("uid"));
        String picture = request.getParameter("picture");
        return favoriteService.addFavorite(uid,picture);
    }

    @PostMapping(value = "deleteFavorite", produces = "application/json;charset=UTF-8")
    @ResponseBody
    public int deleteFavorite(HttpServletRequest request, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        String id = request.getParameter("id");
        return favoriteService.deleteFavorite(id);
    }
}
