package com.example.demo.repository;

import com.example.demo.dto.ShowtimeRequest;
import com.example.demo.entity.Showtime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeRepository extends CrudRepository<Showtime, Long> {
    @Query("SELECT new com.example.demo.dto.ShowtimeRequest(" +
          "m.movieId, m.title, m.poster_url, CAST(s.showDate AS string), CAST(s.showTime AS string)) " +
          "FROM Showtime s JOIN s.movie m " +
          "WHERE s.showDate BETWEEN :startDate AND :endDate " +
          "ORDER BY s.showDate, s.showTime")
    List<ShowtimeRequest> findShowtimesBetweenDates(@Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);
}
