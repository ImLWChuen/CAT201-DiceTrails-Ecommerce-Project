package com.dicetrails.backend.model;

import java.util.ArrayList;
import java.util.List;

public class Review {
    private String id;
    private String productId;
    private String user;
    private int rating;
    private String date;
    private String content;
    private int helpful;
    private boolean hasMedia;
    private List<Object> media;
    private String orderId;
    private boolean isFlagged;
    private List<ReviewReport> reports;
    private List<String> helpfulUserEmails;

    public Review() {
        this.media = new ArrayList<>();
        this.reports = new ArrayList<>();
        this.helpfulUserEmails = new ArrayList<>();
    }

    public Review(String id, String productId, String user, int rating, String date, String content, int helpful,
            boolean hasMedia, List<Object> media, String orderId) {
        this.id = id;
        this.productId = productId;
        this.user = user;
        this.rating = rating;
        this.date = date;
        this.content = content;
        this.helpful = helpful;
        this.hasMedia = hasMedia;
        this.media = media != null ? media : new ArrayList<>();
        this.orderId = orderId;
        this.reports = new ArrayList<>();
        this.helpfulUserEmails = new ArrayList<>();
    }

    public List<String> getHelpfulUserEmails() {
        return helpfulUserEmails;
    }

    public void setHelpfulUserEmails(List<String> helpfulUserEmails) {
        this.helpfulUserEmails = helpfulUserEmails != null ? helpfulUserEmails : new ArrayList<>();
        this.helpful = this.helpfulUserEmails.size();
    }

    public boolean toggleHelpful(String userEmail) {
        if (this.helpfulUserEmails == null) {
            this.helpfulUserEmails = new ArrayList<>();
        }

        if (this.helpfulUserEmails.contains(userEmail)) {
            this.helpfulUserEmails.remove(userEmail);
            this.helpful = Math.max(0, this.helpful - 1);
            return false; // Unmarked
        } else {
            this.helpfulUserEmails.add(userEmail);
            this.helpful++;
            return true; // Marked
        }
    }

    public boolean isFlagged() {
        return isFlagged;
    }

    public void setFlagged(boolean isFlagged) {
        this.isFlagged = isFlagged;
    }

    public List<ReviewReport> getReports() {
        return reports;
    }

    public void setReports(List<ReviewReport> reports) {
        this.reports = reports;
        this.isFlagged = reports != null && !reports.isEmpty();
    }

    public void addReport(ReviewReport report) {
        if (this.reports == null) {
            this.reports = new ArrayList<>();
        }
        this.reports.add(report);
        this.isFlagged = true;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getHelpful() {
        return helpful;
    }

    public void setHelpful(int helpful) {
        this.helpful = helpful;
    }

    public boolean isHasMedia() {
        return hasMedia;
    }

    public void setHasMedia(boolean hasMedia) {
        this.hasMedia = hasMedia;
    }

    public List<Object> getMedia() {
        return media;
    }

    public void setMedia(List<Object> media) {
        this.media = media;
        this.hasMedia = media != null && !media.isEmpty();
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
}
