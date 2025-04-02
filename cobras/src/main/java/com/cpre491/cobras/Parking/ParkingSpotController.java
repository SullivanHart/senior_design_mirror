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

    @GetMapping("/parkinglots/{lotId}/spots/{spotId}")
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
        if (!parkingLotRepository.existsById(lotId)) {
            return ResponseEntity.notFound().build();
        }
        ParkingLot parkingLot = parkingSpotRepository.findByParkingLotId(lotId);
        return ResponseEntity.ok(parkingLot.getSpots());
    }

    // Create a new parking spot in a specific parking lot
    @PostMapping("/lot/{lotId}")
    public ResponseEntity<ParkingSpot> createSpot(@PathVariable Long lotId, @RequestBody ParkingSpot spot) {
        return parkingLotRepository.findById(lotId).map(lot -> {
            spot.setParkingLot(lot);
            ParkingSpot savedSpot = parkingSpotRepository.save(spot);
            return ResponseEntity.ok(savedSpot);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Update a spot (e.g., change status)
    @PutMapping("/{id}")
    public ResponseEntity<ParkingSpot> updateSpot(@PathVariable Long id, @RequestBody ParkingSpot updated) {
        return parkingSpotRepository.findById(id).map(spot -> {
            spot.setStatus(updated.getStatus());
            return ResponseEntity.ok(parkingSpotRepository.save(spot));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete a parking spot
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSpot(@PathVariable Long id) {
        return parkingSpotRepository.findById(id).map(spot -> {
            parkingSpotRepository.delete(spot);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

}
