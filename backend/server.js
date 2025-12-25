const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const USERS_FILE = path.join(__dirname, 'users.json');

// Helper to read users
const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users file:", err);
        return [];
    }
};

// Helper to write users
const writeUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Error writing users file:", err);
    }
};

app.get('/', (req, res) => {
    res.send('DiceTrails Backend is running');
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();

    // Simple password check (in production use hashing!)
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Return user info excluding password
        const { password, ...userInfo } = user;
        res.json({ success: true, user: userInfo });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Signup Endpoint
app.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;
    const users = readUsers();

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = {
        userId: Date.now().toString(),
        username,
        email,
        password, // In production, hash this!
        cart: {}
    };

    users.push(newUser);
    writeUsers(users);

    const { password: _, ...userInfo } = newUser;
    res.json({ success: true, user: userInfo });
});

// Get Cart Endpoint
app.post('/api/get-cart', (req, res) => { // Using POST to send userId securely in body if needed, or could use GET with query param / auth token
    const { userId } = req.body;
    const users = readUsers();
    const user = users.find(u => u.userId === userId);

    if (user) {
        res.json({ success: true, cart: user.cart });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// Update Cart Endpoint
app.post('/api/update-cart', (req, res) => {
    const { userId, cart } = req.body;
    const users = readUsers();
    const userIndex = users.findIndex(u => u.userId === userId);

    if (userIndex !== -1) {
        users[userIndex].cart = cart;
        writeUsers(users);
        res.json({ success: true, message: 'Cart updated', cart: users[userIndex].cart });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
