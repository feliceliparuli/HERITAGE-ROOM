package com.heritageroom.heritageroom.repository;

import com.heritageroom.heritageroom.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
