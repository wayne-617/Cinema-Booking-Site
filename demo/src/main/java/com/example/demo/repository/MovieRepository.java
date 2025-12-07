package com.example.demo.repository;

import com.example.demo.entity.Movie;
import com.example.demo.entity.MovieStatus;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    
     Optional<Movie> findByTitle(String title);
     List<Movie> findByTitleContainingIgnoreCase(String title);
     List<Movie> findByCategoryContainingIgnoreCase(String category);
     List<Movie> findBycastMembersContainingIgnoreCase(String castMembers);
     List<Movie> findByDirectorContainingIgnoreCase(String director);
     List<Movie> findByProducerContainingIgnoreCase(String producer);
     List<Movie> findBySynopsisContainingIgnoreCase(String synopsis);
     List<Movie> findByReviewsContainingIgnoreCase(String reviews);
     List<Movie> findBympaaRatingContainingIgnoreCase(String mpaaRating);
     List<Movie> findByStatus(MovieStatus status);
     List<Movie> findByTicketPrice(Double ticketPrice);
     
     
}