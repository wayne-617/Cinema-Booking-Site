package com.example.demo.dto;

public class ProfileUpdateRequestDTO {
    private Long userId;
    private String email;          // shouldn't change, but we get it anyway
    private String newPassword;    // optional (null if not changing)
    private Integer promo_opt_in;  // 1 or 0 (you'll add promo later to users)

    private BillingUpdateDTO billing;

    public static class BillingUpdateDTO {
        private String firstName;
        private String lastName;
        private String phone;
        private String street;
        private String city;
        private String state;
        private String zip;
        private String cardType;
        private String lastFour;
        private String expMonth;
        private String expYear;

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getStreet() { return street; }
        public void setStreet(String street) { this.street = street; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }

        public String getZip() { return zip; }
        public void setZip(String zip) { this.zip = zip; }

        public String getCardType() { return cardType; }
        public void setCardType(String cardType) { this.cardType = cardType; }

        public String getLastFour() { return lastFour; }
        public void setLastFour(String lastFour) { this.lastFour = lastFour; }

        public String getExpMonth() { return expMonth; }
        public void setExpMonth(String expMonth) { this.expMonth = expMonth; }

        public String getExpYear() { return expYear; }
        public void setExpYear(String expYear) { this.expYear = expYear; }
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

    public Integer getPromo_opt_in() { return promo_opt_in; }
    public void setPromo_opt_in(Integer promo_opt_in) { this.promo_opt_in = promo_opt_in; }

    public BillingUpdateDTO getBilling() { return billing; }
    public void setBilling(BillingUpdateDTO billing) { this.billing = billing; }
    
}
