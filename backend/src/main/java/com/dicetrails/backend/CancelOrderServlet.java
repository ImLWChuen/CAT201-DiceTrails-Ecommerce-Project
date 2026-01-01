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
            JsonObject jsonRequest = JsonParser.parseReader(reader).getAsJsonObject();

            String orderId = jsonRequest.get("orderId").getAsString();
            String userId = jsonRequest.get("userId").getAsString();

            // Get all orders
            List<Order> allOrders = DataManager.getInstance().getAllOrders();

            // Find and update the specific order
            boolean found = false;
            for (Order order : allOrders) {
                if (order.getOrderId().equals(orderId) && order.getUserId().equals(userId)) {
                    // Only allow cancellation if order is "Ready to ship"
                    if ("Ready to ship".equals(order.getStatus())) {
                        order.setStatus("Cancelled");
                        found = true;
                        break;
                    } else {
                        out.println("{\"success\": false, \"message\": \"Order cannot be cancelled\"}");
                        return;
                    }
                }
            }

            if (found) {
                // Save updated orders back to file
                DataManager.getInstance().saveOrders(allOrders);
                out.println("{\"success\": true, \"message\": \"Order cancelled successfully\"}");
            } else {
                out.println("{\"success\": false, \"message\": \"Order not found\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Server Error: " + e.getMessage() + "\"}");
        }
    }
}
