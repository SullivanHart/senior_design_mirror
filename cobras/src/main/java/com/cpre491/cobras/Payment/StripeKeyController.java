package com.cpre491.cobras.Payment;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stripe")
public class StripeKeyController {

    @Value("${stripe.publishable.key}")
    private String publishableKey;

    @GetMapping("/publishable-key")
    public Map<String, String> getPublishableKey() {
        Map<String, String> response = new HashMap<>();
        response.put("publishableKey", publishableKey);
        return response;
    }
}
