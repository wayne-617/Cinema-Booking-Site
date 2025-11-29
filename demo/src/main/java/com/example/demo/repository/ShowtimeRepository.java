package com.example.demo.repository;

import com.example.demo.dto.ShowtimeRequest;
import com.example.demo.entity.ShowtimeEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<ShowtimeEntity, Long> {

    @Query("SELECT new com.example.demo.dto.ShowtimeRequest(" +
       "s.showtimeId, m.movieId, m.title, m.poster_url, " +
       "CAST(s.showDate AS string), CAST(s.showTime AS string)) " +
       "FROM ShowtimeEntity s JOIN s.movie m " +
       "WHERE s.showDate BETWEEN :startDate AND :endDate " +
       "ORDER BY s.showDate, s.showTime")
    List<ShowtimeRequest> findShowtimesBetweenDates(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<ShowtimeEntity> findByMovie_MovieId(Long movieId);
    

    
}

