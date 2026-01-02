package com.dicetrails.backend;

import com.dicetrails.backend.model.Review;
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
import java.util.UUID;

@WebServlet(urlPatterns = { "/api/reviews" })
public class ReviewServlet extends HttpServlet {

    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        String productId = req.getParameter("productId");
        System.out.println("ReviewServlet GET: productId=" + productId);

        List<Review> reviews = DataManager.getInstance().getReviews(productId);
        System.out.println("ReviewServlet GET: returning " + reviews.size() + " reviews");
        out.println(gson.toJson(reviews));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            BufferedReader reader = req.getReader();
            JsonObject jsonRequest = JsonParser.parseReader(reader).getAsJsonObject();

            Review newReview = gson.fromJson(jsonRequest, Review.class);

            if (newReview.getId() == null || newReview.getId().isEmpty()) {
                newReview.setId(UUID.randomUUID().toString());
            }
            if (newReview.getDate() == null) {
                newReview.setDate(new java.util.Date().toString());
            }

            // Ensure hasMedia matches media list presence
            if (newReview.getMedia() != null && !newReview.getMedia().isEmpty()) {
                newReview.setHasMedia(true);
            }

            System.out.println(
                    "ReviewServlet POST: Adding review " + newReview.getId() + ", hasMedia=" + newReview.isHasMedia());

            DataManager.getInstance().addReview(newReview);

            if (newReview.getOrderId() != null && !newReview.getOrderId().isEmpty()) {
                DataManager.getInstance().markOrderItemAsReviewed(newReview.getOrderId(), newReview.getProductId());
            }

            out.println("{\"success\": true, \"message\": \"Review Added\"}");

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Server Error: " + e.getMessage() + "\"}");
        }
    }
}
