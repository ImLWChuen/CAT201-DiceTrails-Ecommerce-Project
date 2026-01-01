package com.dicetrails.backend.util;

import com.dicetrails.backend.model.Order;
import com.dicetrails.backend.model.User;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class DataManager {
    private static DataManager instance;

    private List<User> users;
    private final String USER_FILE = "users.json";

    private List<Order> orders;
    private final String ORDER_FILE = "orders.json";

    private final Gson gson;

    private DataManager() {
        gson = new GsonBuilder().setPrettyPrinting().create();
        users = loadData(USER_FILE, new TypeToken<ArrayList<User>>() {
        }.getType());
        orders = loadData(ORDER_FILE, new TypeToken<ArrayList<Order>>() {
        }.getType());
    }

    public static synchronized DataManager getInstance() {
        if (instance == null) {
            instance = new DataManager();
        }
        return instance;
    }

    private <T> List<T> loadData(String filename, Type type) {
        File file = new File(filename);
        if (!file.exists()) {
            return new ArrayList<>();
        }
        try (Reader reader = new FileReader(file)) {
            List<T> data = gson.fromJson(reader, type);
            return data != null ? data : new ArrayList<>();
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private synchronized <T> void saveData(String filename, List<T> data) {
        try (Writer writer = new FileWriter(filename)) {
            gson.toJson(data, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Optional<User> getUserByEmail(String email) {
        return users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public synchronized void addUser(User user) {
        // Auto-generate userId if not set (8-digit format starting at 10000000)
        if (user.getUserId() == 0) {
            int maxId = users.stream()
                    .mapToInt(User::getUserId)
                    .max()
                    .orElse(10000000);

            // If max is below 10000000, start at 10000001
            if (maxId < 10000000) {
                user.setUserId(10000001);
            } else {
                user.setUserId(maxId + 1);
            }
        }
        users.add(user);
        saveData(USER_FILE, users);
    }

    public synchronized void updateUser(User updatedUser) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getEmail().equalsIgnoreCase(updatedUser.getEmail())) {
                users.set(i, updatedUser);
                saveData(USER_FILE, users);
                return;
            }
        }
    }

    public synchronized void saveOrder(Order order) {
        if (order.getOrderId() == null || order.getOrderId().isEmpty()) {
            // Generate 8-digit order ID starting at 30000001
            int maxId = orders.stream()
                    .map(Order::getOrderId)
                    .filter(id -> id.matches("\\d+")) // Only numeric IDs
                    .mapToInt(Integer::parseInt)
                    .max()
                    .orElse(30000000);

            // If max is below 30000000, start at 30000001
            if (maxId < 30000000) {
                order.setOrderId("30000001");
            } else {
                order.setOrderId(String.valueOf(maxId + 1));
            }
        }

        orders.add(order);
        saveData(ORDER_FILE, orders);
        System.out.println("Order saved: " + order.getOrderId());
    }

    public List<Order> getOrders(String userEmail) {
        return orders.stream()
                .filter(o -> o.getUserId().equalsIgnoreCase(userEmail))
                .collect(Collectors.toList());
    }

    public List<Order> getAllOrders() {
        return new ArrayList<>(orders);
    }

    public synchronized void saveOrders(List<Order> updatedOrders) {
        this.orders = updatedOrders;
        saveData(ORDER_FILE, orders);
    }
}