package com.heritageroom.heritageroom.controller;

import com.heritageroom.heritageroom.model.Booking;
import com.heritageroom.heritageroom.repository.BookingRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public Booking createBooking(@RequestBody @Valid Booking booking) {
        // Calcolo automatico delle notti
        long days = ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
        if (days <= 0) {
            throw new IllegalArgumentException("La data di partenza deve essere dopo quella di arrivo.");
        }
        booking.setNights((int) days);

        // Calcolo automatico del prezzo totale
        if (booking.getRoom() != null && booking.getRoom().getPricePerNight() != null) {
            booking.setTotalPrice(booking.getRoom().getPricePerNight() * booking.getNights());
        }

        return bookingRepository.save(booking);
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking con id " + id + " non trovato"));
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new IllegalArgumentException("Booking con id " + id + " non trovato");
        }
        bookingRepository.deleteById(id);
    }

}
