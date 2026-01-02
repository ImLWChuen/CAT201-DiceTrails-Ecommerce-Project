package com.dicetrails.backend.util;

import com.dicetrails.backend.model.ContactMessage;
import com.dicetrails.backend.model.Review;

// ... (existing imports, but since I can't modify top of file easily with multi-chunk in this tool, I'll assum imports are managed or I use full names if possible, but actually replace_file_content replaces contiguous blocks. I need to be careful with imports.

// I will use multi_replace_file_content instead because I need to edit imports AND the class body.
// Wait, I am restricted to replace_file_content for single block.
// I will use multi_replace_file_content.
// Actually, I'll just use multi_replace_file_content in the next step.
// For now, I'll switch to multi_replace_file_content tool.

import com.dicetrails.backend.model.Order;
import com.dicetrails.backend.model.User;
import com.dicetrails.backend.model.Product;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class DataManager {
    private static DataManager instance;

    private List<User> users;
    private final String USER_FILE = "users.json";

    private List<Order> orders;
    private final String ORDER_FILE = "orders.json";

    private List<Product> products;
    private final String PRODUCT_FILE = "products.json";

    private List<ContactMessage> contacts;
    private final String CONTACT_FILE = "contacts.json";

    private List<Review> reviews;
    private final String REVIEW_FILE = "reviews.json";

    private final Gson gson;

    private DataManager() {
        gson = new GsonBuilder().setPrettyPrinting().create();
        users = loadData(USER_FILE, new TypeToken<ArrayList<User>>() {
        }.getType());
        orders = loadData(ORDER_FILE, new TypeToken<ArrayList<Order>>() {
        }.getType());
        products = loadData(PRODUCT_FILE, new TypeToken<ArrayList<Product>>() {
        }.getType());
        contacts = loadData(CONTACT_FILE, new TypeToken<ArrayList<ContactMessage>>() {
        }.getType());
        reviews = loadData(REVIEW_FILE, new TypeToken<ArrayList<Review>>() {
        }.getType());
    }

    public static synchronized DataManager getInstance() {
        if (instance == null) {
            instance = new DataManager();
        }
        return instance;
    }

    private <T> List<T> loadData(String filename, Type type) {
        try (Reader reader = new FileReader(filename)) {
            List<T> data = gson.fromJson(reader, type);
            return data != null ? data : new ArrayList<>();
        } catch (FileNotFoundException e) {
            System.out.println("File not found: " + filename + ". Creating new file.");
            return new ArrayList<>();
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

    // User-related methods
    public synchronized void addUser(User user) {
        users.add(user);
        saveData(USER_FILE, users);
    }

    public Optional<User> getUserByEmail(String email) {
        return users.stream().filter(u -> u.getEmail().equals(email)).findFirst();
    }

    public synchronized void updateUser(User updatedUser) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getEmail().equals(updatedUser.getEmail())) {
                users.set(i, updatedUser);
                saveData(USER_FILE, users);
                break;
            }
        }
    }

    public synchronized int getNextUserId() {
        return users.stream()
                .mapToInt(User::getUserId)
                .max()
                .orElse(10000000) + 1;
    }

    // Order-related methods
    public synchronized void saveOrder(Order order) {
        int nextOrderId = getNextOrderId();
        order.setOrderId(String.valueOf(nextOrderId));
        orders.add(order);
        saveData(ORDER_FILE, orders);
    }

    private int getNextOrderId() {
        return orders.stream()
                .map(Order::getOrderId)
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(30000000) + 1;
    }

    public List<Order> getOrders(String userId) {
        return orders.stream()
                .filter(order -> order.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public List<Order> getAllOrders() {
        return new ArrayList<>(orders);
    }

    public synchronized void saveOrders(List<Order> updatedOrders) {
        this.orders = updatedOrders;
        saveData(ORDER_FILE, orders);
    }

    public synchronized boolean updateOrderStatus(String orderId, String newStatus) {
        for (Order order : orders) {
            if (order.getOrderId().equals(orderId)) {
                order.setStatus(newStatus);

                // Generate tracking number when marked as Shipped
                if ("Shipped".equals(newStatus)
                        && (order.getTrackingNumber() == null || order.getTrackingNumber().isEmpty())) {
                    order.setTrackingNumber(generateTrackingNumber());
                }

                saveData(ORDER_FILE, orders);
                return true;
            }
        }
        return false;
    }

    private String generateTrackingNumber() {
        // Generate random 8-digit tracking number with TR prefix
        int randomNumber = 10000000 + (int) (Math.random() * 90000000);
        return "TR" + randomNumber;
    }

    public synchronized boolean deleteOrder(String orderId) {
        boolean removed = orders.removeIf(order -> order.getOrderId().equals(orderId));
        if (removed) {
            saveData(ORDER_FILE, orders);
        }
        return removed;
    }

    // Product management methods
    public synchronized int getNextProductId() {
        return products.stream()
                .mapToInt(Product::get_id)
                .max()
                .orElse(20000000) + 1;
    }

    public synchronized void addProduct(Product product) {
        int nextId = getNextProductId();
        product.set_id(nextId);
        products.add(product);
        saveData(PRODUCT_FILE, products);
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(products);
    }

    public Optional<Product> getProductById(int productId) {
        return products.stream()
                .filter(p -> p.get_id() == productId)
                .findFirst();
    }

    public synchronized boolean updateProduct(Product updatedProduct) {
        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).get_id() == updatedProduct.get_id()) {
                products.set(i, updatedProduct);
                saveData(PRODUCT_FILE, products);
                return true;
            }
        }
        return false;
    }

    public synchronized void saveProducts(List<Product> productList) {
        this.products = new ArrayList<>(productList);
        saveData(PRODUCT_FILE, products);
    }

    public synchronized boolean reduceStock(int productId, int quantity) {
        Optional<Product> productOpt = getProductById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (product.getQuantity() >= quantity) {
                product.setQuantity(product.getQuantity() - quantity);
                return updateProduct(product);
            }
        }
        return false;
    }

    /**
     * Increase stock for a product (used when orders are cancelled)
     */
    public synchronized boolean increaseStock(int productId, int quantity) {
        Optional<Product> productOpt = getProductById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            product.setQuantity(product.getQuantity() + quantity);
            return updateProduct(product);
        }
        return false;
    }

    // Contact management methods
    public synchronized void addContact(ContactMessage message) {
        contacts.add(message);
        saveData(CONTACT_FILE, contacts);
    }

    public List<ContactMessage> getContacts() {
        return new ArrayList<>(contacts);
    }

    public synchronized boolean deleteContact(String id) {
        boolean removed = contacts.removeIf(msg -> msg.getId().equals(id));
        if (removed) {
            saveData(CONTACT_FILE, contacts);
        }
        return removed;
    }

    // Review management methods
    public List<Review> getReviews(String productId) {
        return reviews.stream()
                .filter(review -> review.getProductId().equals(productId))
                .collect(Collectors.toList());
    }

    public synchronized void addReview(Review review) {
        reviews.add(review);
        saveData(REVIEW_FILE, reviews);
    }

    public synchronized void markOrderItemAsReviewed(String orderId, String productId) {
        for (Order order : orders) {
            if (order.getOrderId().equals(orderId)) {
                List<Map<String, Object>> items = order.getItems();
                boolean updated = false;
                for (Map<String, Object> item : items) {
                    // Items are stored as maps, usually with "id" or "productId" key
                    // Based on typical structure, let's assume "id" holds the product ID
                    // We need to cast carefully
                    Object idObj = item.get("id");
                    String itemId = idObj != null ? String.valueOf(idObj) : "";

                    if (itemId.equals(productId)) {
                        item.put("isReviewed", true);
                        updated = true;
                    }
                }
                if (updated) {
                    saveData(ORDER_FILE, orders);
                }
                break;
            }
        }
    }
}
