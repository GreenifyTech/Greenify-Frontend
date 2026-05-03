import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, XCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import { formatPrice } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const Cart = () => {
  const { t } = useLang();
  const { cartItems, loading, updateQuantity, removeItem, clearCart, getCartTotal } = useContext(CartContext);

  const handleUpdateQuantity = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (newQty > 10) {
      toast.error("Maximum quantity is 10");
      return;
    }
    await updateQuantity(itemId, newQty);
  };

  const handleRemove = async (itemId, name) => {
    await removeItem(itemId);
    toast.success(`${name} removed from cart`);
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      await clearCart();
      toast.success("Cart cleared");
    }
  };

  if (loading && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-32 text-center flex flex-col items-center justify-center">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Loading your botanical collection...</p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center transition-colors duration-300">
        <div className="w-64 h-64 relative mb-10 group">
          <div className="absolute inset-0 bg-emerald-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 opacity-50"></div>
          <ShoppingBag size={120} className="text-emerald-100 relative z-10 mx-auto mt-16 group-hover:text-emerald-300 transition-colors" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-dashed border-emerald-50 rounded-full animate-[spin_10s_linear_infinite]"></div>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-4">{t('empty_cart')}</h2>
        <p className="text-slate-600 mb-10 max-w-md mx-auto text-base md:text-lg leading-relaxed font-medium">
          Your collection feels a bit lonely. Let's find some green friends to breathe life into your space!
        </p>
        <Link 
          to="/products" 
          className="bg-emerald-700 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 flex items-center gap-3 active:scale-95 cursor-pointer"
        >
          {t('shop_now')} <ArrowRight size={22} />
        </Link>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 md:pt-24 md:pb-12 w-full transition-colors duration-300 antialiased">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base font-medium">Review your items before proceeding to checkout.</p>
        </div>
        <button 
          onClick={handleClearCart}
          className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors px-4 py-2 hover:bg-red-50 rounded-xl active:scale-95 cursor-pointer"
        >
          <XCircle size={18} /> {t('clear_cart')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
        {/* CART ITEMS LIST */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-[2.5rem] p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center group hover:shadow-md transition-all"
            >
              <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 relative border border-slate-100">
                <img 
                  src={item.product_image || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=200'} 
                  alt={item.product_name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="flex-grow w-full">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900">{item.product_name || 'Botanical Treasure'}</h3>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Botanical Collection</p>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id, item.product_name || 'Item')}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 cursor-pointer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <p className="text-sm text-slate-500 line-clamp-1 mb-8 font-medium">
                  Sustainable botanical companion for your space.
                </p>

                <div className="flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center bg-slate-50 rounded-xl overflow-hidden border border-slate-100 p-1">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      className="p-3 hover:bg-white text-slate-500 transition-colors active:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-1 font-bold text-slate-900 w-14 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      className="p-3 hover:bg-white text-slate-500 transition-colors active:bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-xl md:text-2xl font-serif font-bold text-emerald-800">
                      {formatPrice(item.quantity * (Number(item.discount_price) || Number(item.price) || 0))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Link to="/products" className="inline-flex items-center gap-3 text-emerald-700 font-bold hover:gap-4 transition-all mt-4 px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl active:scale-95 shadow-sm">
            <ShoppingBag size={20} /> Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>

        {/* ORDER SUMMARY */}
        <aside className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-100 relative overflow-hidden transition-all">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-slate-900 mb-6 md:mb-8 relative z-10">Summary</h2>
            
            <div className="space-y-5 mb-10 relative z-10">
              <div className="flex justify-between text-slate-600 font-bold">
                <span>Subtotal</span>
                <span className="text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-bold">
                <span>Shipping</span>
                <span className="text-emerald-600 tracking-widest uppercase text-xs font-black">Free</span>
              </div>
              <div className="pt-6 md:pt-8 mt-4 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Grand Total</span>
                <span className="text-2xl md:text-3xl font-serif font-bold text-emerald-700">{formatPrice(total)}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-emerald-700 text-white py-4 md:py-5 rounded-[1.5rem] font-bold text-lg md:text-xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 relative z-10 active:scale-95 cursor-pointer"
            >
              Checkout <ArrowRight size={22} md:size={24} />
            </Link>
            
            {/* Decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl border border-white/5">
            <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">
              <ShieldCheck size={18} /> Secure Transaction
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Your data is encrypted and protected. We use industry-standard security protocols for all payments.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
