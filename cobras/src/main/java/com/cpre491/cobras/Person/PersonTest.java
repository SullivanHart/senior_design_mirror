package com.cpre491.cobras.Person;
// package com.cpre491.cobras;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.*;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.test.web.servlet.MockMvc;

// @WebMvcTest(PersonController.class)
// public class PersonTest {
  
//   @Autowired
//     private MockMvc mockMvc;  // MockMvc for performing HTTP requests in the tests

//     @Mock
//     private PersonService personService;  // Mock the PersonService

//     private Person mockPerson;

//     @BeforeEach
//     void setUp() {
//         // Setup a mock person object for testing
//         mockPerson = new Person();
//         mockPerson.setUsername("testuser");
//         mockPerson.setPassword("password123");
//     }

//     @Test
//     void testLogin_Success() throws Exception {
//         // Arrange: Mock the service method to return true (valid login)
//         when(personService.validateLogin("testuser", "password123")).thenReturn(true);

//         // Act: Perform a POST request to the /api/person/login endpoint
//         mockMvc.perform(post("/api/person/login")
//                 .param("username", "testuser")
//                 .param("password", "password123"))
//                 .andExpect(status().isOk())  // Expect a 200 OK response
//                 .andExpect(content().string("Login successful!"));  // Expect the response message
//     }

//     @Test
//     void testLogin_Failure() throws Exception {
//         // Arrange: Mock the service method to return false (invalid login)
//         when(personService.validateLogin("testuser", "wrongpassword")).thenReturn(false);

//         // Act: Perform a POST request to the /api/person/login endpoint
//         mockMvc.perform(post("/api/person/login")
//                 .param("username", "testuser")
//                 .param("password", "wrongpassword"))
//                 .andExpect(status().isBadRequest())  // Expect a 400 Bad Request response
//                 .andExpect(content().string("Invalid username or password."));  // Expect the error message
//     }

//     // Test for the Register endpoint
//     @Test
//     void testRegister_Success() throws Exception {
//         // Arrange: Mock the service method to save the user successfully
//         when(personService.savePerson(any(Person.class))).thenReturn(mockPerson);

//         // Act: Perform a POST request to the /api/person/register endpoint
//         mockMvc.perform(post("/api/person/register")
//                 .contentType("application/json")
//                 .content("{\"username\":\"testuser\", \"password\":\"password123\"}"))
//                 .andExpect(status().isCreated())  // Expect a 201 Created response
//                 .andExpect(content().string("Person registered successfully!"));  // Expect the success message
//     }

//     @Test
//     void testRegister_Failure() throws Exception {
//         // Arrange: Mock the service method to throw an exception (e.g., user already exists)
//         when(personService.savePerson(any(Person.class))).thenThrow(new RuntimeException("Username already exists"));

//         // Act: Perform a POST request to the /api/person/register endpoint
//         mockMvc.perform(post("/api/person/register")
//                 .contentType("application/json")
//                 .content("{\"username\":\"testuser\", \"password\":\"password123\"}"))
//                 .andExpect(status().isBadRequest())  // Expect a 400 Bad Request response
//                 .andExpect(content().string("Username already exists"));  // Expect the error message
//     }

// }
