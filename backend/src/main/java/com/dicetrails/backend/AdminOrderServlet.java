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

@WebServlet(urlPatterns = { "/api/all-orders", "/api/update-order-status", "/api/delete-order" })
public class AdminOrderServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        // Get all orders for admin
        List<Order> allOrders = DataManager.getInstance().getAllOrders();
        out.println(gson.toJson(allOrders));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        String path = req.getServletPath();

        try {
            BufferedReader reader = req.getReader();
            JsonObject jsonRequest = new JsonParser().parse(reader).getAsJsonObject();

            if ("/api/delete-order".equals(path)) {
                String orderId = jsonRequest.get("orderId").getAsString();
                boolean success = DataManager.getInstance().deleteOrder(orderId);
                if (success) {
                    out.println("{\"success\": true, \"message\": \"Order deleted successfully\"}");
                } else {
                    out.println("{\"success\": false, \"message\": \"Order not found\"}");
                }
            } else if ("/api/update-order-status".equals(path)) {
                String orderId = jsonRequest.get("orderId").getAsString();
                String newStatus = jsonRequest.get("status").getAsString();

                boolean success = DataManager.getInstance().updateOrderStatus(orderId, newStatus);

                if (success) {
                    out.println("{\"success\": true, \"message\": \"Order status updated\"}");
                } else {
                    out.println("{\"success\": false, \"message\": \"Order not found\"}");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Server Error: \" + e.getMessage() + \"\"}");
        }
    }
}
