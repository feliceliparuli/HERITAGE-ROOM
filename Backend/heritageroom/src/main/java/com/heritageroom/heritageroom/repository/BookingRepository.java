package com.heritageroom.heritageroom.repository;

import com.heritageroom.heritageroom.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}
