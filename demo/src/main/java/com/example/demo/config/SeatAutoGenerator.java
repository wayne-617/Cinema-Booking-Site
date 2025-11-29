package com.example.demo.config;

import com.example.demo.entity.ShowtimeEntity;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.service.SeatService;

import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.List;
import org.springframework.boot.ApplicationRunner;

@Component
public class SeatAutoGenerator implements ApplicationRunner {

    private final ShowtimeRepository showtimeRepository;
    private final SeatService seatService;

    public SeatAutoGenerator(ShowtimeRepository showtimeRepository,
                             SeatService seatService) {
        this.showtimeRepository = showtimeRepository;
        this.seatService = seatService;
    }

    @Override
    public void run(ApplicationArguments args) {
        System.out.println(" Running SEAT AUTO-GEN after data.sql...");

        List<ShowtimeEntity> list = showtimeRepository.findAll();

        for (ShowtimeEntity showtime : list) {
            Long id = showtime.getShowtimeId();
            int count = seatService.getSeatsForShowtime(id).size();

            if (count == 0) {
                System.out.println(" Showtime " + id + " missing seats → generating...");
                seatService.generateSeatsForShowtime(id);
            } else {
                System.out.println(" Showtime " + id + " already has " + count + " seats");
            }
        }

        System.out.println("Seat generation finished!");
    }
}
