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

        Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Stanza non trovata"));

        List<Booking> overlapping = bookingRepository
                .findByRoomIdAndCheckOutAfterAndCheckInBefore(
                        room.getId(), booking.getCheckIn(), booking.getCheckOut());
        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Questa stanza è già prenotata in quelle date.");
        }

        if (!room.isAvailable()) {
            throw new IllegalStateException("Stanza non disponibile.");
        }

        Customer customer;
        if (hasRole("ADMIN") && booking.getCustomer() != null) {
            customer = customerRepository.findById(booking.getCustomer().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente non trovato"));
        } else {
            customer = customerRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        }

        booking.setCustomer(customer);
        booking.setNights((int) ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut()));

        double total = booking.getNights() * room.getPricePerNight();
        booking.setTotalPrice(total);

        return bookingRepository.save(booking);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Booking updateBooking(@PathVariable Long id, @RequestBody Booking updated, Principal principal) {
        Booking existing = bookingRepository.findById(id).orElseThrow();
        String userEmail = principal.getName();
        boolean isAdmin = hasRole("ADMIN");

        if (!existing.getCustomerEmail().equals(userEmail) && !isAdmin) {
            throw new SecurityException("Accesso negato: non sei il proprietario.");
        }

        validateDates(updated);

        List<Booking> overlapping = bookingRepository
                .findByRoomIdAndCheckOutAfterAndCheckInBefore(
                        updated.getRoom().getId(), updated.getCheckIn(), updated.getCheckOut());

        overlapping.removeIf(b -> b.getId().equals(id)); // Ignora se stesso

        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Questa stanza è già prenotata in quelle date.");
        }

        Room room = roomRepository.findById(updated.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Stanza non trovata"));

        existing.setCheckIn(updated.getCheckIn());
        existing.setCheckOut(updated.getCheckOut());

        int nights = (int) ChronoUnit.DAYS.between(updated.getCheckIn(), updated.getCheckOut());
        existing.setNights(nights);

        existing.setRoom(room);

        double total = nights * room.getPricePerNight();
        existing.setTotalPrice(total);

        if (isAdmin && updated.getCustomer() != null) {
            Customer customer = customerRepository.findById(updated.getCustomer().getId())
                    .orElseThrow(() -> new RuntimeException("Cliente non trovato"));
            existing.setCustomer(customer);
        }

        return bookingRepository.save(existing);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public void deleteBooking(@PathVariable Long id, Principal principal) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        String userEmail = principal.getName();
        boolean isAdmin = hasRole("ADMIN");

        if (!booking.getCustomerEmail().equals(userEmail) && !isAdmin) {
            throw new SecurityException("Accesso negato: non sei il proprietario.");
        }

        bookingRepository.deleteById(id);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public List<Booking> getMyBookings(Principal principal) {
        return bookingRepository.findByCustomerEmail(principal.getName());
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<Booking> getAllBookings(Authentication authentication) {
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return bookingRepository.findAll();
        } else {
            String email = authentication.getName();
            return bookingRepository.findByCustomerEmail(email);
        }
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Booking getById(@PathVariable Long id, Principal principal) {
        Booking booking = bookingRepository.findById(id).orElseThrow();
        String email = principal.getName();
        boolean isAdmin = hasRole("ADMIN");

        if (!booking.getCustomerEmail().equals(email) && !isAdmin) {
            throw new SecurityException("Accesso negato");
        }

        return booking;
    }

    @GetMapping("/room/{roomId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public List<Booking> getBookingsByRoom(@PathVariable Long roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    @GetMapping("/room/{roomId}/booked-dates")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
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
