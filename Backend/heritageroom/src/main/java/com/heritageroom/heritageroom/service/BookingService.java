package com.heritageroom.heritageroom.service;

import com.heritageroom.heritageroom.dto.BookingRequest;
import com.heritageroom.heritageroom.model.Booking;
import com.heritageroom.heritageroom.model.Customer;
import com.heritageroom.heritageroom.model.Room;
import com.heritageroom.heritageroom.repository.BookingRepository;
import com.heritageroom.heritageroom.repository.CustomerRepository;
import com.heritageroom.heritageroom.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Booking createBooking(BookingRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        validateDates(request.getCheckIn(), request.getCheckOut());
        checkAvailability(room.getId(), request.getCheckIn(), request.getCheckOut(), null);

        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        double totalPrice = nights * room.getPricePerNight();

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setNights((int) nights);
        booking.setTotalPrice(totalPrice);

        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long bookingId, BookingRequest request) {
        Booking existing = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        validateDates(request.getCheckIn(), request.getCheckOut());
        checkAvailability(room.getId(), request.getCheckIn(), request.getCheckOut(), bookingId);

        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        double totalPrice = nights * room.getPricePerNight();

        existing.setCustomer(customer);
        existing.setRoom(room);
        existing.setCheckIn(request.getCheckIn());
        existing.setCheckOut(request.getCheckOut());
        existing.setNights((int) nights);
        existing.setTotalPrice(totalPrice);

        return bookingRepository.save(existing);
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            throw new IllegalArgumentException("Le date non possono essere null.");
        }
        if (!checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("La data di check-out deve essere successiva al check-in.");
        }
    }

    private void checkAvailability(Long roomId, LocalDate checkIn, LocalDate checkOut, Long excludeBookingId) {
        List<Booking> bookings = bookingRepository
                .findByRoomIdAndCheckOutAfterAndCheckInBefore(roomId, checkIn, checkOut);

        if (excludeBookingId != null) {
            bookings.removeIf(b -> b.getId().equals(excludeBookingId));
        }

        if (!bookings.isEmpty()) {
            throw new IllegalStateException("Questa stanza è già prenotata in quelle date.");
        }
    }
    
}
