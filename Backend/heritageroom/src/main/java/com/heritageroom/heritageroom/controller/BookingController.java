package com.heritageroom.heritageroom.controller;

import com.heritageroom.heritageroom.model.Booking;
import com.heritageroom.heritageroom.model.Customer;
import com.heritageroom.heritageroom.model.Room;
import com.heritageroom.heritageroom.repository.BookingRepository;
import com.heritageroom.heritageroom.repository.CustomerRepository;
import com.heritageroom.heritageroom.repository.RoomRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final RoomRepository roomRepository;

    public BookingController(BookingRepository bookingRepository,
                             CustomerRepository customerRepository,
                             RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
        this.roomRepository = roomRepository;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Booking createBooking(@RequestBody Booking booking, Principal principal) {
        validateDates(booking);

        Room room = booking.getRoom();
        if (room == null || room.getId() == null) {
            throw new IllegalArgumentException("Room ID is required.");
        }

        List<Booking> overlapping = bookingRepository
                .findByRoomIdAndCheckOutAfterAndCheckInBefore(
                        room.getId(), booking.getCheckIn(), booking.getCheckOut());
        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Questa stanza è già prenotata in quelle date.");
        }

        Room fullRoom = roomRepository.findById(room.getId())
                .orElseThrow(() -> new RuntimeException("Stanza non trovata"));
        if (!fullRoom.isAvailable()) {
            throw new IllegalStateException("Stanza non disponibile.");
        }

        Customer customer;
        boolean isAdmin = hasRole("ADMIN");

        if (isAdmin && booking.getCustomer() != null && booking.getCustomer().getId() != null) {
            customer = customerRepository.findById(booking.getCustomer().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente non trovato"));
        } else {
            customer = customerRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        }

        booking.setCustomer(customer);
        booking.setNights((int) ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut()));

        return bookingRepository.save(booking);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking updated, Principal principal) {
        Booking existing = bookingRepository.findById(id).orElseThrow();
        String userEmail = principal.getName();
        boolean isAdmin = hasRole("ADMIN");

        if (!existing.getCustomerEmail().equals(userEmail) && !isAdmin) {
            throw new SecurityException("Accesso negato: non sei il proprietario.");
        }

        validateDates(updated);
        existing.setCheckIn(updated.getCheckIn());
        existing.setCheckOut(updated.getCheckOut());
        existing.setNights((int) ChronoUnit.DAYS.between(updated.getCheckIn(), updated.getCheckOut()));

        return bookingRepository.save(existing);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id, Principal principal) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        String userEmail = principal.getName();
        boolean isAdmin = hasRole("ADMIN");

        if (!booking.getCustomerEmail().equals(userEmail) && !isAdmin) {
            throw new SecurityException("Accesso negato: non sei il proprietario.");
        }

        bookingRepository.deleteById(id);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/me")
    public List<Booking> getMyBookings(Principal principal) {
        return bookingRepository.findByCustomerEmail(principal.getName());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/room/{roomId}")
    public List<Booking> getBookingsByRoom(@PathVariable Long roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/room/{roomId}/booked-dates")
    public List<LocalDate> getBookedDatesForRoom(@PathVariable Long roomId) {
        List<Booking> bookings = bookingRepository.findByRoomId(roomId);
        List<LocalDate> bookedDates = new ArrayList<>();

        for (Booking b : bookings) {
            LocalDate start = b.getCheckIn();
            LocalDate end = b.getCheckOut().minusDays(1);
            while (!start.isAfter(end)) {
                bookedDates.add(start);
                start = start.plusDays(1);
            }
        }
        return bookedDates;
    }

    private boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> r.equals("ROLE_" + role));
    }

    private void validateDates(Booking booking) {
        if (booking.getCheckIn() == null || booking.getCheckOut() == null) {
            throw new IllegalArgumentException("Le date non possono essere null.");
        }
        if (!booking.getCheckOut().isAfter(booking.getCheckIn())) {
            throw new IllegalArgumentException("La data di check-out deve essere successiva al check-in.");
        }
    }
}
