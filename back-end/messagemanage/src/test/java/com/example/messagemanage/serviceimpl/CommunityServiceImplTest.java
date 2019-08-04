package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.MessagemanageApplication;
import com.example.messagemanage.entity.Community;
import com.example.messagemanage.repository.CommunityRepository;
import com.example.messagemanage.service.CommunityService;
import net.sf.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.concurrent.Callable;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = MessagemanageApplication.class)
public class CommunityServiceImplTest {

    @Autowired
    CommunityService communityService;

    @Autowired
    CommunityRepository communityRepository;
    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void testfindCommunity() {
        List<JSONObject> communities = communityService.findCommunity(6,0);
        assertEquals(5,communities.size());
        List<JSONObject> communities2 = communityService.findCommunity(6,10);
        assertEquals("Not Found",communities2.get(0).get("flag"));
    }

    @Test
    public void testaddCommunity() {
        int size1 = communityRepository.findAll().size();
        communityService.addCommunity(6,"test","test","haha");
        int size2 = communityRepository.findAll().size();
        assertEquals(size1+1,size2);
    }

    @Test
    public void testmarkPoint() {
        double res1 = communityService.markPoint(0,"5d3670a70172dc1d70c77443",6);
        double res2 = communityService.markPoint(57,"5d3670a70172dc1d70c77443",25);
        assertEquals(-1,Math.round(res1));
        assertNotEquals(-1,res2);
    }

    @Test
    public void testfindCommunityById() {
        assertEquals("smallqqq",communityService.findCommunityById("5d3670a70172dc1d70c77443",6).get("account"));
    }

    @Test
    public void testupdateLike() {
        int size1 = communityRepository.findById("5d3670a70172dc1d70c77443").get().getLikeList().size();
        communityService.updateLike("5d3670a70172dc1d70c77443",26);
        int size2 = communityRepository.findById("5d3670a70172dc1d70c77443").get().getLikeList().size();
        assertNotEquals(size1,size2);
        communityService.updateLike("5d3670a70172dc1d70c77443",26);
        int size3 = communityRepository.findById("5d3670a70172dc1d70c77443").get().getLikeList().size();
        assertEquals(size1,size3);
    }

    @Test
    public void testaddComment() {
        int size1 = communityRepository.findById("5d3670a70172dc1d70c77443").get().getCommentList().size();
        communityService.addComment("5d3670a70172dc1d70c77443","test1","太帅啦");
        int size2 = communityRepository.findById("5d3670a70172dc1d70c77443").get().getCommentList().size();
        assertEquals(size1+1,size2);
    }

    @Test
    public void testfindCommunityBySenderUid() {
        assertEquals(communityRepository.findBySenderUid(6).size(),communityService.findCommunityBySenderUid(6,0).size());
    }

    @Test
    public void testdeleteCommunity() {
        int size1 = communityRepository.findAll().size();
        communityService.deleteCommunity("5d37f6670172dc3c709d98ed");
        int size2 = communityRepository.findAll().size();
        assertEquals(size1-1,size2);
    }

}