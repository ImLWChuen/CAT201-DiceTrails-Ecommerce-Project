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
import java.util.ArrayList;
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

        List<Review> reviews;
        if (productId == null || productId.trim().isEmpty()) {
            reviews = DataManager.getInstance().getAllReviews();
        } else {
            reviews = DataManager.getInstance().getReviews(productId);
        }

        System.out.println("ReviewServlet GET: returning " + reviews.size() + " reviews");
        out.println(gson.toJson(reviews));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            BufferedReader reader = req.getReader();
            JsonObject jsonRequest = new JsonParser().parse(reader).getAsJsonObject();

            Review newReview = gson.fromJson(jsonRequest, Review.class);

            if (newReview.getId() == null || newReview.getId().isEmpty()) {
                newReview.setId(UUID.randomUUID().toString());
            }
            if (newReview.getDate() == null || newReview.getDate().isEmpty()) {
                newReview.setDate(java.time.Instant.now().toString());
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

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            String reviewId = req.getParameter("id");
            System.out.println("ReviewServlet DELETE: id=" + reviewId);

            if (reviewId == null || reviewId.trim().isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"success\": false, \"message\": \"Review ID is required\"}");
                return;
            }

            boolean success = DataManager.getInstance().deleteReview(reviewId);

            if (success) {
                out.println("{\"success\": true, \"message\": \"Review Deleted\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.println("{\"success\": false, \"message\": \"Review not found\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"success\": false, \"message\": \"Server Error: " + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            BufferedReader reader = req.getReader();
            JsonObject jsonRequest = new JsonParser().parse(reader).getAsJsonObject();

            String action = jsonRequest.has("action") ? jsonRequest.get("action").getAsString() : "update";

            if ("report".equals(action)) {
                String reviewId = jsonRequest.get("reviewId").getAsString();
                com.dicetrails.backend.model.ReviewReport report = gson.fromJson(jsonRequest.get("report"),
                        com.dicetrails.backend.model.ReviewReport.class);

                DataManager.getInstance().addReportToReview(reviewId, report);
                out.println("{\"success\": true, \"message\": \"Review Reported\"}");
            } else if ("unflag".equals(action)) {
                String reviewId = jsonRequest.get("reviewId").getAsString();
                // Find review and clear flags
                List<Review> allReviews = DataManager.getInstance().getAllReviews();
                boolean found = false;
                for (Review r : allReviews) {
                    if (r.getId().equals(reviewId)) {
                        r.setFlagged(false);
                        r.setReports(new ArrayList<>());
                        found = true;
                        break;
                    }
                }
                if (found) {
                    DataManager.getInstance().saveReviews(allReviews); // Need systematic saveReviews
                    out.println("{\"success\": true, \"message\": \"Review Unflagged\"}");
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.println("{\"success\": false, \"message\": \"Review not found\"}");
                }
            } else if ("helpful".equals(action)) {
                String reviewId = jsonRequest.get("reviewId").getAsString();
                String userEmail = jsonRequest.get("userEmail").getAsString();

                boolean isHelpful = DataManager.getInstance().toggleHelpfulReview(reviewId, userEmail);
                out.println("{\"success\": true, \"isHelpful\": " + isHelpful + "}");
            } else {
                out.println("{\"success\": false, \"message\": \"Unknown action\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"success\": false, \"message\": \"Server Error: " + e.getMessage() + "\"}");
        }
    }
}
