import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ExternalLink, Clock, CheckCircle2, Truck, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { formatPrice } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getMyOrders();
        setOrders(data.items || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        toast.error("Could not load your orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return { icon: <Clock size={16} />, color: 'bg-amber-100 text-amber-700', label: 'Pending' };
      case 'processing': return { icon: <Loader2 size={16} className="animate-spin" />, color: 'bg-blue-100 text-blue-700', label: 'Processing' };
      case 'shipped': return { icon: <Truck size={16} />, color: 'bg-emerald-100 text-emerald-700', label: 'Shipped' };
      case 'delivered': return { icon: <CheckCircle2 size={16} />, color: 'bg-green-100 text-green-700', label: 'Delivered' };
      case 'cancelled': return { icon: <XCircle size={16} />, color: 'bg-red-100 text-red-700', label: 'Cancelled' };
      default: return { icon: <Package size={16} />, color: 'bg-gray-100 text-gray-700', label: status };
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center transition-colors duration-300">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500 font-medium">Fetching your order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow transition-colors duration-300 antialiased">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">My Orders</h1>
        <p className="text-slate-500 font-medium">Track and manage your green deliveries.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm animate-fade-in-up">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-300">
            <Package size={40} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">No orders yet</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
            You haven't placed any orders yet. Start shopping and bring some life to your space!
          </p>
          <Link to="/products" className="bg-emerald-700 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 active:scale-95 inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = getStatusConfig(order.status);
            return (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${status.color}`}>
                      {status.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        Order #{order.id}
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${status.color}`}>
                          {status.label}
                        </span>
                      </h4>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-emerald-800">{formatPrice(order.total_amount)}</p>
                    </div>
                    <Link 
                      to={`/orders/${order.id}`}
                      className="bg-slate-50 text-emerald-700 p-3 rounded-xl hover:bg-emerald-700 hover:text-white transition-all group-hover:bg-emerald-700 group-hover:text-white active:scale-90"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
                
                {/* Mini Item List */}
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex-shrink-0 flex items-center gap-2 bg-emerald-50/50 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-800 border border-emerald-100/50">
                      <span>{item.quantity}x</span>
                      <span className="truncate max-w-[120px]">{item.item_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
