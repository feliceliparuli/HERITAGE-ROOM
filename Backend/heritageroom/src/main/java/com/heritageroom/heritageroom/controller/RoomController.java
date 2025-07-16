package com.heritageroom.heritageroom.controller;

import com.heritageroom.heritageroom.model.Room;
import com.heritageroom.heritageroom.repository.RoomRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @GetMapping("/{id}")
    public Room getRoomById(@PathVariable Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room con id " + id + " non trovata"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Room createRoom(@RequestBody @Valid Room room) {
        return roomRepository.save(room);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Room updateRoom(@PathVariable Long id, @RequestBody @Valid Room roomDetails) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room con id " + id + " non trovata"));

        existingRoom.setName(roomDetails.getName());
        existingRoom.setPricePerNight(roomDetails.getPricePerNight());
        existingRoom.setDescription(roomDetails.getDescription());

        return roomRepository.save(existingRoom);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteRoom(@PathVariable Long id) {
        if (!roomRepository.existsById(id)) {
            throw new IllegalArgumentException("Room con id " + id + " non trovata");
        }
        roomRepository.deleteById(id);
    }
}
