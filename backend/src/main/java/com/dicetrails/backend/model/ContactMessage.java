package com.dicetrails.backend.model;

public class ContactMessage {
    private String id;
    private String name;
    private String email;
    private String message;
    private long date;
    private boolean read;

    public ContactMessage(String id, String name, String email, String message, long date) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.message = message;
        this.date = date;
        this.read = false;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getDate() {
        return date;
    }

    public void setDate(long date) {
        this.date = date;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}
