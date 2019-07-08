package com.example.usermanage.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

@Entity
@Table(name = "users", schema = "mardrobe", catalog = "")
@JsonIgnoreProperties(value = {"handler","hibernateLazyInitializer","fieldHandler"})
public class User {
    private int uid;
    private String phone;
    private String account;
    private String password;
    private String state;
    private String role;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uid")
    public int getUid() {
        return uid;
    }

    public void setUid(int uid) {
        this.uid = uid;
    }

    @Basic
    @Column(name = "phone")
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Basic
    @Column(name = "account")
    public String getAccount() { return account; }

    public void setAccount(String account) {
        this.account = account;
    }

    @Basic
    @Column(name = "password")
    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    @Basic
    @Column(name = "role")
    public String getRole() { return role; }

    public void setRole(String role) {
        this.role = role;
    }

    @Basic
    @Column(name = "state")
    public String getState() { return state; }

    public void setState(String state) {
        this.state = state;
    }
}
