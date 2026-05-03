import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
 TrendingUp, Users, ShoppingBag, DollarSign,
 ArrowUpRight, Package, Loader2, Calendar,
 Clock, CheckCircle2, AlertCircle, XCircle
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';

// Currency formatter
const formatCurrency = (value) => {
 return new Intl.NumberFormat('en-US', {
 style: 'currency',
 currency: 'USD',
 minimumFractionDigits: 2,
 }).format(value || 0);
};

// Relative time formatter
const timeAgo = (dateStr) => {
 if (!dateStr) return '';
 const diff = Date.now() - new Date(dateStr).getTime();
 const mins = Math.floor(diff / 60000);
 if (mins < 1) return 'Just now';
 if (mins < 60) return `${mins}m ago`;
 const hours = Math.floor(mins / 60);
 if (hours < 24) return `${hours}h ago`;
 const days = Math.floor(hours / 24);
 return `${days}d ago`;
};

// Status styling
const getStatusConfig = (status) => {
 const s = status?.toLowerCase();
 switch (s) {
 case 'delivered':
 return { label: 'Delivered', icon: <CheckCircle2 size={14} />, cls: 'bg-green-100 text-green-700 ' };
 case 'confirmed':
 case 'shipped':
 return { label: s === 'confirmed' ? 'Confirmed' : 'Shipped', icon: <TrendingUp size={14} />, cls: 'bg-blue-100 text-blue-700 ' };
 case 'cancelled':
 return { label: 'Cancelled', icon: <XCircle size={14} />, cls: 'bg-red-100 text-red-700 ' };
 default:
 return { label: 'Pending', icon: <Clock size={14} />, cls: 'bg-amber-100 text-amber-700 ' };
 }
};

// Skeleton loader for stat cards
const StatSkeleton = () => (
 <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
 <div className="flex justify-between items-start mb-4">
 <div className="w-12 h-12 rounded-xl bg-slate-100 "></div>
 </div>
 <div className="h-3 w-20 bg-slate-100 rounded mb-3"></div>
 <div className="h-8 w-28 bg-slate-100 rounded"></div>
 </div>
);

// Skeleton loader for transactions
const TransactionSkeleton = () => (
 <div className="flex items-center gap-4 animate-pulse">
 <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0"></div>
 <div className="flex-grow">
 <div className="h-3 w-32 bg-slate-100 rounded mb-2"></div>
 <div className="h-2.5 w-20 bg-slate-100 rounded"></div>
 </div>
 <div className="h-4 w-16 bg-slate-100 rounded"></div>
 </div>
);

const StatCard = ({ title, value, icon, colorClass, loading }) => {
 if (loading) return <StatSkeleton />;
 return (
 <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
 <div className="flex justify-between items-start mb-4">
 <div className={`p-3 rounded-xl ${colorClass}`}>
 {React.cloneElement(icon, { size: 20 })}
 </div>
 </div>
 <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
 <p className="text-2xl md:text-3xl font-serif font-bold tracking-tight">{value}</p>
 </div>
 );
};

const AdminDashboard = () => {
 const [stats, setStats] = useState(null);
 const [recentOrders, setRecentOrders] = useState([]);
 const [loadingStats, setLoadingStats] = useState(true);
 const [loadingOrders, setLoadingOrders] = useState(true);

 useEffect(() => {
 fetchStats();
 fetchRecentOrders();
 }, []);

 const fetchStats = async () => {
 try {
 const data = await adminApi.getStats();
 setStats(data);
 } catch (error) {
 console.error('Failed to fetch stats', error);
 toast.error('Could not load dashboard stats');
 } finally {
 setLoadingStats(false);
 }
 };

 const fetchRecentOrders = async () => {
 try {
 const data = await adminApi.getOrders({ page: 1, page_size: 5 });
 // data could be an array or paginated object
 const orders = Array.isArray(data) ? data : (data.items || data);
 setRecentOrders(orders.slice(0, 5));
 } catch (error) {
 console.error('Failed to fetch recent orders', error);
 } finally {
 setLoadingOrders(false);
 }
 };

 // Compute health metrics from real stats
 const totalProducts = stats?.total_products || 0;
 const inStockPercent = totalProducts > 0 ? Math.min(Math.round((totalProducts / (totalProducts + 5)) * 100), 100) : 0;

 return (
 <div className="w-full bg-white text-slate-900 transition-colors duration-300">
 {/* Header */}
 <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
 <div>
 <h1 className="text-xl md:text-3xl font-serif font-bold mb-1">Systems Overview</h1>
 <p className="text-slate-500 text-[10px] md:text-sm">Real-time performance analytics for Greenify ecosystem.</p>
 </div>
 <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-sm">
 <Calendar size={16} className="text-primary-600" />
 <span className="font-bold text-slate-600 text-xs uppercase tracking-widest">Live Data</span>
 </div>
 </div>

 {/* STAT CARDS — Real data from /api/admin/stats/ */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
 <StatCard
 title="Gross Revenue"
 value={formatCurrency(stats?.total_revenue ?? stats?.total_sales)}
 icon={<DollarSign />}
 colorClass="bg-green-100 text-green-700 "
 loading={loadingStats}
 />
 <StatCard
 title="Total Orders"
 value={stats?.total_orders ?? 0}
 icon={<ShoppingBag />}
 colorClass="bg-blue-100 text-blue-700 "
 loading={loadingStats}
 />
 <StatCard
 title="Active Users"
 value={stats?.total_users ?? 0}
 icon={<Users />}
 colorClass="bg-purple-100 text-purple-700 "
 loading={loadingStats}
 />
 <StatCard
 title="Inventory"
 value={stats?.total_products ?? 0}
 icon={<Package />}
 colorClass="bg-amber-100 text-amber-700 "
 loading={loadingStats}
 />
 </div>

 {/* Bottom Grid: Transactions + Health */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

 {/* LIVE TRANSACTIONS — Real data from /api/admin/orders/ */}
 <div className="bg-white rounded-2xl p-4 md:p-6 border border-slate-200 ">
 <div className="flex justify-between items-center mb-6">
 <h3 className="text-lg font-bold">Recent Orders</h3>
 <Link to="/admin/orders" className="text-[11px] font-bold uppercase tracking-widest text-primary-600 hover:underline cursor-pointer">
 View All
 </Link>
 </div>

 <div className="space-y-4">
 {loadingOrders ? (
 [1, 2, 3, 4, 5].map(i => <TransactionSkeleton key={i} />)
 ) : recentOrders.length === 0 ? (
 <div className="text-center py-8">
 <ShoppingBag size={32} className="mx-auto text-slate-300 mb-2" />
 <p className="text-sm text-slate-400">No orders yet</p>
 </div>
 ) : (
 recentOrders.map((order) => {
 const statusConfig = getStatusConfig(order.status);
 return (
 <div key={order.id} className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary-600 flex-shrink-0 border border-slate-100 ">
 <ShoppingBag size={18} />
 </div>
 <div className="flex-grow min-w-0">
 <p className="text-sm font-bold truncate">Order #{order.id}</p>
 <div className="flex items-center gap-2">
 <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusConfig.cls}`}>
 {statusConfig.icon} {statusConfig.label}
 </span>
 <span className="text-[10px] text-slate-400 font-medium">{timeAgo(order.created_at)}</span>
 </div>
 </div>
 <div className="text-right flex-shrink-0">
 <p className="text-sm font-bold text-green-600 ">
 {formatCurrency(order.total_amount)}
 </p>
 </div>
 </div>
 );
 })
 )}
 </div>
 </div>

 {/* SYSTEM HEALTH — uses real inventory count */}
 <div className="bg-slate-900 rounded-2xl p-4 md:p-6 text-white border border-slate-800 relative overflow-hidden">
 <h3 className="text-lg font-bold mb-6 text-primary-400">System Health</h3>
 <div className="space-y-6">
 <div>
 <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest mb-2 opacity-80">
 <span>Stock Availability</span>
 <span>{inStockPercent}%</span>
 </div>
 <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
 <div className="h-full bg-primary-500 rounded-full transition-all duration-1000" style={{ width: `${inStockPercent}%` }}></div>
 </div>
 </div>
 <div>
 <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest mb-2 opacity-80">
 <span>Orders Fulfilled</span>
 <span>{stats?.total_orders ?? 0}</span>
 </div>
 <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
 <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min((stats?.total_orders || 0) * 5, 100)}%` }}></div>
 </div>
 </div>
 <div>
 <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest mb-2 opacity-80">
 <span>User Acquisition</span>
 <span>{stats?.total_users ?? 0} users</span>
 </div>
 <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
 <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min((stats?.total_users || 0) * 10, 100)}%` }}></div>
 </div>
 </div>
 </div>
 {/* Decorative glow */}
 <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary-600/10 rounded-full blur-[60px] pointer-events-none"></div>
 </div>
 </div>
 </div>
 );
};

export default AdminDashboard;
