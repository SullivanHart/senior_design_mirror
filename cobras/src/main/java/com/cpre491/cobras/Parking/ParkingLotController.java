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
    @GetMapping("/{id}")
    public ResponseEntity<ParkingLot> getParkingLotById(@PathVariable Long id) {
        return parkingLotRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new parking lot
    @PostMapping
    public ParkingLot createParkingLot(@RequestBody ParkingLot parkingLot) {
        return parkingLotRepository.save(parkingLot);
    }

    // Update an existing parking lot
    @PutMapping("/{id}")
    public ResponseEntity<ParkingLot> updateParkingLot(@PathVariable Long id, @RequestBody ParkingLot updatedLot) {
        return parkingLotRepository.findById(id).map(lot -> {
            lot.setAdmin(updatedLot.getAdmin());
            lot.setPi(updatedLot.getPi());
            lot.setSpots(updatedLot.getSpots());
            return ResponseEntity.ok(parkingLotRepository.save(lot));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete a parking lot
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteParkingLot(@PathVariable Long id) {
        return parkingLotRepository.findById(id).map(lot -> {
            parkingLotRepository.delete(lot);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
