import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, ClipboardCheck, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { EGYPT_GOVERNORATES } from '../constants/egypt';
import { formatPrice } from '../utils/formatCurrency';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const getInitialAddr = () => {
    let gov = 'Cairo';
    let addr = user?.address || '';
    if (user?.address && user.address.includes(',')) {
      const parts = user.address.split(',');
      gov = parts[0].trim();
      addr = parts.slice(1).join(',').trim();
    }
    return { gov, addr };
  };

  const initial = getInitialAddr();

  const [formData, setFormData] = useState({
    governorate: initial.gov,
    address_line: initial.addr,
    notes: '',
    payment_method: 'cash_on_delivery',
  });

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1 && (!formData.governorate || !formData.address_line)) {
      toast.error("Please provide both governorate and city/area");
      return;
    }
    
    if (step === 2 && formData.payment_method === 'card') {
      if (!cardData.number || cardData.number.length < 16) {
        toast.error("Please enter a valid card number");
        return;
      }
      if (!cardData.expiry || cardData.expiry.length < 5) {
        toast.error("Please enter a valid expiry date (MM/YY)");
        return;
      }
      if (!cardData.cvv || cardData.cvv.length < 3) {
        toast.error("Please enter a valid CVV");
        return;
      }
      if (!cardData.name) {
        toast.error("Please enter the cardholder name");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity)
        })),
        shipping_address: `${formData.governorate}, ${formData.address_line}`,
        payment_method: formData.payment_method,
        notes: formData.notes
      };
      
      const result = await orderApi.placeOrder(orderPayload);
      toast.success("Order placed successfully!");
      await clearCart();
      navigate(`/orders/${result.order_id}`);
    } catch (error) {
      console.error("Checkout failed", error);
      toast.error(error.response?.data?.detail || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = getCartTotal();
  const total = subtotal;

  const steps = [
    { id: 1, name: 'Shipping', icon: <MapPin size={18} /> },
    { id: 2, name: 'Payment', icon: <CreditCard size={18} /> },
    { id: 3, name: 'Review', icon: <ClipboardCheck size={18} /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 w-full flex-grow transition-colors duration-300 antialiased">
      {/* STEPPER */}
      <div className="relative mb-16">
        <div className="flex justify-between items-center relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2"></div>
          
          {steps.map((s) => (
            <div key={s.id} className="relative flex flex-col items-center gap-3 z-10">
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                  step >= s.id 
                    ? 'bg-emerald-700 border-emerald-700 text-white shadow-xl shadow-emerald-900/20' 
                    : 'bg-white border-slate-100 text-slate-300'
                }`}
              >
                {step > s.id ? <CheckCircle2 size={28} /> : s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${step >= s.id ? 'text-emerald-900' : 'text-slate-400'}`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-slate-100 relative overflow-hidden transition-all">
        {/* STEP 1: SHIPPING */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8">Shipping Destination</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Governorate</label>
                  <div className="relative">
                    <select
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-400 outline-none transition-all appearance-none cursor-pointer text-slate-900 font-bold"
                    >
                      {EGYPT_GOVERNORATES.map(gov => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                    <Globe size={20} className="absolute left-4 top-4.5 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">City / Street Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address_line"
                      value={formData.address_line}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-400 outline-none transition-all text-slate-900 font-bold"
                      placeholder="e.g. 123 Nile St, Maadi"
                    />
                    <MapPin size={20} className="absolute left-4 top-4.5 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-400 outline-none transition-all resize-none text-slate-900 font-medium"
                  placeholder="Special instructions for the courier..."
                />
              </div>
            </div>
            <div className="mt-12 flex justify-end">
              <button 
                onClick={handleNext}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl active:scale-95 cursor-pointer"
              >
                Proceed to Payment <ArrowRight size={22} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-8">Payment Method</h2>
            <div className="space-y-5">
              <label className={`group block p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer ${
                formData.payment_method === 'cash_on_delivery' 
                  ? 'border-emerald-600 bg-emerald-50/50' 
                  : 'border-slate-50 hover:border-emerald-100 hover:bg-slate-50'
              }`}>
                <div className="flex items-center gap-6">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    formData.payment_method === 'cash_on_delivery' ? 'border-emerald-700 bg-emerald-700' : 'border-slate-300'
                  }`}>
                    {formData.payment_method === 'cash_on_delivery' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <input
                    type="radio"
                    name="payment_method"
                    value="cash_on_delivery"
                    checked={formData.payment_method === 'cash_on_delivery'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Cash on Delivery</h4>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">Simply pay with cash when your plants reach your doorstep.</p>
                  </div>
                </div>
              </label>
              
              <label className={`group block p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer ${
                formData.payment_method === 'card' 
                  ? 'border-emerald-600 bg-emerald-50/50' 
                  : 'border-slate-50 hover:border-emerald-100 hover:bg-slate-50'
              }`}>
                <div className="flex items-center gap-6">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    formData.payment_method === 'card' ? 'border-emerald-700 bg-emerald-700' : 'border-slate-300'
                  }`}>
                    {formData.payment_method === 'card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={formData.payment_method === 'card'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div>
                    <h4 className={`text-xl font-bold ${formData.payment_method === 'card' ? 'text-slate-900' : 'text-slate-400'}`}>Card Payment</h4>
                    <p className="text-slate-400 text-sm font-medium">Secure online payment via credit card or digital wallet.</p>
                  </div>
                </div>

                {formData.payment_method === 'card' && (
                  <div className="mt-8 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all duration-500 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enter Card Details</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-[#1434CB] text-white text-[8px] font-black rounded-md tracking-tighter">VISA</span>
                        <span className="px-2 py-1 bg-[#EB001B] text-white text-[8px] font-black rounded-md tracking-tighter">MASTERCARD</span>
                        <span className="px-2 py-1 bg-[#008751] text-white text-[8px] font-black rounded-md tracking-tighter">MEEZA</span>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000" 
                            maxLength="19"
                            value={cardData.number}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                              setCardData({...cardData, number: value});
                            }}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-400 outline-none transition-all text-slate-800 font-mono"
                          />
                          <CreditCard size={20} className="absolute left-4 top-4.5 text-slate-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY" 
                            maxLength="5"
                            value={cardData.expiry}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').replace(/\/$/, '');
                              setCardData({...cardData, expiry: value});
                            }}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-400 outline-none transition-all text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">CVV</label>
                          <input 
                            type="password" 
                            placeholder="123" 
                            maxLength="3"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-400 outline-none transition-all text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="Name on card" 
                          value={cardData.name}
                          onChange={(e) => setCardData({...cardData, name: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-400 outline-none transition-all text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                      Encrypted SSL Payment Simulation
                    </div>
                  </div>
                )}
              </label>
            </div>
            <div className="mt-12 flex justify-between items-center">
              <button 
                onClick={handleBack}
                className="text-slate-400 font-bold hover:text-emerald-700 flex items-center gap-2 px-4 py-2 transition-colors cursor-pointer"
              >
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                onClick={handleNext}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl active:scale-95 cursor-pointer"
              >
                Review Order <ArrowRight size={22} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-10">Final Confirmation</h2>
            
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 relative group overflow-hidden">
                  <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-4">Shipping to</h4>
                  <p className="text-slate-900 font-bold text-xl leading-relaxed">{formData.governorate}</p>
                  <p className="text-emerald-700 font-bold">{formData.address_line}</p>
                  <div className="absolute -bottom-4 -right-4 text-emerald-100 opacity-20 group-hover:scale-110 transition-transform duration-700">
                    <MapPin size={100} />
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 relative group overflow-hidden">
                  <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-4">Payment</h4>
                  <p className="text-slate-900 font-bold text-xl">{formData.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card Payment'}</p>
                  <p className="text-emerald-700 font-bold">{formData.payment_method === 'cash_on_delivery' ? 'Pay at your doorstep' : 'Simulated Secure Payment'}</p>
                  <div className="absolute -bottom-4 -right-4 text-emerald-100 opacity-20 group-hover:scale-110 transition-transform duration-700">
                    {formData.payment_method === 'cash_on_delivery' ? <CreditCard size={100} /> : <svg className="w-24 h-24 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Cart Summary</h4>
                <div className="space-y-6 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-sm shadow-sm border border-slate-100">
                          {item.quantity}
                        </div>
                        <span className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{item.product?.name}</span>
                      </div>
                      <span className="font-serif font-bold text-emerald-800 text-xl">{formatPrice((item.product?.price || 0) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Total to Pay</span>
                <span className="text-5xl font-serif font-bold text-emerald-700">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
              <button 
                onClick={handleBack}
                disabled={isSubmitting}
                className="text-slate-400 font-bold hover:text-emerald-700 flex items-center gap-2 px-4 py-2 disabled:opacity-30 transition-colors cursor-pointer"
              >
                <ArrowLeft size={20} /> Back to Payment
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-emerald-700 text-white px-16 py-5 rounded-2xl font-bold text-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-70 flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 size={28} className="animate-spin" />
                ) : (
                  <>Confirm Order <ArrowRight size={28} /></>
                )}
              </button>
            </div>
          </div>
        )}
        
        {/* Subtle glow decoration */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      </div>
    </div>
  );
};

export default Checkout;
