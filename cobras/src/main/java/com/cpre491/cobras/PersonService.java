package com.cpre491.cobras;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonService {
    
    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person getPersonByUsername(String username) {
        // Will return null if it doesn't find anything
        return personRepository.findByUsername(username);
    }

    public Person savePerson(Person person) {
        if (personRepository.existsByUsername(person.getUsername())) {
          throw new RuntimeException("Username already exists");
        }
        return personRepository.save(person);
    }

    public boolean validateLogin(String username, String password) {
        Person person = getPersonByUsername(username);
        return person != null && person.getPassword().equals(password);
    }
}
