import { createContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "RM";
    const delivery_fee = 10;
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [user, setUser] = useState(null); // Store user info
    const backendUrl = "http://localhost:5000"; // Define backend URL

    // Function to load cart from backend
    const loadCartData = async (userId) => {
        try {
            const response = await fetch(backendUrl + '/api/get-cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();
            if (data.success) {
                setCartItems(data.cart);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load cart");
        }
    }

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);

        if (toast) {
            toast.success("Item added to cart");
        }

        if (user) {
            try {
                await fetch(backendUrl + '/api/update-cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.userId, cart: cartData })
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            try {
                if (cartItems[items] > 0) {
                    totalCount += cartItems[items];
                }
            } catch (error) {
                console.log(error);
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);

        if (user) {
            try {
                await fetch(backendUrl + '/api/update-cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.userId, cart: cartData })
                });
            } catch (error) {
                console.error(error);
            }
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0 && itemInfo) {
                totalAmount += itemInfo.price * cartItems[items];
            }
        }
        return totalAmount;
    }

    const login = async (email, password) => {
        try {
            const response = await fetch(backendUrl + '/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                toast.success("Login Successful");
                loadCartData(data.user.userId);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed");
        }
    }

    const signup = async (username, email, password) => {
        try {
            const response = await fetch(backendUrl + '/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
                toast.success("Signup Successful");
                setCartItems({}); // New user empty cart
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Signup failed");
        }
    }

    const logout = () => {
        setUser(null);
        setCartItems({});
        navigate('/login');
        toast.info("Logged out");
    }

    useEffect(() => {
        console.log(cartItems);
    }, [cartItems])

    const value = {
        products, currency, delivery_fee,
        cartItems, addToCart, getCartCount, updateQuantity,
        getCartAmount, navigate,
        user, login, signup, logout
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;