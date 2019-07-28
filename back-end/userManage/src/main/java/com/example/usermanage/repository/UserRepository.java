package com.example.usermanage.repository;

import com.example.usermanage.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
     User findByAccountAndPassword(String account, String password);
     User findByAccount(String account);
     List<User> findByRole(String role);
}

