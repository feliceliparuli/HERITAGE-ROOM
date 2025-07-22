package com.heritageroom.heritageroom.repository;

import com.heritageroom.heritageroom.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("""
        SELECT r FROM Room r
        WHERE r.available = true AND r.id NOT IN (
            SELECT b.room.id FROM Booking b
            WHERE b.checkIn < :checkOut AND b.checkOut > :checkIn
        )
    """)
    List<Room> findAvailableRooms(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
}
