package com.heritageroom.heritageroom.controller;

import com.heritageroom.heritageroom.model.Booking;
import com.heritageroom.heritageroom.model.Customer;
import com.heritageroom.heritageroom.repository.BookingRepository;
import com.heritageroom.heritageroom.repository.CustomerRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;

    public BookingController(BookingRepository bookingRepository, CustomerRepository customerRepository) {
        this.bookingRepository = bookingRepository;
        this.customerRepository = customerRepository;
    }

    // ✅ Crea prenotazione (USER o ADMIN)
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking, Principal principal) {
        validateDates(booking);
        Customer customer = customerRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        booking.setCustomer(customer);
        booking.setNights((int) ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut()));
        return bookingRepository.save(booking);
    }

    // ✅ Modifica prenotazione (solo proprietario o ADMIN)
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

    // ✅ Cancella prenotazione (solo proprietario o ADMIN)
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

    // ✅ Visualizza le proprie prenotazioni
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/me")
    public List<Booking> getMyBookings(Principal principal) {
        return bookingRepository.findByCustomerEmail(principal.getName());
    }

    // ✅ Solo ADMIN vede tutte le prenotazioni
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // 🔒 Controllo se l'utente ha un ruolo specifico
    private boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> r.equals("ROLE_" + role));
    }

    // 🔍 Validazione logica delle date
    private void validateDates(Booking booking) {
        if (booking.getCheckIn() == null || booking.getCheckOut() == null) {
            throw new IllegalArgumentException("Le date non possono essere null.");
        }
        if (!booking.getCheckOut().isAfter(booking.getCheckIn())) {
            throw new IllegalArgumentException("La data di check-out deve essere successiva al check-in.");
        }
    }
}
