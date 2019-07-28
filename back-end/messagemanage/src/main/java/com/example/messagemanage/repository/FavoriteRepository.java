package com.example.messagemanage.repository;

import com.example.messagemanage.entity.Favorite;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    List<Favorite> findByUid(int uid);
}