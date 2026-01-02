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

    const [user, setUser] = useState(localStorage.getItem('userEmail') ? { email: localStorage.getItem('userEmail') } : null);

    const backendUrl = "http://localhost:8080";

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

        const activeUserEmail = user?.email || localStorage.getItem('userEmail');

        if (activeUserEmail) {
            try {
                const response = await fetch(backendUrl + '/api/update-cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: activeUserEmail, cart: cartData })
                });
                const data = await response.json();
                if (data.success) {
                    console.log("Cart synced with backend");
                } else {
                    console.error("Failed to save cart: " + data.message);
                }
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

        const activeUserEmail = user?.email || localStorage.getItem('userEmail');

        if (activeUserEmail) {
            try {
                await fetch(backendUrl + '/api/update-cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: activeUserEmail, cart: cartData })
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
                localStorage.setItem('userEmail', data.user.email);

                toast.success("Login Successful");
                loadCartData(data.user.email);
                navigate('/');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed");
        }
    }

    const clearCart = async () => {
        setCartItems({});
        const activeUserEmail = user?.email || localStorage.getItem('userEmail');
        if (activeUserEmail) {
            try {
                await fetch(backendUrl + '/api/update-cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: activeUserEmail, cart: {} })
                });
            } catch (error) {
                console.error("Failed to clear cart on backend:", error);
            }
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

                localStorage.setItem('userEmail', data.user.email);

                toast.success("Signup Successful");
                setCartItems({});
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

        localStorage.removeItem('userEmail');
        // -------------------------------------

        navigate('/login');
        toast.info("Logged out");
    }
    const checkBackendConnection = async () => {
        try {
            const response = await fetch('http://localhost:8080/hello');
            const data = await response.json();
            console.log("Backend Connection Status:", data);
        } catch (error) {
            console.error("Backend Connection Failed:", error);
        }
    }

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            loadCartData(storedEmail);
        }
        checkBackendConnection();
    }, [user])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount, updateQuantity,
        getCartAmount, navigate,
        user, login, signup, logout, clearCart
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;