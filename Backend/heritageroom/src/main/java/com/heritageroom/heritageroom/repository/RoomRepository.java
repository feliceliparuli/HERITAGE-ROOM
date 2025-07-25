package com.heritageroom.heritageroom.repository;

import com.heritageroom.heritageroom.model.Room;
import com.heritageroom.heritageroom.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    @Query("""
    SELECT r FROM Room r
    WHERE r.available = true
    AND NOT EXISTS (
      SELECT b FROM Booking b
      WHERE b.room = r
      AND (:checkOut > b.checkIn AND :checkIn < b.checkOut)
      AND (:excludeId IS NULL OR b.id <> :excludeId)
    )
    """)
    List<Room> findAvailable(
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("excludeId") Long excludeId
    );
}
