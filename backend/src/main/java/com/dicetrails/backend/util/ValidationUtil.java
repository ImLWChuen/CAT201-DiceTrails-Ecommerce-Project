package com.dicetrails.backend.util;

import java.util.regex.Pattern;

public class ValidationUtil {

    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    // Phone number pattern (Malaysian format)
    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "^[0-9]{10,15}$");

    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Validate password strength
     * Minimum 8 characters, at least one letter and one number
     */
    public static boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        boolean hasLetter = password.matches(".*[a-zA-Z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        return hasLetter && hasDigit;
    }

    /**
     * Validate username - not empty, 2-50 characters
     */
    public static boolean isValidUsername(String username) {
        if (username == null) {
            return false;
        }
        String trimmed = username.trim();
        return trimmed.length() >= 2 && trimmed.length() <= 50;
    }

    /**
     * Validate phone number
     */
    public static boolean isValidPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }
        return PHONE_PATTERN.matcher(phone.trim()).matches();
    }

    /**
     * Validate price - must be positive
     */
    public static boolean isValidPrice(double price) {
        return price > 0 && price < 100000; // Max price 100k
    }

    /**
     * Validate quantity - must be non-negative
     */
    public static boolean isValidQuantity(int quantity) {
        return quantity >= 0 && quantity <= 10000; // Max quantity 10k
    }

    /**
     * Sanitize string input - remove potential XSS characters
     */
    public static String sanitizeString(String input) {
        if (input == null) {
            return "";
        }
        return input.trim()
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\"", "&quot;")
                .replaceAll("'", "&#x27;")
                .replaceAll("/", "&#x2F;");
    }

    /**
     * Validate required string field
     */
    public static boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

    /**
     * Validate product name
     */
    public static boolean isValidProductName(String name) {
        if (!isNotEmpty(name)) {
            return false;
        }
        return name.trim().length() >= 2 && name.trim().length() <= 200;
    }

    /**
     * Validate product description
     */
    public static boolean isValidDescription(String description) {
        if (!isNotEmpty(description)) {
            return false;
        }
        return description.trim().length() >= 10 && description.trim().length() <= 5000;
    }
}
