package com.dicetrails.backend;

import com.dicetrails.backend.model.User;
import com.dicetrails.backend.util.DataManager;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Optional;

@WebServlet("/api/subscribe-newsletter")
public class NewsletterServlet extends HttpServlet {
    private final Gson gson = new Gson();

    private void addCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        addCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        try {
            BufferedReader reader = request.getReader();
            JsonObject jsonRequest = new JsonParser().parse(reader).getAsJsonObject();

            String email = jsonRequest.get("email").getAsString();

            Optional<User> userOpt = DataManager.getInstance().getUserByEmail(email);

            if (userOpt.isPresent()) {
                User user = userOpt.get();

                if (user.isNewsletterSubscribed()) {
                    out.println("{\"success\": false, \"message\": \"You are already subscribed to our newsletter\"}");
                    return;
                }

                user.setNewsletterSubscribed(true);
                DataManager.getInstance().updateUser(user);

                JsonObject successResponse = new JsonObject();
                successResponse.addProperty("success", true);
                successResponse.addProperty("message",
                        "Successfully subscribed to newsletter! You'll get 20% off your first order.");
                out.println(gson.toJson(successResponse));
            } else {
                out.println("{\"success\": false, \"message\": \"User not found. Please log in first.\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Invalid request data\"}");
        }
    }
}
