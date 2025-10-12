package com.example.demo.repository;

import com.example.demo.entity.Movie;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    
     Optional<Movie> findByTitle(String title);
     List<Movie> findByTitleContainingIgnoreCase(String title);
}