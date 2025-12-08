package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.dto.BookingHistoryDTO;
import com.example.demo.dto.BookingReviewDTO;
import com.example.demo.dto.TicketSelection;
import com.example.demo.entity.BillingEntity;
import com.example.demo.entity.BookingEntity;
import com.example.demo.entity.SeatEntity;
import com.example.demo.entity.ShowtimeEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.BillingRepository;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.EncryptionUtil;

import jakarta.transaction.Transactional;

@Service
public class BookingService {

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final BillingRepository billingRepository;
    private final BookingRepository bookingRepository;
    private final SettingsService settingsService;

    public BookingService(
            BookingRepository bookingRepository,
            BillingRepository billingRepository,
            UserRepository userRepository,
            SeatRepository seatRepository,
            ShowtimeRepository showtimeRepository,
            SettingsService settingsService
    ) {
        this.bookingRepository = bookingRepository;
        this.billingRepository = billingRepository;
        this.userRepository = userRepository;
        this.seatRepository = seatRepository;
        this.settingsService = settingsService;
        this.showtimeRepository = showtimeRepository;
    }

    // ==========================
    //      CREATE ORDER
    // ==========================
    @Transactional
    public BookingEntity createOrder(Long userId, Long showtimeId,
                                 Long billingId,
                                 List<TicketSelection> tickets,
                                 double total) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<BillingEntity> billingList = billingRepository.findAllByUser_Id(userId);
        if (billingList.isEmpty()) {
            throw new RuntimeException("Billing not found for user " + userId);
        }
         BillingEntity billing = billingRepository.findById(billingId)
            .orElseThrow(() -> new RuntimeException("Selected billing method not found"));

        if (!billing.getUser().getId().equals(userId)) {
            throw new RuntimeException("Security violation: billing does not belong to user.");
        }



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
        double onlineFee = settingsService.getOnlineFee();
        booking.setOnlineFee(onlineFee);

        booking.setTotalAmount(total + onlineFee);
        try {
            String decrypted = EncryptionUtil.decrypt(billing.getCardNumber());
            booking.setLastFour(Integer.parseInt(decrypted.substring(decrypted.length() - 4)));
        } catch (Exception e) {
            booking.setLastFour(null);
        }
        booking.setTixNo(generateTicketNumber());
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

        booking.setTixNo(generateTicketNumber());
        bookingRepository.save(booking);
    }

 
    public BookingEntity saveBooking(Long userId, BookingEntity booking) {
        List<BillingEntity> billingList = billingRepository.findAllByUser_Id(userId);
        if (billingList.isEmpty()) {
            throw new RuntimeException("Billing not found for user " + userId);
        }
        BillingEntity billing = billingList.stream()
            .filter(BillingEntity::isDefault)
            .findFirst()
            .orElse(billingList.get(0)); 

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

        return bookings.stream().map(b -> {

            BillingEntity billing = b.getBilling();

            // Get last four from THIS booking’s billing (NOT default)
            Integer lastFour = null;
            if (billing != null) {
                try {
                    String decrypted = EncryptionUtil.decrypt(billing.getCardNumber());
                    lastFour = Integer.parseInt(
                            decrypted.substring(decrypted.length() - 4)
                    );
                } catch (Exception ignored) {}
            }

            // Build seat list
            List<String> seats = b.getSeats().stream()
                    .map(s -> "Row " + s.getSeatRow() + " — Seat " + s.getSeatNumber())
                    .toList();

            Long ticketCount = (long) seats.size();

            // Customer name for ADMIN VIEW
            String customerName = (billing != null)
                    ? billing.getFirstName() + " " + billing.getLastName()
                    : null;

            return new BookingHistoryDTO(
                    b.getBookingNo(),
                    b.getMovieTitle(),
                    b.getTotalAmount(),
                    b.getPurchaseDate(),
                    b.getOnlineFee(),
                    b.getShowDateTime(),
                    lastFour,
                    ticketCount,
                    seats,
                    customerName,
                    b.getTixNo()
            );
        }).toList();
    }

    private String generateTicketNumber() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        java.util.Random random = new java.util.Random();

        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }
    
   public BookingReviewDTO toReviewDTO(BookingEntity b) {

        BillingEntity billing = b.getBilling();

        Integer lastFour = null;
        if (billing != null) {
            try {
                String decrypted = EncryptionUtil.decrypt(billing.getCardNumber());
                lastFour = Integer.parseInt(
                        decrypted.substring(decrypted.length() - 4)
                );
            } catch (Exception ignored) {}
        }

        String customerName = (billing != null)
                ? billing.getFirstName() + " " + billing.getLastName()
                : null;

        return new BookingReviewDTO(
                b.getBookingNo(),
                b.getMovieTitle(),
                b.getTotalAmount(),
                lastFour,
                b.getPurchaseDate(),
                customerName
                ,b.getTixNo()
        );
    }

    public List<BookingEntity> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional
    public void adminDeleteBooking(Long bookingId) {

        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Unbook seats
        List<SeatEntity> seats = seatRepository.findByBooking_BookingNo(bookingId);
        for (SeatEntity s : seats) {
            s.setIsBooked(false);
            s.setBooking(null);
            seatRepository.save(s);
        }

        bookingRepository.delete(booking);
    }

    @Transactional
    public void customerDeleteBooking(Long userId, Long bookingId) {

        BookingEntity booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Prevent users from deleting other people's orders
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        // Un-book seats
        List<SeatEntity> seats = seatRepository.findByBooking_BookingNo(bookingId);
        for (SeatEntity s : seats) {
            s.setIsBooked(false);
            s.setBooking(null);
            seatRepository.save(s);
        }

        bookingRepository.delete(booking);
    }

    
}