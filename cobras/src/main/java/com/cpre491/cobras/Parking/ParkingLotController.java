package com.cpre491.cobras.Parking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parkinglots")
public class ParkingLotController {

    @Autowired
    private ParkingLotRepository parkingLotRepository;

    // Get all parking lots
    @GetMapping
    public List<ParkingLot> getAllParkingLots() {
        return parkingLotRepository.findAll();
    }

    // Get a specific parking lot by ID
    @GetMapping("/{lotId}")
    public ResponseEntity<ParkingLot> getParkingLotById(@PathVariable Long lotId) {
        return parkingLotRepository.findById(lotId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new parking lot
    @PostMapping
    public ParkingLot createParkingLot(@RequestBody ParkingLot parkingLot) {
        if (parkingLot.getSpots() != null) {
            for (ParkingSpot spot : parkingLot.getSpots()) {
                spot.setParkingLot(parkingLot);
            }
        }
        return parkingLotRepository.save(parkingLot);
    }

    // Update an existing parking lot
    @PutMapping("/{lotId}")
    public ResponseEntity<ParkingLot> updateParkingLot(@PathVariable Long lotId, @RequestBody ParkingLot updatedLot) {
        // find the lot
        ParkingLot lot = parkingLotRepository.findById(lotId).orElse(null);
        if (lot == null) {
            return ResponseEntity.notFound().build();
        }
        
        lot.copyFrom(updatedLot);
        parkingLotRepository.save(lot);
        return ResponseEntity.ok(lot);

    }

    // Delete a parking lot
    @DeleteMapping("/{lotId}")
    public ResponseEntity<?> deleteParkingLot(@PathVariable Long lotId) {
        return parkingLotRepository.findById(lotId).map(lot -> {
            parkingLotRepository.delete(lot);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
