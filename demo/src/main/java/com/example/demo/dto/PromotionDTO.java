package com.example.demo.dto;

public class PromotionDTO {
    private Long id;
    private String title;
    private String description;
    private String code;
    private Integer discount;
    private Boolean active;
    private Boolean sendEmail;

    public PromotionDTO() {
    }

    public PromotionDTO(Long id, String title, String description, String code, Integer discount, Boolean active) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.discount = discount;
        this.active = active;
    }

    public PromotionDTO(Long id, String title, String description, String code, Integer discount, Boolean active, Boolean sendEmail) {
        this(id, title, description, code, discount, active);
        this.sendEmail = sendEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getSendEmail() {
        return sendEmail;
    }

    public void setSendEmail(Boolean sendEmail) {
        this.sendEmail = sendEmail;
    }
}