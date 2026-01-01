package com.dicetrails.backend.model;

import java.util.List;
import java.util.Map;

public class Order {
    private String orderId;
    
    private String userId; 
    
    private Map<String, String> deliveryAddress; 
    
    private String paymentMethod; 
    
    private double totalAmount; 
    
    private long date; 
    
    private String status; 
    
    private List<Map<String, Object>> items; 

    public Order() {}

    public Order(String userId, Map<String, String> deliveryAddress, String paymentMethod, 
                 double totalAmount, List<Map<String, Object>> items) {
        this.userId = userId;
        this.deliveryAddress = deliveryAddress;
        this.paymentMethod = paymentMethod;
        this.totalAmount = totalAmount;
        this.items = items;
        this.date = System.currentTimeMillis();
        this.status = "Order Placed";
    }
    
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Map<String, String> getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(Map<String, String> deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public long getDate() {
        return date;
    }

    public void setDate(long date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Map<String, Object>> getItems() {
        return items;
    }

    public void setItems(List<Map<String, Object>> items) {
        this.items = items;
    }
}