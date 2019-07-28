package com.example.messagemanage.repository;

import com.example.messagemanage.entity.Community;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommunityRepository extends MongoRepository<Community, String> {
    List<Community> findBySenderUid(int uid);
    List<Community> findByTextContains(String text);
}
