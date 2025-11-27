package com.example.demo.service;

import com.example.demo.entity.BookingEntity;
import com.example.demo.entity.SeatEntity;
import com.example.demo.entity.ShowtimeEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.dto.BookingHistoryDTO;
import com.example.demo.dto.BookingReviewDTO;
import com.example.demo.dto.TicketSelection;
import com.example.demo.entity.BillingEntity;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.EncryptionUtil;
import com.example.demo.repository.BillingRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final BillingRepository billingRepository;
    private final BookingRepository bookingRepository;

    public BookingService(
            BookingRepository bookingRepository,
            BillingRepository billingRepository,
            UserRepository userRepository,
            SeatRepository seatRepository,
            ShowtimeRepository showtimeRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.billingRepository = billingRepository;
        this.userRepository = userRepository;
        this.seatRepository = seatRepository;
        this.showtimeRepository = showtimeRepository;
    }

    // ==========================
    //      CREATE ORDER
    // ==========================
    @Transactional
    public BookingEntity createOrder(Long userId, Long showtimeId,
                                     List<TicketSelection> tickets, double total) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BillingEntity billing = billingRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Billing not found for user " + userId));

        ShowtimeEntity showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        // Build booking
        BookingEntity booking = new BookingEntity();
        booking.setUser(user);
        booking.setBilling(billing);
        booking.setMovieTitle(showtime.getMovie().getTitle());

        booking.setPurchaseDate(LocalDateTime.now());
        booking.setShowDateTime(
            LocalDateTime.of(showtime.getShowDate(), showtime.getShowTime())
        );      
        booking.setTotalAmount(total);
        try {
            String decrypted = EncryptionUtil.decrypt(billing.getCardNumber());
            booking.setLastFour(Integer.parseInt(decrypted.substring(decrypted.length() - 4)));
        } catch (Exception e) {
            booking.setLastFour(null);
        }
        BookingEntity savedBooking = bookingRepository.save(booking);

        // Assign seats
        for (TicketSelection t : tickets) {

            SeatEntity seat = seatRepository.findById(t.getSeatId())
                    .orElseThrow(() -> new RuntimeException("Seat not found: " + t.getSeatId()));

            if (seat.getIsBooked())
                throw new RuntimeException("Seat " +
                        seat.getSeatRow() + seat.getSeatNumber() + " is already booked!");

            seat.setIsBooked(true);
            seat.setBooking(savedBooking);
            seatRepository.save(seat);
        }

        return savedBooking;
    }

    private Integer getLastFourDigits(String cardNumber) {
        if (cardNumber == null) return null;
        String digits = cardNumber.replaceAll("\\D", "");
        return digits.length() >= 4
                ? Integer.parseInt(digits.substring(digits.length() - 4))
                : null;
    }

 
    public BookingEntity getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }
    public List<SeatEntity> getSeatsForBooking(Long bookingId) {
        return seatRepository.findByBooking_BookingNo(bookingId);
    }
   
    @Transactional
    public void confirmOrder(Long id) {
        BookingEntity booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setTixNo(System.currentTimeMillis()); 
        bookingRepository.save(booking);
    }

 
    public BookingEntity saveBooking(Long userId, BookingEntity booking) {
        BillingEntity billing = billingRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Billing not found for user " + userId));

        booking.setBilling(billing);

        String card = billing.getCardNumber();
        if (card != null && card.length() >= 4) {
            booking.setLastFour(Integer.parseInt(card.substring(card.length() - 4)));
        }

        return bookingRepository.save(booking);
    }

    // ==========================
    //      BOOKING LISTS
    // ==========================
    public List<BookingEntity> getBookingsForUser(Long userId) {
        return bookingRepository.findByUser_Id(userId);
    }

    public List<BookingEntity> getBookingsByBilling(Long billingUid) {
        return bookingRepository.findByBillingUid(billingUid);
    }

    public List<BookingHistoryDTO> getBookingHistory(Long userId) {
        List<BookingEntity> bookings = bookingRepository.findByUser_Id(userId);

        // Load user's billing once
        BillingEntity billing = billingRepository.findByUser_Id(userId).orElse(null);
        Integer lastFour = null;

        if (billing != null) {
            try {
                String decrypted = EncryptionUtil.decrypt(billing.getCardNumber());
                lastFour = Integer.parseInt(decrypted.substring(decrypted.length() - 4));
            } catch (Exception e) {
                lastFour = null;
            }
        }

        final Integer lastFourFinal = lastFour;

        return bookings.stream().map(b -> {
            List<String> seats = b.getSeats().stream()
                    .map(s -> "Row " + s.getSeatRow() + " — Seat " + s.getSeatNumber())
                    .toList();

            long ticketCount = seats.size();

            return new BookingHistoryDTO(
                    b.getBookingNo(),
                    b.getMovieTitle(),
                    b.getTotalAmount(),
                    b.getPurchaseDate(),
                    lastFourFinal,
                    ticketCount,
                    seats
            );
        }).toList();
    }
    public BookingReviewDTO toReviewDTO(BookingEntity b) {

        BillingEntity billing = billingRepository.findByUser_Id(b.getUser().getId()).orElse(null);
        Integer lastFour = null;

        if (billing != null) {
            try {
                String decrypted = EncryptionUtil.decrypt(billing.getCardNumber());
                lastFour = Integer.parseInt(decrypted.substring(decrypted.length() - 4));
            } catch (Exception e) {
                lastFour = null;
            }
        }

        return new BookingReviewDTO(
                b.getBookingNo(),
                b.getMovieTitle(),
                b.getTotalAmount(),
                lastFour,
                b.getPurchaseDate()
        );
    }
}