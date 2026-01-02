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
    private List<String> media;
    private String orderId;

    public Review() {
        this.media = new ArrayList<>();
    }

    public Review(String id, String productId, String user, int rating, String date, String content, int helpful,
            boolean hasMedia, List<String> media, String orderId) {
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

    public List<String> getMedia() {
        return media;
    }

    public void setMedia(List<String> media) {
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
