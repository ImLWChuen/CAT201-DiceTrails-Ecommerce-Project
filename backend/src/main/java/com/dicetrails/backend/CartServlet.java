package com.dicetrails.backend;

import com.dicetrails.backend.model.User;
import com.dicetrails.backend.util.DataManager;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.Map;
import java.util.Optional;

@WebServlet(urlPatterns = { "/api/update-cart", "/api/get-cart" })
public class CartServlet extends HttpServlet {
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
        String pathInfo = request.getServletPath();

        System.out.println("CartServlet received request: " + pathInfo);

        try {
            BufferedReader reader = request.getReader();
            JsonObject jsonRequest = new JsonParser().parse(reader).getAsJsonObject();

            if (!jsonRequest.has("userId")) {
                System.out.println("Error: Missing userId in request");
                out.println("{\"success\": false, \"message\": \"Missing userId\"}");
                return;
            }

            // userId now corresponds to email
            String email = jsonRequest.get("userId").getAsString();
            System.out.println("Processing for user email: " + email);

            Optional<User> userOpt = DataManager.getInstance().getUserByEmail(email);

            if (!userOpt.isPresent()) {
                System.out.println("Error: User not found in DataManager");
                out.println("{\"success\": false, \"message\": \"User not found\"}");
                return;
            }

            User user = userOpt.get();

            if (pathInfo.equals("/api/update-cart")) {
                // Parse cart object from request
                System.out.println("Updating cart for user: " + user.getUsername());
                Type cartType = new TypeToken<Map<String, Integer>>() {
                }.getType();
                Map<String, Integer> newCart = gson.fromJson(jsonRequest.get("cart"), cartType);

                System.out.println("New Cart Content: " + newCart);
                user.setCart(newCart);
                DataManager.getInstance().updateUser(user); // Persistence
                System.out.println("Cart saved via DataManager");

                out.println("{\"success\": true, \"message\": \"Cart updated\"}");
            } else if (pathInfo.equals("/api/get-cart")) {
                System.out.println("Getting cart for user: " + user.getUsername());
                JsonObject successResponse = new JsonObject();
                successResponse.addProperty("success", true);
                successResponse.add("cart", gson.toJsonTree(user.getCart()));
                out.println(gson.toJson(successResponse));
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Exception in CartServlet: " + e.getMessage());
            out.println("{\"success\": false, \"message\": \"Invalid request data\"}");
        }
    }
}
