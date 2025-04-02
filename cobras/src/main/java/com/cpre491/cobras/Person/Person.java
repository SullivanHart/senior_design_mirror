package com.cpre491.cobras.Person;

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
    private String email;
    
    @NotNull
    private String password;

    // Constructors, getters, and setters
    public Person() {}

    public Person(String email, String password) {
        this.email = email == null ? null : email.toLowerCase();
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.toLowerCase();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
