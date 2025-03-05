package com.cpre491.cobras;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
  @GetMapping("/test")
  String getTest()
  {
    return "YOU WORK";
  }
}
