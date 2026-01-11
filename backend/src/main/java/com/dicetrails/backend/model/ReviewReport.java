package com.dicetrails.backend.model;

public class ReviewReport {
    private String reason;
    private String date;

    public ReviewReport() {
    }

    public ReviewReport(String reason, String date) {
        this.reason = reason;
        this.date = date;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
