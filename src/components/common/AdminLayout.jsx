import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
 LayoutDashboard, Package, ShoppingCart, Users, 
 ArrowLeft, LogOut, ChevronRight, Menu, X, Tag
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const AdminLayout = () => {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const location = useLocation();
 const navigate = useNavigate();
 const { logout } = useContext(AuthContext);

 // Close mobile menu on route change
 useEffect(() => {
 setIsMobileMenuOpen(false);
 }, [location.pathname]);

 const menuItems = [
 { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, end: true },
 { name: 'Categories', path: '/admin/categories', icon: <Tag size={20} /> },
 { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
 { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
 { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
 ];

 const handleLogout = () => {
 logout();
 navigate('/');
 };

 const SidebarContent = () => (
 <div className="h-full flex flex-col bg-white transition-colors">
 <div className="p-8">
 <Link to="/" className="flex items-center gap-3 mb-12 group">
 <img src={logo} alt="Greenify" className="h-10 w-auto group-hover:scale-105 transition-transform " />
 <span className="font-serif font-bold text-xl text-slate-900 ">Admin</span>
 </Link>
 
 <nav className="space-y-3">
 {menuItems.map((item) => (
 <NavLink
 key={item.path}
 to={item.path}
 end={item.end}
 className={({ isActive }) => `
 flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all font-bold text-sm tracking-tight
 ${isActive 
 ? 'bg-primary-700 text-white shadow-lg shadow-primary-900/20' 
 : 'text-slate-500 hover:bg-slate-50 hover:text-primary-700 '
 }
 `}
 >
 <div className="flex items-center gap-3">
 {React.cloneElement(item.icon, { size: 18 })}
 {item.name}
 </div>
 <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
 </NavLink>
 ))}
 </nav>
 </div>
 
 <div className="mt-auto p-8 border-t border-slate-100 ">
 <button 
 onClick={handleLogout}
 className="flex items-center gap-3 text-red-600 font-bold hover:bg-red-50 w-full px-5 py-3.5 rounded-2xl transition-all text-sm tracking-tight cursor-pointer"
 >
 <LogOut size={18} /> Logout
 </button>
 </div>
 </div>
 );

 return (
 <div className="min-h-screen bg-slate-50 flex transition-colors duration-300 relative overflow-x-hidden">
 
 {/* MOBILE OVERLAY */}
 {isMobileMenuOpen && (
 <div 
 className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
 onClick={() => setIsMobileMenuOpen(false)}
 />
 )}

 {/* MOBILE DRAWER (Sidebar) */}
 <aside className={`
 fixed inset-y-0 left-0 w-72 z-[70] lg:hidden transform transition-transform duration-500 ease-spring
 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
 `}>
 <div className="h-full shadow-2xl relative">
 <button 
 onClick={() => setIsMobileMenuOpen(false)}
 className="absolute top-8 right-[-50px] p-2 bg-white rounded-xl text-slate-500 lg:hidden shadow-lg border border-slate-100 "
 >
 <X size={20} />
 </button>
 <SidebarContent />
 </div>
 </aside>

 {/* DESKTOP SIDEBAR */}
 <aside className="w-64 border-r border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen transition-colors z-30">
 <SidebarContent />
 </aside>

 {/* MAIN CONTENT */}
 <main className="flex-1 flex flex-col min-w-0">
 <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 sticky top-0 flex items-center justify-between z-40 transition-colors">
 <div className="flex items-center gap-4">
 <button 
 onClick={() => setIsMobileMenuOpen(true)}
 className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-100 transition-all border border-slate-100 cursor-pointer shadow-sm"
 >
 <Menu size={20} />
 </button>
 <Link to="/" className="lg:hidden flex items-center gap-2 group">
 <img src={logo} alt="Greenify" className="h-8 w-auto " />
 <span className="font-serif font-bold text-xl text-slate-900 tracking-tight">Admin</span>
 </Link>
 </div>
 
 <div className="flex items-center gap-4">
 <Link to="/" className="text-slate-500 hover:text-primary-700 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 px-5 py-2.5 bg-slate-50 rounded-xl transition-all border border-slate-100 shadow-sm">
 <ArrowLeft size={16} /> <span className="hidden sm:inline">Store</span>
 </Link>
 <div className="w-10 h-10 rounded-2xl bg-primary-100 flex items-center justify-center font-bold text-primary-700 border border-primary-200 shadow-sm text-sm">
 AD
 </div>
 </div>
 </header>

 <div className="p-6 lg:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <Outlet />
 </div>
 </main>
 </div>
 );
};

export default AdminLayout;
