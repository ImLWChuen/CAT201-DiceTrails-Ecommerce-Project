package com.dicetrails.backend;

import com.dicetrails.backend.model.Product;
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

@WebServlet(urlPatterns = { "/api/update-product", "/api/delete-product", "/api/add-product" })
public class ProductUpdateServlet extends HttpServlet {

    private final Gson gson = new Gson();

    private void addCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        addCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        addCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getServletPath();

        try {
            BufferedReader reader = req.getReader();
            JsonObject jsonRequest = JsonParser.parseReader(reader).getAsJsonObject();

            if (pathInfo.equals("/api/update-product")) {
                handleUpdateProduct(jsonRequest, out);
            } else if (pathInfo.equals("/api/delete-product")) {
                handleDeleteProduct(jsonRequest, out);
            } else if (pathInfo.equals("/api/add-product")) {
                handleAddProduct(jsonRequest, out);
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Server error: " + e.getMessage() + "\"}");
        }
    }

    private void handleUpdateProduct(JsonObject jsonRequest, PrintWriter out) {
        try {
            Product updatedProduct = gson.fromJson(jsonRequest, Product.class);

            if (updatedProduct.get_id() == 0) {
                out.println("{\"success\": false, \"message\": \"Invalid product ID\"}");
                return;
            }

            boolean success = DataManager.getInstance().updateProduct(updatedProduct);

            if (success) {
                out.println("{\"success\": true, \"message\": \"Product updated successfully\"}");
            } else {
                out.println("{\"success\": false, \"message\": \"Product not found\"}");
            }

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Failed to update product: " + e.getMessage() + "\"}");
        }
    }

    private void handleDeleteProduct(JsonObject jsonRequest, PrintWriter out) {
        try {
            int productId = jsonRequest.get("productId").getAsInt();

            // Get all products and filter out the one to delete
            var products = DataManager.getInstance().getAllProducts();
            var filteredProducts = products.stream()
                    .filter(p -> p.get_id() != productId)
                    .toList();

            if (filteredProducts.size() == products.size()) {
                out.println("{\"success\": false, \"message\": \"Product not found\"}");
                return;
            }

            // Save the filtered list
            DataManager.getInstance().saveProducts(filteredProducts);

            out.println("{\"success\": true, \"message\": \"Product deleted successfully\"}");

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Failed to delete product: " + e.getMessage() + "\"}");
        }
    }

    private void handleAddProduct(JsonObject jsonRequest, PrintWriter out) {
        try {
            // New products won't have an ID yet, so we ignore _id from frontend if any
            // Remove _id to avoid issues during deserialization if it's not an int
            if (jsonRequest.has("_id")) {
                jsonRequest.remove("_id");
            }

            Product newProduct = gson.fromJson(jsonRequest, Product.class);

            DataManager.getInstance().addProduct(newProduct);

            // Return the new ID so frontend can update state correctly if needed
            out.println("{\"success\": true, \"message\": \"Product added successfully\", \"productId\": "
                    + newProduct.get_id() + "}");

        } catch (Exception e) {
            e.printStackTrace();
            out.println("{\"success\": false, \"message\": \"Failed to add product: " + e.getMessage() + "\"}");
        }
    }
}
