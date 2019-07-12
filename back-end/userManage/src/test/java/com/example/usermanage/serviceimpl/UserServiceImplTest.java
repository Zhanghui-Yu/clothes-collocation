package com.example.usermanage.serviceimpl;

import com.example.usermanage.UsermanageApplication;
import com.example.usermanage.entity.User;
import com.example.usermanage.repository.UserRepository;
import com.example.usermanage.service.UserService;
import junit.framework.TestCase;
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
    public void testfindByAccount() {
        User user = userService.findByAccount("smallqqq");
        assertEquals(user.getUid(), 6);
    }

    @Test
    public void testfindByAccountAndPassword() {
        User user = userService.findByAccountAndPassword("smallqqq", "3333");
        assertEquals(user.getUid(), 6);
        User user2 = userService.findByAccountAndPassword("smallqq", "3333");
        assertEquals(-1, user2.getUid());
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
    public void testfindAllCustomers() {
        List<User> users = userService.findAllCustomers();
        assertEquals(users.get(0).getAccount(), "smallqqq");
        assertEquals(users.get(1).getAccount(), "gary");
    }

}