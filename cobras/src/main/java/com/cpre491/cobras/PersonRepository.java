package com.cpre491.cobras;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {
  Person findByUsername(String username);
  boolean existsByUsername(String username);
}
