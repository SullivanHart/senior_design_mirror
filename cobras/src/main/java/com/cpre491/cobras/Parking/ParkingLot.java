package com.cpre491.cobras.Parking;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;

@Entity
@Getter
@Setter
public class ParkingLot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented id
    private Long id;

    // private Person admin;
    // private Pi pi;

    @OneToMany(mappedBy = "parkingLot", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParkingSpot> spots;

    public ParkingLot(){}
    
    // CHANGE WHEN CREATING NEW MEMBER VARIABLES
    public void copyFrom(ParkingLot updatedLot) {
        // parking spots
        this.spots.clear(); // remove old spots
        for (ParkingSpot spot : updatedLot.getSpots()) {
            spot.setParkingLot(this);
            this.spots.add(spot);     
        }
    }

}
