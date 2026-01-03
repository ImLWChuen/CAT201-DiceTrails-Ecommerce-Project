package com.dicetrails.backend.servlet;

import com.dicetrails.backend.model.Voucher;
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
import java.util.List;
import java.util.Optional;

@WebServlet(urlPatterns = {
        "/api/vouchers",
        "/api/add-voucher",
        "/api/update-voucher",
        "/api/delete-voucher",
        "/api/validate-voucher",
        "/api/active-vouchers"
})
public class VoucherServlet extends HttpServlet {
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
            if ("/api/vouchers".equals(path)) {
                // Get all vouchers (admin only)
                List<Voucher> vouchers = dataManager.getAllVouchers();
                response.getWriter().write(gson.toJson(vouchers));

            } else if ("/api/active-vouchers".equals(path)) {
                // Get active vouchers (for users)
                List<Voucher> activeVouchers = dataManager.getActiveVouchers();
                response.getWriter().write(gson.toJson(activeVouchers));

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
            if ("/api/add-voucher".equals(path)) {
                handleAddVoucher(request, response);

            } else if ("/api/update-voucher".equals(path)) {
                handleUpdateVoucher(request, response);

            } else if ("/api/delete-voucher".equals(path)) {
                handleDeleteVoucher(request, response);

            } else if ("/api/validate-voucher".equals(path)) {
                handleValidateVoucher(request, response);

            } else {
                sendErrorResponse(response, "Invalid endpoint");
            }
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(response, "Server error: " + e.getMessage());
        }
    }

    private void handleAddVoucher(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        Voucher voucher = gson.fromJson(getRequestBody(request), Voucher.class);

        // Check if voucher code already exists
        Optional<Voucher> existing = dataManager.getVoucherByCode(voucher.getCode());
        if (existing.isPresent()) {
            sendErrorResponse(response, "Voucher code already exists");
            return;
        }

        dataManager.addVoucher(voucher);
        sendSuccessResponse(response, "Voucher added successfully");
    }

    private void handleUpdateVoucher(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        Voucher voucher = gson.fromJson(getRequestBody(request), Voucher.class);

        boolean updated = dataManager.updateVoucher(voucher);
        if (updated) {
            sendSuccessResponse(response, "Voucher updated successfully");
        } else {
            sendErrorResponse(response, "Voucher not found");
        }
    }

    private void handleDeleteVoucher(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        JsonObject requestData = gson.fromJson(getRequestBody(request), JsonObject.class);
        String code = requestData.get("code").getAsString();

        boolean deleted = dataManager.deleteVoucher(code);
        if (deleted) {
            sendSuccessResponse(response, "Voucher deleted successfully");
        } else {
            sendErrorResponse(response, "Voucher not found");
        }
    }

    private void handleValidateVoucher(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        JsonObject requestData = gson.fromJson(getRequestBody(request), JsonObject.class);
        String code = requestData.get("code").getAsString();
        String userId = requestData.has("userId") ? requestData.get("userId").getAsString() : null;

        if (userId == null) {
            sendErrorResponse(response, "User ID is required");
            return;
        }

        Optional<Voucher> voucherOpt = dataManager.validateVoucher(code, userId);
        if (voucherOpt.isPresent()) {
            Voucher voucher = voucherOpt.get();
            JsonObject responseData = new JsonObject();
            responseData.addProperty("success", true);
            responseData.addProperty("message", "Voucher is valid");
            responseData.add("voucher", gson.toJsonTree(voucher));
            response.getWriter().write(gson.toJson(responseData));
        } else {
            sendErrorResponse(response, "Invalid, inactive, or already used voucher code");
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

    private void sendSuccessResponse(HttpServletResponse response, String message) throws IOException {
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("success", true);
        jsonResponse.addProperty("message", message);
        response.getWriter().write(gson.toJson(jsonResponse));
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("success", false);
        jsonResponse.addProperty("message", message);
        response.getWriter().write(gson.toJson(jsonResponse));
    }
}
