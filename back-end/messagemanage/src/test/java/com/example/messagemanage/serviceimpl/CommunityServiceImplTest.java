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
    public void testmarkPoint() {
        double res1 = communityService.markPoint(0,"5d3ed0330172dc0c2c1dd3c1",6);
        double res2 = communityService.markPoint(57,"5d3ed0330172dc0c2c1dd3c1",6);
        assertNotEquals(-1,Math.round(res1));
        assertEquals(-1,Math.round(res2));
    }

    @Test
    public void testfindCommunityById() {
        assertEquals("smallqqq",communityService.findCommunityById("5d3ed5880172dc34b46ec85e",6).get("account"));
        assertEquals("Not Found",communityService.findCommunityById("5d3ed5880172dc34b46ec85",6).get("flag"));
    }

    @Test
    public void testupdateLike() {
        int size1 = communityRepository.findById("5d3ed0330172dc0c2c1dd3c1").get().getLikeList().size();
        communityService.updateLike("5d3ed0330172dc0c2c1dd3c1",26);
        int size2 = communityRepository.findById("5d3ed0330172dc0c2c1dd3c1").get().getLikeList().size();
        assertNotEquals(size1,size2);
        communityService.updateLike("5d3ed0330172dc0c2c1dd3c1",26);
        int size3 = communityRepository.findById("5d3ed0330172dc0c2c1dd3c1").get().getLikeList().size();
        assertEquals(size1,size3);
    }

    @Test
    public void testaddComment() {
        int size1 = communityRepository.findById("5d3ed5880172dc34b46ec85e").get().getCommentList().size();
        communityService.addComment("5d3ed5880172dc34b46ec85e","test1","太帅啦");
        int size2 = communityRepository.findById("5d3ed5880172dc34b46ec85e").get().getCommentList().size();
        assertEquals(size1+1,size2);
    }

    @Test
    public void testfindCommunityBySenderUid() {
        List<JSONObject> communities = communityService.findCommunityBySenderUid(12,0);
        assertEquals(1,communities.size());
        List<JSONObject> communities2 = communityService.findCommunityBySenderUid(12,10);
        assertEquals("Not Found",communities2.get(0).get("flag"));
    }

    @Test
    public void testfindCommunityByText() {
        List<JSONObject> communities = communityService.findCommunityByText(6,"",0);
        assertEquals("Not Found",communities.get(0).get("flag"));
        List<JSONObject> communities2 = communityService.findCommunityByText(6,"haha",0);
        assertEquals("Not Found",communities2.get(0).get("flag"));
        List<JSONObject> communities3 = communityService.findCommunityByText(6,"绿色",10);
        assertEquals("Not Found",communities3.get(0).get("flag"));
        List<JSONObject> communities4 = communityService.findCommunityByText(6,"绿色搭配红色",0);
        assertEquals(4,communities4.size());
    }

    @Test
    public void testdeleteCommunity() {
        int size1 = communityRepository.findAll().size();
        communityService.deleteCommunity("5d3ede300172dc447c317c35");
        int size2 = communityRepository.findAll().size();
        assertEquals(size1-1,size2);
    }

    @Test
    public void testaddCommunity() {
        int size1 = communityRepository.findAll().size();
        communityService.addCommunity(6,"test","test","haha",1);
        int size2 = communityRepository.findAll().size();
        assertEquals(size1+1,size2);
    }
}