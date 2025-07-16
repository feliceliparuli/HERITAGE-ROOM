package com.heritageroom.heritageroom.config;

import com.heritageroom.heritageroom.model.Customer;
import com.heritageroom.heritageroom.model.Room;
import com.heritageroom.heritageroom.repository.CustomerRepository;
import com.heritageroom.heritageroom.repository.RoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(RoomRepository roomRepository, CustomerRepository customerRepository) {
        return args -> {
            if (roomRepository.count() == 0) {
                Room r1 = new Room();
                r1.setName("Camera Deluxe");
                r1.setPricePerNight(150.0);
                r1.setMaxGuests(2);

                Room r2 = new Room();
                r2.setName("Suite Panoramica");
                r2.setPricePerNight(250.0);
                r2.setMaxGuests(2);

                roomRepository.save(r1);
                roomRepository.save(r2);
            }

            if (customerRepository.count() == 0) {
                Customer c1 = new Customer();
                c1.setName("Mario Rossi");
                c1.setEmail("mario@rossi.com");
                c1.setPhone("3331234567");

                Customer c2 = new Customer();
                c2.setName("Giulia Bianchi");
                c2.setEmail("giulia@bianchi.com");
                c2.setPhone("3339876543");

                customerRepository.save(c1);
                customerRepository.save(c2);
            }
        };
    }
}
