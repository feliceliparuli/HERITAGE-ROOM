package com.heritageroom.heritageroom.config;

import com.heritageroom.heritageroom.model.Room;
import com.heritageroom.heritageroom.repository.RoomRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataLoader {

    private final RoomRepository roomRepository;

    public DataLoader(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @PostConstruct
    public void loadData() {
        Room room1 = new Room();
        room1.setName("Suite Venezia");
        room1.setDescription("Una suite elegante nel cuore di Venezia.");
        room1.setPricePerNight(150);
        room1.setAvailable(true);

        Room room2 = new Room();
        room2.setName("Camera Firenze");
        room2.setDescription("Camera accogliente con vista sul Duomo.");
        room2.setPricePerNight(100);
        room2.setAvailable(true);

        roomRepository.save(room1);
        roomRepository.save(room2);
    }
}
