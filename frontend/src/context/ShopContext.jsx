import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { calculateDiscountedPrice } from '../utils/discountUtils';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "RM";
    const delivery_fee = 10;
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);

    // Initialize user from localStorage if available
    const [user, setUser] = useState(() => {
        const email = localStorage.getItem('userEmail');
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        const isNewsletterSubscribed = localStorage.getItem('isNewsletterSubscribed') === 'true';
        const hasUsedNewsletterDiscount = localStorage.getItem('hasUsedNewsletterDiscount') === 'true';

        if (email) {
            return {
                email,
                username,
                userId: userId ? Number(userId) : null,
                isAdmin,
                isNewsletterSubscribed,
                hasUsedNewsletterDiscount
            };
        }
        return null;
    });

    const backendUrl = "http://localhost:8080";

    const loadProductsData = async () => {
        try {
            const response = await fetch(backendUrl + '/api/products');
            const data = await response.json();
            if (data && Array.isArray(data)) {
                setProducts(data);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

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
            let itemInfo = products.find((product) => product._id === Number(items));
            if (itemInfo) {
                // Use discounted price if discount exists
                const finalPrice = calculateDiscountedPrice(itemInfo);
                totalAmount += finalPrice * cartItems[items];
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
                console.log("Login response user data:", data.user); // Debug log
                setUser(data.user);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('username', data.user.username); // Store username
                localStorage.setItem('userId', data.user.userId); // Store userId
                localStorage.setItem('isAdmin', data.user.isAdmin);
                localStorage.setItem('isNewsletterSubscribed', data.user.isNewsletterSubscribed || false);
                localStorage.setItem('hasUsedNewsletterDiscount', data.user.hasUsedNewsletterDiscount || false);

                toast.success("Login Successful");
                loadCartData(data.user.email);

                // Redirect based on user role
                if (data.user.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
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
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isNewsletterSubscribed');
        localStorage.removeItem('hasUsedNewsletterDiscount');
        // -------------------------------------

        navigate('/login');
        toast.info("Logged out");
    }

    const subscribeNewsletter = async (email) => {
        try {
            const response = await fetch(backendUrl + '/api/subscribe-newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (data.success) {
                // Update user state and localStorage
                if (user) {
                    const updatedUser = { ...user, isNewsletterSubscribed: true };
                    setUser(updatedUser);
                    localStorage.setItem('isNewsletterSubscribed', 'true');
                }
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to subscribe to newsletter");
            return false;
        }
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
        // Load products from backend
        loadProductsData();

        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail && Object.keys(cartItems).length === 0) {
            loadCartData(storedEmail);
        }
        console.log(cartItems);
        checkBackendConnection();
    }, [cartItems])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, getCartCount, updateQuantity,
        getCartAmount, navigate,
        user, setUser, login, signup, logout, subscribeNewsletter
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;