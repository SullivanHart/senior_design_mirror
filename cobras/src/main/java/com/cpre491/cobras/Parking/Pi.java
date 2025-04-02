package com.cpre491.cobras.Parking;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.ZonedDateTime;

@Entity
@Getter
@Setter
public class Pi {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented id
    private Long id;

    //private List<Camera> cameras;
    private ZonedDateTime lastUpdate;
    
    // Keeps track of whether or not the heartbeat is being responded to
    private boolean alive;

}
