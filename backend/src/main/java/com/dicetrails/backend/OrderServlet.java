package com.dicetrails.backend;

import com.dicetrails.backend.model.Order;
import com.dicetrails.backend.util.DataManager;
import com.google.gson.Gson;
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

@WebServlet(urlPatterns = { "/api/place-order", "/api/user-orders" })
public class OrderServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        String userId = req.getParameter("userId");
        if (userId == null) {
            out.println("[]");
            return;
        }

        List<Order> orders = DataManager.getInstance().getOrders(userId);
        out.println(gson.toJson(orders));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            BufferedReader reader = req.getReader();
            JsonObject jsonRequest = JsonParser.parseReader(reader).getAsJsonObject();

            Order newOrder = gson.fromJson(jsonRequest, Order.class);

            // Set default values
            newOrder.setStatus("Ready to ship");
            newOrder.setDate(System.currentTimeMillis());

            DataManager.getInstance().saveOrder(newOrder);

            // Reduce stock for each item in the order
            if (newOrder.getItems() != null) {
                for (java.util.Map<String, Object> item : newOrder.getItems()) {
                    try {
                        int productId = ((Number) item.get("_id")).intValue();
                        int quantity = ((Number) item.get("quantity")).intValue();
                        boolean stockReduced = DataManager.getInstance().reduceStock(productId, quantity);
                        if (stockReduced) {
                            System.out.println("Reduced stock for product " + productId + " by " + quantity);
                        } else {
                            System.err.println("Failed to reduce stock for product ID: " + productId);
                        }
                    } catch (Exception e) {
                        System.err.println("Error reducing stock for item: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
            }

            // If newsletter discount was applied, mark it as used for this user
            if (jsonRequest.has("newsletterDiscountApplied")
                    && jsonRequest.get("newsletterDiscountApplied").getAsBoolean()) {

                String userEmail = newOrder.getUserId();
                DataManager.getInstance().getUserByEmail(userEmail).ifPresent(user -> {
                    user.setHasUsedNewsletterDiscount(true);
                    DataManager.getInstance().updateUser(user);
                });
            }

            out.println("{\"success\": true, \"message\": \"Order Placed\"}");

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Server Error: " + e.getMessage() + "\"}");
        }
    }
}