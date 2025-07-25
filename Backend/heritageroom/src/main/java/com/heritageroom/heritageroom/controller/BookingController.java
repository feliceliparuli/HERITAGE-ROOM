package com.heritageroom.heritageroom.controller;

import com.heritageroom.heritageroom.dto.BookingRequest;
import com.heritageroom.heritageroom.model.Booking;
import com.heritageroom.heritageroom.model.Customer;
import com.heritageroom.heritageroom.model.Room;
import com.heritageroom.heritageroom.repository.BookingRepository;
import com.heritageroom.heritageroom.repository.CustomerRepository;
import com.heritageroom.heritageroom.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setNights(request.getCheckOut().compareTo(request.getCheckIn()));
        booking.setTotalPrice(
                request.getCheckOut().compareTo(request.getCheckIn()) * room.getPricePerNight()
        );

        return bookingRepository.save(booking);
    }

    @PutMapping("/{id}")
    public Booking updateBooking(@PathVariable Long id, @RequestBody BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        booking.setCustomer(customer);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setNights(request.getCheckOut().compareTo(request.getCheckIn()));
        booking.setTotalPrice(
                request.getCheckOut().compareTo(request.getCheckIn()) * room.getPricePerNight()
        );

        return bookingRepository.save(booking);
    }

    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        bookingRepository.deleteById(id);
    }

    @GetMapping("/customer/{email}")
    public List<Booking> getBookingsByCustomerEmail(@PathVariable String email) {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getCustomer() != null && b.getCustomer().getEmail().equalsIgnoreCase(email))
                .toList();
    }
}
