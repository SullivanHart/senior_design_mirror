package com.cpre491.cobras.Parking;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Getter
@Setter
public class ParkingSpot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incremented id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "parking_lot_id")
    @JsonIgnoreProperties("spots")  // Hides the 'spots' list from being serialized
    private ParkingLot parkingLot;

    private STATUS status;

    enum STATUS{
        EMPTY, TAKEN, RESERVED, HANDICAP
    }

    ParkingSpot() {
        this.status = STATUS.EMPTY;
    }

    // CHANGE WHEN CREATING NEW MEMBER VARIABLES
    public void copyFrom(ParkingSpot updatedSpot) {
        this.status = updatedSpot.getStatus();
    }
    
}
