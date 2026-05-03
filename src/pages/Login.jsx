import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, Leaf } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);
 
 const { login } = useContext(AuthContext);
 const navigate = useNavigate();
 const location = useLocation();

 const from = location.state?.from?.pathname || "/products";

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!email || !password) {
 toast.error("Please fill in all fields");
 return;
 }
 
 setIsSubmitting(true);
 try {
 const data = await login({ email, password });
 toast.success("Welcome back to Greenify!");
 
 if (data.user && data.user.is_admin) {
 navigate('/admin', { replace: true });
 } else {
 navigate(from, { replace: true });
 }
 } catch (error) {
 console.error("Login error", error);
 toast.error(error.response?.data?.detail || "Invalid credentials. Please try again.");
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="min-h-[80vh] flex items-center justify-center py-6 md:py-12 px-4 bg-slate-50 transition-colors duration-300">
 <div className="bg-white w-[95%] md:w-full max-w-md p-5 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-slate-100 ">
 
 {/* LOGO ICON */}
 <div className="flex justify-center mb-6">
 <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
 <Leaf size={32} />
 </div>
 </div>

 <div className="text-center mb-6 md:mb-8">
 <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
 <p className="text-slate-500 font-medium text-xs md:text-base">Access your botanical dashboard</p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="text-sm font-medium text-slate-700 mb-1.5 block ml-1">Email Address</label>
 <div className="relative group">
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full bg-slate-50 text-slate-900 pl-12 pr-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all border border-transparent focus:border-green-500"
 placeholder="you@example.com"
 required
 />
 <Mail size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
 </div>
 </div>

 <div>
 <div className="flex items-center justify-between mb-1.5 ml-1">
 <label className="text-sm font-medium text-slate-700 block">Password</label>
 <Link to="/forgot-password" size="sm" className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-widest">Forgot?</Link>
 </div>
 <div className="relative group">
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full bg-slate-50 text-slate-900 pl-12 pr-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all border border-transparent focus:border-green-500"
 placeholder="••••••••"
 required
 />
 <Lock size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
 </div>
 </div>

 <button
 type="submit"
 disabled={isSubmitting}
 className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-green-900/20 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
 >
 {isSubmitting ? (
 <Loader2 size={24} className="animate-spin" />
 ) : (
 <>
 Sign In <ArrowRight size={20} />
 </>
 )}
 </button>
 </form>

 <div className="mt-10 text-center">
 <p className="text-slate-500 font-medium">
 Don't have an account?{' '}
 <Link to="/register" className="text-green-600 hover:text-green-700 font-bold">
 Sign up
 </Link>
 </p>
 </div>
 </div>
 </div>
 );
};

export default Login;
