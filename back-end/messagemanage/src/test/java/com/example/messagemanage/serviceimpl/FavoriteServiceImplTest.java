package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.MessagemanageApplication;
import com.example.messagemanage.repository.FavoriteRepository;
import com.example.messagemanage.service.FavoriteService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = MessagemanageApplication.class)
public class FavoriteServiceImplTest {

    @Autowired
    FavoriteService favoriteService;

    @Autowired
    FavoriteRepository favoriteRepository;

    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void deleteFavorite() {
        int size1 = favoriteRepository.findAll().size();
        favoriteService.deleteFavorite("5d3d686b0172dc04286340d9");
        int size2 = favoriteRepository.findAll().size();
        assertEquals(size1 - 1, size2);
    }

    @Test
    public void addFavorite() {
        int size1 = favoriteRepository.findAll().size();
        favoriteService.addFavorite(6,"test");
        int size2 = favoriteRepository.findAll().size();
        assertEquals(size1 + 1, size2);
    }

    @Test
    public void findFavoriteByUid() {
        assertEquals(favoriteRepository.findByUid(6).size(),favoriteService.findFavoriteByUid(6).size());
    }
}