package com.example.usermanage.repository;

import com.example.usermanage.entity.User;
import net.sf.json.JSONObject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByAccountAndPassword(String account, String password);

    List<User> findByAccountContainsAndRole(String account, String role);

    List<User> findByRoleAndAccountContains(String role, String text);

    User findByAccount(String account);

    List<User> findByRole(String role);
}

