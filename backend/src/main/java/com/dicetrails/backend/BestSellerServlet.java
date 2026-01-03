package com.dicetrails.backend;

import com.dicetrails.backend.model.Order;
import com.dicetrails.backend.model.Product;
import com.dicetrails.backend.util.DataManager;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.*;
import java.util.stream.Collectors;

@WebServlet("/api/bestsellers")
public class BestSellerServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            List<Order> orders = DataManager.getInstance().getAllOrders();
            List<Product> products = DataManager.getInstance().getAllProducts();

            // Map product ID to sales count
            Map<Integer, Integer> productSales = new HashMap<>();

            for (Order order : orders) {
                // Only count confirmed sales (e.g., exclude cancelled if you have such status,
                // but for now we count all valid orders in the system or specifically
                // Shipped/Completed)
                // Assuming all orders in JSON are valid sales for now, or filter by status:
                if (!"Cancelled".equals(order.getStatus())) {
                    for (Map<String, Object> item : order.getItems()) {
                        Object idObj = item.get("_id");
                        int productId = 0;
                        if (idObj instanceof Number) {
                            productId = ((Number) idObj).intValue();
                        } else if (idObj instanceof String) {
                            try {
                                productId = Integer.parseInt((String) idObj);
                            } catch (NumberFormatException e) {
                                continue;
                            }
                        }

                        Object qtyObj = item.get("quantity");
                        int quantity = 0;
                        if (qtyObj instanceof Number) {
                            quantity = ((Number) qtyObj).intValue();
                        }

                        if (productId > 0 && quantity > 0) {
                            productSales.put(productId, productSales.getOrDefault(productId, 0) + quantity);
                        }
                    }
                }
            }

            // Sort products by sales count descending
            List<Product> bestSellers = products.stream()
                    .sorted((p1, p2) -> {
                        int sales1 = productSales.getOrDefault(p1.get_id(), 0);
                        int sales2 = productSales.getOrDefault(p2.get_id(), 0);
                        return sales2 - sales1; // Descending
                    })
                    .limit(5)
                    .collect(Collectors.toList());

            out.println(gson.toJson(bestSellers));

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Failed to load best sellers\"}");
        }
    }
}
