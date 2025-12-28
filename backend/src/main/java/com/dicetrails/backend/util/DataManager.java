package com.dicetrails.backend.util;

import com.dicetrails.backend.model.User;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.io.*;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class DataManager {
    private static DataManager instance;
    private List<User> users;
    private final String DATA_FILE = "users.json";
    private final Gson gson;

    private DataManager() {
        gson = new GsonBuilder().setPrettyPrinting().create();
        users = loadUsers();
    }

    public static synchronized DataManager getInstance() {
        if (instance == null) {
            instance = new DataManager();
        }
        return instance;
    }

    private List<User> loadUsers() {
        File file = new File(DATA_FILE);
        if (!file.exists()) {
            return new ArrayList<>();
        }

        try (Reader reader = new FileReader(file)) {
            Type userListType = new TypeToken<ArrayList<User>>() {
            }.getType();
            List<User> loadedUsers = gson.fromJson(reader, userListType);
            return loadedUsers != null ? loadedUsers : new ArrayList<>();
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public synchronized void saveUsers() {
        try (Writer writer = new FileWriter(DATA_FILE)) {
            gson.toJson(users, writer);
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
        users.add(user);
        saveUsers();
    }

    public synchronized void updateUser(User updatedUser) {
        for (int i = 0; i < users.size(); i++) {
            if (users.get(i).getEmail().equalsIgnoreCase(updatedUser.getEmail())) {
                users.set(i, updatedUser);
                saveUsers();
                return;
            }
        }
    }
}
