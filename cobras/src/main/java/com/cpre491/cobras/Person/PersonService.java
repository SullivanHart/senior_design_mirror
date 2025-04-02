package com.cpre491.cobras.Person;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonService {
    
    private final PersonRepository personRepository;

    @Autowired
    public PersonService(PersonRepository personRepository) {
        this.personRepository = personRepository;
    }

    public Person getPersonByEmail(String email) {
        // Will return null if it doesn't find anything
        return personRepository.findByEmail(email);
    }

    public Person savePerson(Person person) {
        if (personRepository.existsByEmail(person.getEmail())) {
          throw new RuntimeException("Email already exists");
        }
        return personRepository.save(person);
    }

    public boolean validateLogin(String email, String password) {
        Person person = getPersonByEmail(email);
        return person != null && person.getPassword().equals(password);
    }
}
