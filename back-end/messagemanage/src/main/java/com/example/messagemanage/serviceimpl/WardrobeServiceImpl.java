package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.entity.Message;
import com.example.messagemanage.entity.Wardrobe;
import com.example.messagemanage.repository.MessageRepository;
import com.example.messagemanage.repository.WardrobeRepository;
import com.example.messagemanage.service.FeignService;
import com.example.messagemanage.service.MessageService;
import com.example.messagemanage.service.WardrobeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WardrobeServiceImpl implements WardrobeService {


    @Autowired
    private WardrobeRepository wardrobeRepository;

    @Autowired
    private FeignService feignService;

    @Override
    public List<Wardrobe> findWardrobeByUid(int uid){
        return wardrobeRepository.findByUid(uid);
    }

    @Override
    public int deleteWardrobe(String id){
        Wardrobe wardrobe = wardrobeRepository.findById(id).get();
        wardrobeRepository.delete(wardrobe);
        return 1;
    }

    @Override
    public int updateWardrobeLike(String id){
        Wardrobe wardrobe = wardrobeRepository.findById(id).get();
        if(wardrobe.getLike() == 1 )
            wardrobe.setLike(0);
        else
            wardrobe.setLike(1);
        wardrobeRepository.save(wardrobe);
        return 1;
    }

    @Override
    public int addWardrobe(int uid, String time, String picture){
        Wardrobe wardrobe = new Wardrobe(uid, time, picture);
        wardrobeRepository.save(wardrobe);
        return 1;
    }


}
