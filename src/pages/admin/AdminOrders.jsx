import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Clock, CheckCircle2, Truck, XCircle, 
  Loader2, Filter, ChevronRight, CreditCard, AlertCircle
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatCurrency';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const data = await adminApi.getOrders({ status: filter || undefined });
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
      toast.error("Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const toastId = toast.loading("Updating status...");
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success("Order status updated", { id: toastId });
    } catch (error) {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return { icon: <Clock size={16} />, color: 'bg-amber-50 text-amber-700 border-amber-100 ' };
      case 'processing': return { icon: <Loader2 size={16} className="animate-spin" />, color: 'bg-blue-50 text-blue-700 border-blue-100 ' };
      case 'shipped': return { icon: <Truck size={16} />, color: 'bg-indigo-50 text-indigo-700 border-indigo-100 ' };
      case 'delivered': return { icon: <CheckCircle2 size={16} />, color: 'bg-green-50 text-green-700 border-green-100 ' };
      case 'cancelled': return { icon: <XCircle size={16} />, color: 'bg-red-50 text-red-700 border-red-100 ' };
      default: return { icon: <ShoppingBag size={16} />, color: 'bg-slate-50 text-slate-700 border-slate-100 ' };
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-16 md:py-32 bg-white ">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Fetching logistics journal...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow bg-white transition-colors duration-300 antialiased">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-2">Order Management</h1>
          <p className="text-slate-500 text-xs md:text-medium font-medium">Track fulfillment pipeline and customer transactions.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 md:px-6 md:py-3 rounded-2xl border border-slate-100 shadow-sm">
          <Filter size={18} md:size={18} className="text-slate-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-[10px] md:text-xs font-bold text-slate-700 bg-transparent outline-none cursor-pointer uppercase tracking-widest"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 ">
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry Date</th>
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valuation</th>
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment</th>
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fulfillment</th>
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 ">
              {orders.map((order) => {
                const status = getStatusConfig(order.status);
                return (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-4 md:px-8 md:py-6">
                      <p className="font-bold text-slate-900 text-base md:text-lg tracking-tight">#{order.id}</p>
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-6 text-[10px] md:text-sm font-medium text-slate-500 ">
                      {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-6 font-serif font-bold text-slate-900 text-base md:text-lg">{formatPrice(order.total_amount)}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {order.payment_status === 'paid' ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <AlertCircle size={16} className="text-amber-500" />
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${order.payment_status === 'paid' ? 'text-emerald-600 ' : 'text-amber-600 '}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] font-bold border uppercase tracking-widest shadow-sm ${status.color}`}>
                        {status.icon}
                        {order.status}
                      </div>
                    </td>
                    <td className="px-4 py-4 md:px-8 md:py-6 text-right">
                      <div className="flex justify-end">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-[10px] font-bold bg-white border-2 border-slate-100 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-2.5 outline-none focus:border-emerald-400 transition-all cursor-pointer uppercase tracking-widest text-slate-700 shadow-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
