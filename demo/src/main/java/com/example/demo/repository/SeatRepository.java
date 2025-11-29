package com.example.demo.repository;

import com.example.demo.entity.SeatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SeatRepository extends JpaRepository<SeatEntity, Long> {

    List<SeatEntity> findByShowtime_ShowtimeId(Long showtimeId);
    List<SeatEntity> findByBooking_BookingNo(Long bookingNo);

}
