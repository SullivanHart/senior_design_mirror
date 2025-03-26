package com.cpre491.cobras;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;

@Entity
public class Person {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented id
    private Long id;

    @Column(unique = true)
    private String username;
    
    @NotNull
    private String password;

    // Constructors, getters, and setters
    public Person() {}

    public Person(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
