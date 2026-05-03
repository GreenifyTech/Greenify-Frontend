import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, MapPin, CreditCard, Clock, CheckCircle2, 
  Truck, ArrowLeft, Loader2, FileText, Calendar
} from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { formatPrice } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderApi.getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order", error);
        toast.error("Could not load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center transition-colors duration-300">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center transition-colors duration-300">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">Order not found</h2>
        <Link to="/orders" className="text-emerald-700 font-bold underline">Back to My Orders</Link>
      </div>
    );
  }

  const orderStatus = order.status.toLowerCase();
  const steps = [
    { key: 'pending', label: 'Pending', icon: <Clock size={20} /> },
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 size={20} /> },
    { key: 'processing', label: 'Processing', icon: <Package size={20} /> },
    { key: 'shipped', label: 'Shipped', icon: <Truck size={20} /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle2 size={20} /> },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow transition-colors duration-300 antialiased">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link to="/orders" className="text-slate-400 hover:text-emerald-700 font-bold flex items-center gap-2 group transition-colors text-[10px] uppercase tracking-widest">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to My Orders
        </Link>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <Calendar size={18} className="text-emerald-600" />
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
            Ordered on {new Date(order.created_at).toLocaleDateString('en-US', { 
              month: 'long', day: 'numeric', year: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* STATUS STEPPER */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-10 flex items-center gap-2 relative z-10">
              Order Status: <span className="capitalize text-emerald-700">{order.status}</span>
            </h3>
            
            <div className="relative flex justify-between items-start z-10">
              {/* Natural flow line */}
              <div className="absolute top-6 left-0 w-full h-1 bg-slate-50 -z-10"></div>
              
              {steps.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex flex-col items-center gap-3 relative">
                    <div 
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                        isActive 
                          ? 'bg-emerald-700 border-white text-white shadow-xl shadow-emerald-900/20' 
                          : 'bg-white border-slate-50 text-slate-200'
                      } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-center max-w-[60px] sm:max-w-none ${isActive ? 'text-emerald-700' : 'text-slate-300'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {/* Decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-30"></div>
          </div>

          {/* ITEM BREAKDOWN */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-8 flex items-center gap-2">
              <Package size={24} className="text-emerald-600" /> Order Items
            </h3>
            <div className="space-y-8">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 sm:gap-6 pb-8 border-b border-slate-50 last:border-0 last:pb-0 group">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                    <img 
                      src={item.product?.image_url || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=200'} 
                      alt={item.item_name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900 text-lg">{item.item_name}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {item.quantity} unit{item.quantity > 1 ? 's' : ''} × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-emerald-800 text-xl">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ORDER INFO SIDEBAR */}
        <aside className="space-y-8">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-white/5 relative overflow-hidden">
            <h3 className="text-xl md:text-2xl font-serif font-bold mb-8 flex items-center gap-2 text-emerald-400 relative z-10">
              Order Summary
            </h3>
            <div className="space-y-5 mb-10 relative z-10">
              <div className="flex justify-between text-slate-400 font-bold text-sm">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-slate-400 font-bold text-sm">
                <span>Shipping</span>
                <span className="text-emerald-400 uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Paid</span>
                <span className="text-3xl font-serif font-bold text-emerald-400">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white/5 rounded-xl text-emerald-400 mt-1 flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Shipping Address</h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">{order.shipping_address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-white/5 rounded-xl text-emerald-400 mt-1 flex-shrink-0">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Payment Method</h4>
                  <p className="text-sm text-slate-200 uppercase font-bold tracking-widest">{order.payment_method.replace(/_/g, ' ')}</p>
                </div>
              </div>
              {order.notes && (
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-white/5 rounded-xl text-emerald-400 mt-1 flex-shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Notes</h4>
                    <p className="text-sm text-slate-300 italic font-medium leading-relaxed">"{order.notes}"</p>
                  </div>
                </div>
              )}
            </div>
            {/* Subtle glow decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm text-center">
            <h4 className="text-lg font-bold text-slate-900 mb-2">Order Issues?</h4>
            <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">If you have any problems with your delivery or the items received, contact us immediately.</p>
            <Link to="/support" className="inline-block w-full py-4 rounded-2xl border-2 border-slate-100 text-emerald-700 font-bold hover:bg-slate-50 transition-all active:scale-95">
              Contact Support
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetail;
