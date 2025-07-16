package com.heritageroom.heritageroom.controller;

import com.heritageroom.heritageroom.model.Booking;
import com.heritageroom.heritageroom.repository.BookingRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BookingController {

    private final BookingRepository bookingRepository;

    @Autowired
    private HttpServletRequest request;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/{id}")
    public Booking getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking con id " + id + " non trovato"));
    }

    @GetMapping("/by-customer/{customerId}")
    public List<Booking> getBookingsByCustomer(@PathVariable Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    @PostMapping
    public Booking createBooking(@RequestBody @Valid Booking booking) {
        validateAndCalculate(booking, null);
        return bookingRepository.save(booking);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody @Valid Booking bookingDetails) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking con id " + id + " non trovato"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!existingBooking.getCustomer().getEmail().equals(username) && !isAdmin()) {
            throw new SecurityException("Non puoi modificare una prenotazione che non è tua.");
        }

        validateAndCalculate(bookingDetails, existingBooking.getId());

        existingBooking.setCheckIn(bookingDetails.getCheckIn());
        existingBooking.setCheckOut(bookingDetails.getCheckOut());
        existingBooking.setRoom(bookingDetails.getRoom());
        existingBooking.setCustomer(bookingDetails.getCustomer());
        existingBooking.setNights(bookingDetails.getNights());
        existingBooking.setTotalPrice(bookingDetails.getTotalPrice());

        return bookingRepository.save(existingBooking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking con id " + id + " non trovato"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!existingBooking.getCustomer().getEmail().equals(username) && !isAdmin()) {
            throw new SecurityException("Non puoi eliminare una prenotazione che non è tua.");
        }

        bookingRepository.deleteById(id);
    }

    private void validateAndCalculate(Booking booking, Long excludeBookingId) {
        if (booking.getCheckIn() == null || booking.getCheckOut() == null) {
            throw new IllegalArgumentException("Devi specificare le date di check-in e check-out.");
        }

        long days = ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
        if (days <= 0) {
            throw new IllegalArgumentException("La data di check-out deve essere dopo la data di check-in.");
        }

        if (booking.getRoom() == null || booking.getRoom().getPricePerNight() == null) {
            throw new IllegalArgumentException("Devi specificare la stanza e il prezzo per notte.");
        }

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                booking.getRoom().getId(),
                booking.getCheckIn(),
                booking.getCheckOut()
        );

        if (excludeBookingId != null) {
            overlapping = overlapping.stream()
                    .filter(b -> !b.getId().equals(excludeBookingId))
                    .toList();
        }

        if (!overlapping.isEmpty()) {
            throw new IllegalArgumentException("La stanza è già prenotata in queste date.");
        }

        booking.setNights((int) days);
        booking.setTotalPrice(booking.getRoom().getPricePerNight() * booking.getNights());
    }

    private boolean isAdmin() {
        return request.isUserInRole("ADMIN");
    }
}
