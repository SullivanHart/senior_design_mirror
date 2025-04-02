package com.cpre491.cobras.Parking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parkingspots")
public class ParkingSpotController {

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    @Autowired
    private ParkingLotRepository parkingLotRepository;

    // Get all parking spots
    @GetMapping
    public List<ParkingSpot> getAllSpots() {
        return parkingSpotRepository.findAll();
    }

    @GetMapping("/lot/{lotId}/spot/{spotId}")
    public ResponseEntity<ParkingSpot> getSpotFromLot( @PathVariable Long lotId, @PathVariable Long spotId) {

        ParkingLot lot = parkingLotRepository.findById(lotId).orElse(null);
        if (lot == null) {
            return ResponseEntity.notFound().build();
        }

        ParkingSpot spot = parkingSpotRepository.findById(spotId).orElse(null);
        if (spot == null) {
            return ResponseEntity.notFound().build();
        }

        if (!spot.getParkingLot().getId().equals(lotId)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(spot);
    }

    // Get all spots in a specific parking lot
    @GetMapping("/lot/{lotId}")
    public ResponseEntity<List<ParkingSpot>> getSpotsByParkingLot(@PathVariable Long lotId) {
        ParkingLot lot = parkingLotRepository.findById(lotId).orElse(null);
        if (lot == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lot.getSpots());
    }

    // Create a new parking spot in a specific parking lot
    @PostMapping("/lot/{lotId}")
    public ResponseEntity<ParkingSpot> createSpot(@PathVariable Long lotId, @RequestBody ParkingSpot spot) {
        ParkingLot lot = parkingLotRepository.findById(lotId).orElse(null);
        if (lot == null) {
            return ResponseEntity.notFound().build();
        }
        spot.setParkingLot(lot);
        ParkingSpot savedSpot = parkingSpotRepository.save(spot);
        return ResponseEntity.ok(savedSpot);
    }

    // Update a spot (e.g., change status)
    @PutMapping("/lot/{lotId}/spot/{spotId}")
    public ResponseEntity<ParkingSpot> updateSpot(@PathVariable Long lotId, @PathVariable Long spotId, @RequestBody ParkingSpot updated) {
        // find the lot
        ParkingLot lot = parkingLotRepository.findById(lotId).orElse(null);
        if (lot == null) {
            return ResponseEntity.notFound().build();
        }

        // find the spot
        ParkingSpot spot = parkingSpotRepository.findById(spotId).orElse(null);
        if (spot == null) {
            return ResponseEntity.notFound().build();
        }

        // make sure the spot belongs to the lot
        if (!spot.getParkingLot().getId().equals(lotId)) {
            return ResponseEntity.status(403).build();
        }
        
        spot.copyFrom(updated);
        parkingSpotRepository.save(spot);
        return ResponseEntity.ok(spot);

    }

    // Delete a parking spot
    @DeleteMapping("/lot/{lotId}/spots/{spotId}")
    public ResponseEntity<?> deleteSpot(@PathVariable Long lotId, @PathVariable Long spotId) {
        ParkingLot lot = parkingLotRepository.findById(lotId).orElse(null);
        if (lot == null) {
            return ResponseEntity.notFound().build();
        }

        ParkingSpot spot = parkingSpotRepository.findById(spotId).orElse(null);
        if (spot == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!spot.getParkingLot().getId().equals(lotId)) {
            return ResponseEntity.status(403).build();
        }

        parkingSpotRepository.delete(spot);
        return ResponseEntity.noContent().build();

    }

}
