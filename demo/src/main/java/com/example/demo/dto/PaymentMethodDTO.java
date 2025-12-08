package com.example.demo.dto;

public class PaymentMethodDTO {
    private Long id; // Billing UID
    private String cardType;
    private String maskedNumber;
    private Integer expMonth;
    private Integer expYear;
    private boolean isDefault;

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }

    public String getMaskedNumber() { return maskedNumber; }
    public void setMaskedNumber(String maskedNumber) { this.maskedNumber = maskedNumber; }

    public Integer getExpMonth() { return expMonth; }
    public void setExpMonth(Integer expMonth) { this.expMonth = expMonth; }

    public Integer getExpYear() { return expYear; }
    public void setExpYear(Integer expYear) { this.expYear = expYear; }

    public boolean isDefault() { return isDefault;  }
    public void setDefault(boolean isDefault) { this.isDefault = isDefault; }
    public void setIsDefault(boolean isDefault) { this.isDefault = isDefault; }

}
