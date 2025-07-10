package com.heritageroom.heritageroom.controller;

import com.heritageroom.heritageroom.model.Room;
import com.heritageroom.heritageroom.repository.RoomRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000") // per React
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @PostMapping
    public Room createRoom(@RequestBody @Valid Room room) {
        return roomRepository.save(room);
    }


}
