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
import java.util.UUID;

@WebServlet("/api/signup")
public class SignupServlet extends HttpServlet {
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
            JsonObject jsonRequest = JsonParser.parseReader(reader).getAsJsonObject();

            String username = jsonRequest.get("username").getAsString();
            String email = jsonRequest.get("email").getAsString();
            String password = jsonRequest.get("password").getAsString();

            if (DataManager.getInstance().getUserByEmail(email).isPresent()) {
                out.println(String.format("{\"success\": false, \"message\": \"Email %s already exists\"}", email));
                return;
            }

            // Using email as identifier, so no separate ID needed
            User newUser = new User(username, email, password);
            DataManager.getInstance().addUser(newUser);

            JsonObject successResponse = new JsonObject();
            successResponse.addProperty("success", true);
            successResponse.addProperty("message", "User registered successfully");

            JsonObject userJson = new JsonObject();
            userJson.addProperty("userId", newUser.getEmail()); // Using email as userId for frontend
            userJson.addProperty("username", newUser.getUsername());
            userJson.addProperty("email", newUser.getEmail());

            successResponse.add("user", userJson);

            out.println(gson.toJson(successResponse));

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Invalid request data\"}");
        }
    }
}
