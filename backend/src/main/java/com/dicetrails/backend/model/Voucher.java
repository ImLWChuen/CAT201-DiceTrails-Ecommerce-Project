package com.dicetrails.backend.model;

public class Voucher {
    private String code;
    private String discountType; // "percentage" or "fixed"
    private double discountValue; // Percentage (0-100) or RM amount
    private boolean isActive;
    private String description;

    // Constructors
    public Voucher() {
    }

    public Voucher(String code, String discountType, double discountValue, boolean isActive, String description) {
        this.code = code;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.isActive = isActive;
        this.description = description;
    }

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDiscountType() {
        return discountType;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public double getDiscountValue() {
        return discountValue;
    }

    public void setDiscountValue(double discountValue) {
        this.discountValue = discountValue;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Voucher{" +
                "code='" + code + '\'' +
                ", discountType='" + discountType + '\'' +
                ", discountValue=" + discountValue +
                ", isActive=" + isActive +
                ", description='" + description + '\'' +
                '}';
    }
}
