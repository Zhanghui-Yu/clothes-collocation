package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.MessagemanageApplication;
import com.example.messagemanage.entity.Wardrobe;
import com.example.messagemanage.repository.WardrobeRepository;
import com.example.messagemanage.service.WardrobeService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = MessagemanageApplication.class)
public class WardrobeServiceImplTest {

    @Autowired
    WardrobeService wardrobeService;

    @Autowired
    WardrobeRepository wardrobeRepository;
    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void findWardrobeByUid() {
        assertEquals(wardrobeRepository.findByUid(6).size(),wardrobeService.findWardrobeByUid(6).size());
    }

    @Test
    public void deleteWardrobe() {
        int size1 = wardrobeRepository.findByUid(6).size();
        wardrobeService.deleteWardrobe("5d3ed48b0172dc4bc4dfe104");
        int size2 = wardrobeRepository.findByUid(6).size();
        assertEquals(size1-1,size2);
    }

    @Test
    public void updateWardrobeLike() {
        Wardrobe wardrobe = wardrobeRepository.findById("5d3d68d70172dc04286340e1").get();
        int like = wardrobe.getLike();
        wardrobeService.updateWardrobeLike("5d3d68d70172dc04286340e1");
        wardrobe = wardrobeRepository.findById("5d3d68d70172dc04286340e1").get();
        int like2 = wardrobe.getLike();
        assertNotEquals(like,like2);
        wardrobeService.updateWardrobeLike("5d3d68d70172dc04286340e1");
        wardrobe = wardrobeRepository.findById("5d3d68d70172dc04286340e1").get();
        int like3 = wardrobe.getLike();
        assertEquals(like,like3);
    }

    @Test
    public void addWardrobe() {
        int size1 = wardrobeRepository.findByUid(6).size();
        wardrobeService.addWardrobe(6,"test","test");
        int size2 = wardrobeRepository.findByUid(6).size();
        assertEquals(size1 + 1,size2);
    }

    @Test
    public void updateWardrobeTag(){
        wardrobeService.updateWardrobeTag("5d3d68e90172dc04286340e3","未分类");
        Wardrobe wardrobe = wardrobeRepository.findById("5d3d68e90172dc04286340e3").get();
        String tag = wardrobe.getTag();
        assertEquals("未分类",tag);
    }
}