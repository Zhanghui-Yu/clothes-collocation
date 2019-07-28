package com.example.messagemanage.serviceimpl;

import com.example.messagemanage.MessagemanageApplication;
import com.example.messagemanage.repository.MessageRepository;
import com.example.messagemanage.service.MessageService;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = MessagemanageApplication.class)
public class MessageServiceImplTest {

    @Autowired
    MessageService messageService;

    @Autowired
    MessageRepository messageRepository;

    @Before
    public void setUp() throws Exception {
    }

    @After
    public void tearDown() throws Exception {
    }

    @Test
    public void findByRecipient() {
        assertEquals(messageService.findByRecipient("Gary").size(),messageRepository.findByRecipient("Gary").size());
    }

    @Test
    public void addMessage() {
        int size1 = messageRepository.findByRecipient("Gary").size();
        messageService.addMessage("smallqqq","Gary","hi","2019年7月18日 16:29");
        int size2 =  messageRepository.findByRecipient("Gary").size();
        assertEquals(size1+1,size2);
        messageRepository.deleteBySenderAndRecipientAndTimeAndContent("smallqqq","Gary","2019年7月18日 16:29","hi");
    }

    @Test
    public void addInvitation() {
        int size1 = messageRepository.findByRecipient("Gary").size();
        messageService.addInvitation("Gggg","Gary","2019年7月18日 16:29");
        int size2 =  messageRepository.findByRecipient("Gary").size();
        assertEquals(size1+1,size2);

        messageService.addInvitation("Gggg","Gary","2019年7月18日 16:29");
        size2 =  messageRepository.findByRecipient("Gary").size();
        assertEquals(size1+1,size2);
        messageRepository.deleteBySenderAndRecipientAndTimeAndContent("Gggg","Gary","2019年7月18日 16:29","");
    }

    @Test
    public void manageInvitation() {
        messageService.manageInvitation("5d3a71a98582cf1dd4b12c54",-1);
        assertNull(messageRepository.findBySenderAndRecipientAndContent("test1","test3",""));
        messageService.manageInvitation("5d3a71988582cf1dd4b12c52",1);
        assertNull(messageRepository.findBySenderAndRecipientAndContent("test1","test2",""));
    }
}