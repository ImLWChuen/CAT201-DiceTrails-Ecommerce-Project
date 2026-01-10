package com.dicetrails.backend;

import com.dicetrails.backend.model.Order;
import com.dicetrails.backend.util.DataManager;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/api/cancel-order")
public class CancelOrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setHeader("Access-Control-Allow-Origin", "*");
        PrintWriter out = resp.getWriter();

        try {
            BufferedReader reader = req.getReader();
            JsonObject jsonRequest = new JsonParser().parse(reader).getAsJsonObject();

            String orderId = jsonRequest.get("orderId").getAsString();
            String userId = jsonRequest.get("userId").getAsString();

            // Get all orders
            List<Order> allOrders = DataManager.getInstance().getAllOrders();

            // Find and update the specific order
            Order orderToCancel = null;
            for (Order order : allOrders) {
                if (order.getOrderId().equals(orderId) && order.getUserId().equals(userId)) {
                    orderToCancel = order;

                    // Only allow cancellation if order is not shipped or completed
                    if ("Shipped".equals(order.getStatus()) || "Completed".equals(order.getStatus())) {
                        out.println("{\"success\": false, \"message\": \"Cannot cancel shipped or completed orders\"}");
                        return;
                    }

                    // Restore stock for each item in the order
                    if (order.getItems() != null) {
                        for (java.util.Map<String, Object> item : order.getItems()) {
                            try {
                                int productId = ((Number) item.get("_id")).intValue();
                                int quantity = ((Number) item.get("quantity")).intValue();
                                boolean stockRestored = DataManager.getInstance().increaseStock(productId, quantity);
                                if (stockRestored) {
                                    System.out.println("Restored stock for product " + productId + " by " + quantity);
                                } else {
                                    System.err.println("Failed to restore stock for product ID: " + productId);
                                }
                            } catch (Exception e) {
                                System.err.println("Error restoring stock for item: " + e.getMessage());
                                e.printStackTrace();
                            }
                        }
                    }

                    // Update order status to Cancelled
                    order.setStatus("Cancelled");
                    break;
                }
            }

            if (orderToCancel == null) {
                out.println("{\"success\": false, \"message\": \"Order not found\"}");
                return;
            }

            // Save updated orders
            DataManager.getInstance().saveOrders(allOrders);

            out.println("{\"success\": true, \"message\": \"Order cancelled successfully\"}");

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Server error: " + e.getMessage() + "\"}");
        }
    }
}
