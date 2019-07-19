package com.example.messagemanage.repository;

import com.example.messagemanage.entity.Message;
import com.example.messagemanage.entity.Wardrobe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WardrobeRepository extends MongoRepository<Wardrobe, String> {
    public List<Wardrobe> findByUid(int uid);
}