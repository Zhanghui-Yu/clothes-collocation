package com.example.usermanage.serviceimpl;

import com.example.usermanage.UsermanageApplication;
import com.example.usermanage.entity.User;
import com.example.usermanage.repository.UserRepository;
import com.example.usermanage.service.UserService;
import junit.framework.TestCase;
import net.sf.json.JSONObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.transaction.Transactional;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = UsermanageApplication.class)
public class UserServiceImplTest extends TestCase {
    User testUser;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Before
    public void setUp() throws Exception {
        super.setUp();
    }

    @After
    public void tearDown() throws Exception {
        super.tearDown();
    }

    @Test
    public void testfindByAccountAndPassword() {
        User user = userService.findByAccountAndPassword("smallqqq", "3333");
        assertEquals(user.getUid(), 6);
        User user2 = userService.findByAccountAndPassword("smallqq", "3333");
        assertEquals(-1, user2.getUid());
    }

    @Test
    public void testfindFriendByAccount() {
        String flag1 = userService.findFriendByAccount("test",6).getString("flag");
        assertEquals("not found", flag1);
        String flag2 = userService.findFriendByAccount("Gary",6).getString("flag");
        assertEquals("found", flag2);
    }

    @Test
    public void testfindByAccount() {
        User user = userService.findByAccount("smallqqq");
        assertEquals(user.getUid(), 6);
    }

    @Test
    @Transactional
    public void testaddUser() {
        int uid = userService.addUser("haha", "333", "15201982273");
        User user = userRepository.findByAccount("haha");
        int uid2 = user.getUid();
        assertEquals(uid, uid2);
        assertEquals(-1, userService.addUser("smallqqq", "333", "15201982273"));
    }

    @Test
    public void testupdateState() {
        User user = userRepository.getOne(6);
        String state = user.getState();
        if (state.equals("forbid")) {
            state = "permit";
        } else {
            state = "forbid";
        }
        userService.updateState(6);
        assertEquals(state, userRepository.getOne(6).getState());

        user = userRepository.getOne(6);
        state = user.getState();
        if (state.equals("forbid")) {
            state = "permit";
        } else {
            state = "forbid";
        }
        userService.updateState(6);
        assertEquals(state, userRepository.getOne(6).getState());
    }

    @Test
    public void testfindAllCustomers() {
        List<User> users = userService.findAllCustomers();
        assertEquals(users.get(0).getAccount(), "smallqqq");
        assertEquals(users.get(1).getAccount(), "gary");
        assertEquals(users.size(),userRepository.findByRole("customer").size());
    }

    @Test
    public void testfindFriends() {
        List<JSONObject> friends = userService.findFriends(6);
        assertEquals(friends.get(0).getString("name"),"gary");
    }



    @Test
    @Transactional
    public void testdeleteFriend() {
        List<JSONObject> friend1 = userService.findFriends(6);
        List<JSONObject> friend2 = userService.findFriends(7);
        userService.deleteFriend("smallqqq","gary");
        List<JSONObject> friend3 = userService.findFriends(6);
        List<JSONObject> friend4 = userService.findFriends(7);
        assertEquals(friend1.size()-1,friend3.size());
        assertEquals(friend2.size()-1,friend4.size());
    }

    @Test
    @Transactional
    public void testaddFriend() {
        List<JSONObject> friend1 = userService.findFriends(6);
        List<JSONObject> friend2 = userService.findFriends(7);
        userService.addFriend("smallqqq","gary");
        List<JSONObject> friend3 = userService.findFriends(6);
        List<JSONObject> friend4 = userService.findFriends(7);
        assertEquals(friend1.size()+1,friend3.size());
        assertEquals(friend2.size()+1,friend4.size());
        userService.addFriend("smallqqq","gary");
        List<JSONObject> friend5 = userService.findFriends(6);
        List<JSONObject> friend6 = userService.findFriends(7);
        assertEquals(friend1.size()+1,friend3.size());
        assertEquals(friend2.size()+1,friend4.size());
    }

    @Test
    @Transactional
    public void testupdatePicture() {
        userService.updatePicture(6,3);
        User user = userRepository.getOne(6);
        assertEquals(3,user.getPicture());
    }

    @Test
    @Transactional
    public void testupdateInfo() {
        userService.updateInfo(6,"15201982275");
        User user = userRepository.getOne(6);
        assertEquals("15201982275",user.getPhone());
    }

    @Test
    @Transactional
    public void testupdatePassword() {
        assertEquals(-1,userService.updatePassword(6,"2222","6666"));
        assertEquals(1,userService.updatePassword(6,"3333","6666"));
    }

    @Test
    public void testfindByUid() {
       assertEquals("smallqqq",userService.findByUid(6).getString("account"));
    }

}