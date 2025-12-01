package com.example.demo.controller;

import com.example.demo.entity.BookingEntity;
import com.example.demo.entity.SeatEntity;
import com.example.demo.dto.BookingReviewDTO;
import com.example.demo.dto.TicketSelection;
import com.example.demo.service.BookingService;
import com.example.demo.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final BookingService bookingService;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;


    public OrderController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * CREATE ORDER
     * Called from Order Summary Page BEFORE confirmation screen.
     */
    @PostMapping("/create")
    public ResponseEntity<BookingEntity> createOrder(
            @RequestParam Long userId,
            @RequestParam Long showtimeId,
            @RequestBody List<TicketSelection> tickets
    ) {
         var user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));

       
        
        double total = tickets.stream()
                .mapToDouble(ticket -> switch (ticket.getType()) {
                    case "ADULT" -> 12.50;
                    case "CHILD" -> 8.00;
                    case "SENIOR" -> 10.00;
                    default -> 12.50;
                })
                .sum();

        BookingEntity booking = bookingService.createOrder(userId, showtimeId, tickets, total);
        String movie = booking.getMovieTitle();
        Integer lastFour = booking.getLastFour();
        LocalDateTime date = booking.getPurchaseDate();
        LocalDateTime showtime = booking.getShowDateTime();
          try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(user.getUsername());
                message.setSubject("Showtime Order Confirmed");
                message.setText("Authorized purchase for following showtime confirmed:\n" + "Movie: " + movie + "\n" + "Showtime: " + showtime + "\n" + "Total: $"+ total + "\n" +  "Card: " + lastFour + "\n" + "Purchase Date: "+ date);
                mailSender.send(message);
            } catch (Exception e) {
                e.printStackTrace();
            }       
        return ResponseEntity.ok(booking);
    }

    /**
     * REVIEW ORDER
     * Called by Order Confirmation Page to show:
     * - movie
     * - price
     * - last four digits
     * - purchase date
     */
    @GetMapping("/review/{id}")
    public ResponseEntity<BookingReviewDTO> getOrderReview(@PathVariable Long id) {

        BookingEntity booking = bookingService.getBookingById(id);
        
        BookingReviewDTO dto = bookingService.toReviewDTO(booking);

        return ResponseEntity.ok(dto);
    }
    @GetMapping("/{bookingId}/seats")
    public ResponseEntity<List<SeatEntity>> getSeatsForOrder(@PathVariable Long bookingId) {
        List<SeatEntity> seats = bookingService.getSeatsForBooking(bookingId);
        return ResponseEntity.ok(seats);
    }

    /**
     * CONFIRM ORDER
     * Marks the order as fully finalized. Generates a transaction number.
     */
    @PostMapping("/confirm/{id}")
    public ResponseEntity<String> confirmOrder(@PathVariable Long id) {

        bookingService.confirmOrder(id);

        return ResponseEntity.ok("Order confirmed");
    }
}
