import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, ArrowRight, Loader2, Leaf, CheckCircle2 } from 'lucide-react';
import { authApi } from '../api/authApi';

const ForgotPassword = () => {
 const [email, setEmail] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isSubmitted, setIsSubmitted] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!email) {
 toast.error("Please enter your email address");
 return;
 }
 
 setIsSubmitting(true);
 try {
 await authApi.forgotPassword(email);
 setIsSubmitted(true);
 toast.success("Reset link sent!");
 } catch (error) {
 console.error("Forgot password error", error);
 toast.error(error.response?.data?.detail || "Failed to send reset link. Please try again.");
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-slate-50 transition-colors duration-300">
 <div className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl shadow-green-900/5 border border-slate-100 ">
 
 {/* LOGO ICON */}
 <div className="flex justify-center mb-6">
 <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
 <Leaf size={32} />
 </div>
 </div>

 {isSubmitted ? (
 <div className="text-center space-y-6 py-4">
 <div className="flex justify-center">
 <CheckCircle2 size={64} className="text-green-600 animate-in zoom-in duration-500" />
 </div>
 <div>
 <h2 className="text-3xl font-bold text-slate-900 mb-3">Check Your Email</h2>
 <p className="text-slate-500 font-medium leading-relaxed">
 We've sent a password reset link to <span className="text-slate-900 font-bold">{email}</span>.
 </p>
 </div>
 <Link 
 to="/login" 
 className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-bold tracking-tight"
 >
 Back to Login <ArrowRight size={18} />
 </Link>
 </div>
 ) : (
 <>
 <div className="text-center mb-8">
 <h2 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h2>
 <p className="text-slate-500 font-medium leading-relaxed">
 Enter your email address and we'll send you a link to reset your password.
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
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

 <button
 type="submit"
 disabled={isSubmitting}
 className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-green-900/20 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
 >
 {isSubmitting ? (
 <Loader2 size={24} className="animate-spin" />
 ) : (
 <>
 Send Reset Link <ArrowRight size={20} />
 </>
 )}
 </button>
 </form>

 <div className="mt-10 text-center">
 <Link to="/login" className="text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors">
 Back to Login
 </Link>
 </div>
 </>
 )}
 </div>
 </div>
 );
};

export default ForgotPassword;
