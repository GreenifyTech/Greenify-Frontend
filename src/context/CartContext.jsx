import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartApi } from '../api/cartApi';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
 const { user } = useContext(AuthContext);
 const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
 const [loading, setLoading] = useState(false);

 const fetchCart = async () => {
 if (!user) {
 setCart({ items: [], total: 0, count: 0 });
 return;
 }
 try {
 setLoading(true);
 const data = await cartApi.getCart();
 // Defensive check: Ensure data matches the expected structure
 setCart({
 items: data?.items || [],
 total: data?.total || 0,
 count: data?.count || 0
 });
 } catch (error) {
 console.error("Failed to fetch cart", error);
 setCart({ items: [], total: 0, count: 0 });
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchCart();
 }, [user]);

 const addItem = async (productId, quantity = 1) => {
 if (!user) {
 toast.error('Please login to add items to cart.');
 return;
 }
 try {
 await cartApi.addItem(productId, quantity);
 await fetchCart();
 } catch (error) {
 console.error("Failed to add item", error);
 throw error;
 }
 };

 const updateQuantity = async (itemId, quantity) => {
 try {
 await cartApi.updateItem(itemId, quantity);
 await fetchCart();
 } catch (error) {
 console.error("Failed to update item", error);
 }
 };

 const removeItem = async (itemId) => {
 try {
 await cartApi.removeItem(itemId);
 // Optimistic update: filter out the removed item immediately
 setCart(prev => ({
 ...prev,
 items: prev.items.filter(item => item.id !== itemId),
 count: prev.count - 1
 }));
 // Re-fetch to sync totals and final state
 await fetchCart();
 } catch (error) {
 console.error("Failed to remove item", error);
 }
 };
 
 const clearCart = async () => {
 try {
 await cartApi.clearCart();
 setCart({ items: [], total: 0, count: 0 });
 } catch (error) {
 console.error("Failed to clear cart", error);
 }
 };

 // Backend provides total and count, so we use them directly with safe fallbacks
 const getCartTotal = () => cart?.total || 0;
 const getCartCount = () => cart?.count || 0;

 return (
 <CartContext.Provider value={{ 
 cartItems: cart.items, // Keep naming for backward compatibility if possible, but cart.items is safer
 cart,
 loading, 
 addItem, 
 updateQuantity, 
 removeItem, 
 clearCart,
 getCartTotal,
 itemCount: cart.count 
 }}>
 {children}
 </CartContext.Provider>
 );
};
