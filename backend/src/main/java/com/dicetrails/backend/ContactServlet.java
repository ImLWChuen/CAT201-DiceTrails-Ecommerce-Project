package com.dicetrails.backend;

import com.dicetrails.backend.model.ContactMessage;
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
import java.io.PrintWriter;
import java.util.List;
import java.util.UUID;

@WebServlet("/api/contact")
public class ContactServlet extends HttpServlet {

    private final DataManager dataManager = DataManager.getInstance();
    private final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        List<ContactMessage> contacts = dataManager.getContacts();
        out.print(gson.toJson(contacts));
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        BufferedReader reader = req.getReader();
        JsonObject jsonRequest = gson.fromJson(reader, JsonObject.class);

        String name = jsonRequest.get("name").getAsString();
        String email = jsonRequest.get("email").getAsString();
        String message = jsonRequest.get("message").getAsString();

        String id = UUID.randomUUID().toString();
        long date = System.currentTimeMillis();

        ContactMessage contactMessage = new ContactMessage(id, name, email, message, date);
        dataManager.addContact(contactMessage);

        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("success", true);
        jsonResponse.addProperty("message", "Message sent successfully");
        out.print(gson.toJson(jsonResponse));
        out.flush();
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        String id = req.getParameter("id");
        if (id != null) {
            boolean success = dataManager.deleteContact(id);
            if (success) {
                out.print("{\"success\": true, \"message\": \"Message deleted\"}");
            } else {
                out.print("{\"success\": false, \"message\": \"Message not found\"}");
            }
        } else {
            out.print("{\"success\": false, \"message\": \"Missing id parameter\"}");
        }
        out.flush();
    }
}
