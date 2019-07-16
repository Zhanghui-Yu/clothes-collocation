package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.entity.Community;
import com.example.messagemanage.entity.Message;
import com.example.messagemanage.repository.CommunityRepository;
import com.example.messagemanage.repository.MessageRepository;
import com.example.messagemanage.service.CommunityService;
import com.example.messagemanage.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityServiceImpl implements CommunityService {


    @Autowired
    private CommunityRepository communityRepository;

    @Override
    public List<Community> findCommunity(){
        return communityRepository.findAll();
    }
}
