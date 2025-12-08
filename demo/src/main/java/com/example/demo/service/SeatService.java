package com.example.demo.service;

import com.example.demo.entity.SeatEntity;
import com.example.demo.entity.ShowtimeEntity;
import com.example.demo.entity.BookingEntity;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.ShowtimeRepository;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final ShowtimeRepository showtimeRepository;


    
    public SeatService(SeatRepository seatRepository,
                       ShowtimeRepository showtimeRepository) {
        this.seatRepository = seatRepository;
        this.showtimeRepository = showtimeRepository;
    }


   
    // Generate seats using the showtimeId
    public void generateSeatsForShowtime(Long showtimeId) {

        ShowtimeEntity showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found: " + showtimeId));

        List<SeatEntity> seats = new ArrayList<>();

        for (char row = 'A'; row <= 'F'; row++) {
            for (int num = 1; num <= 12; num++) {

                SeatEntity seat = new SeatEntity();
                seat.setSeatRow(String.valueOf(row));
                seat.setSeatNumber(num);
                seat.setIsBooked(false);
                seat.setShowtime(showtime);  // ✔ REAL persisted entity

                seats.add(seat);
            }
        }

        seatRepository.saveAll(seats);

        System.out.println("Created " + seats.size() + " seats for showtime " + showtimeId);
    }

    public List<SeatEntity> getSeatsForShowtime(Long showtimeId) {
        return seatRepository.findByShowtime_ShowtimeId(showtimeId);
    }


    // Basic booking
    public void bookSeats(List<Long> seatIds) {
        for (Long id : seatIds) {
            SeatEntity seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found: " + id));

            if (seat.getIsBooked()) {
                throw new RuntimeException("Seat " +
                        seat.getSeatRow() + seat.getSeatNumber() + " already booked!");
            }

            seat.setIsBooked(true);
            seatRepository.save(seat);
        }
    }

    // Booking with booking record
    public void bookSeats(List<Long> seatIds, BookingEntity booking) {
        List<SeatEntity> seats = seatRepository.findAllById(seatIds);

        for (SeatEntity seat : seats) {
            if (!seat.getIsBooked()) {
                seat.setIsBooked(true);
                seat.setBooking(booking);
            }
        }

        seatRepository.saveAll(seats);
        System.out.println(seatIds.size() + " seats booked for booking " + booking.getBookingNo());
    }

}
