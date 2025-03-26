package com.cpre491.cobras;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestParam String username, @RequestParam String password) {
        boolean valid = personService.validateLogin(username, password);
        if (valid) {
          return ResponseEntity.status(HttpStatus.OK).body("Login successful!");
      } else {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid username or password.");
      }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Person person) {
        try {
            personService.savePerson(person);  // Save the person
            return ResponseEntity.status(HttpStatus.CREATED).body("Person registered successfully!");
        } catch (RuntimeException e) {
            // Return a custom error message if there is a problem (e.g., duplicate username)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}