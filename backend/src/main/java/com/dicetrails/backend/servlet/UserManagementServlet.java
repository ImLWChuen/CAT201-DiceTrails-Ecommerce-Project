package com.dicetrails.backend.servlet;

import com.dicetrails.backend.util.DataManager;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;

@WebServlet(urlPatterns = {
        "/api/delete-user",
        "/api/all-users"
})
public class UserManagementServlet extends HttpServlet {
    private DataManager dataManager;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        dataManager = DataManager.getInstance();
        gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Enable CORS
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        String path = request.getServletPath();

        try {
            if ("/api/all-users".equals(path)) {
                // Return all users for admin dashboard
                response.getWriter().write(gson.toJson(dataManager.getAllUsers()));
            } else {
                sendErrorResponse(response, "Invalid endpoint");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(response, "Server error: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Enable CORS
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        String path = request.getServletPath();

        try {
            if ("/api/delete-user".equals(path)) {
                handleDeleteUser(request, response);
            } else {
                sendErrorResponse(response, "Invalid endpoint");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(response, "Server error: " + e.getMessage());
        }
    }

    private void handleDeleteUser(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        JsonObject requestData = gson.fromJson(getRequestBody(request), JsonObject.class);
        String userEmailToDelete = requestData.get("userEmail").getAsString();
        String requestingAdminEmail = requestData.has("adminEmail") ? requestData.get("adminEmail").getAsString()
                : null;

        // Verify requesting user is admin
        if (requestingAdminEmail == null) {
            sendErrorResponse(response, "Admin email is required");
            return;
        }

        // Prevent admin from deleting themselves
        if (userEmailToDelete.equals(requestingAdminEmail)) {
            sendErrorResponse(response, "Cannot delete your own account");
            return;
        }

        // Delete user and all associated data
        boolean success = dataManager.deleteUserCompletely(userEmailToDelete);

        if (success) {
            JsonObject responseData = new JsonObject();
            responseData.addProperty("success", true);
            responseData.addProperty("message", "User and all associated data deleted successfully");
            response.getWriter().write(gson.toJson(responseData));
        } else {
            sendErrorResponse(response, "User not found or deletion failed");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private String getRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        return buffer.toString();
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("success", false);
        jsonResponse.addProperty("message", message);
        response.getWriter().write(gson.toJson(jsonResponse));
    }
}
