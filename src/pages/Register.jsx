import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2, Globe, Leaf } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { EGYPT_GOVERNORATES } from '../constants/egypt';

const Register = () => {
 const { lang, t } = useLang();
 const [formData, setFormData] = useState({
 full_name: '',
 email: '',
 password: '',
 phone: '',
 governorate: 'Cairo',
 address: ''
 });
 const [isSubmitting, setIsSubmitting] = useState(false);
 
 const { register, login } = useContext(AuthContext);
 const navigate = useNavigate();

 const handleChange = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!formData.full_name || !formData.email || !formData.password) {
 toast.error("Name, email, and password are required");
 return;
 }
 
 if (formData.password.length < 6) {
 toast.error("Password must be at least 6 characters long");
 return;
 }

 setIsSubmitting(true);
 try {
 const payload = {
 ...formData,
 address: `${formData.governorate}, ${formData.address}`
 };
 
 await register(payload);
 toast.success("Account created successfully!");
 
 await login({ email: formData.email, password: formData.password });
 navigate('/products');
 } catch (error) {
 console.error("Registration error", error);
 toast.error(error.response?.data?.detail || "Registration failed. Please try again.");
 } finally {
 setIsSubmitting(false);
 }
 };

 const fullNamePlaceholder = lang.toUpperCase() === 'AR' ? 'محمود أحمد' : 'khalid samy';

 return (
 <div className="min-h-[80vh] flex items-center justify-center py-6 md:py-12 px-4 bg-slate-50 transition-colors duration-300">
 <div className="bg-white w-[95%] md:w-full max-w-lg p-5 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-slate-100 ">
 
 {/* LOGO ICON */}
 <div className="flex justify-center mb-6">
 <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
 <Leaf size={32} />
 </div>
 </div>

 <div className="text-center mb-6 md:mb-10">
 <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
 <p className="text-slate-500 font-medium text-xs md:text-base">Join our community of botanical lovers</p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div>
 <label className="text-sm font-medium text-slate-700 mb-1.5 block ml-1">Full Name</label>
 <div className="relative group">
 <input
 type="text"
 name="full_name"
 value={formData.full_name}
 onChange={handleChange}
 className="w-full bg-slate-50 text-slate-900 pl-12 pr-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all border border-transparent focus:border-green-500"
 placeholder={fullNamePlaceholder}
 required
 />
 <User size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
 </div>
 </div>
 <div>
 <label className="text-sm font-medium text-slate-700 mb-1.5 block ml-1">Email Address</label>
 <div className="relative group">
 <input
 type="email"
 name="email"
 value={formData.email}
 onChange={handleChange}
 className="w-full bg-slate-50 text-slate-900 pl-12 pr-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all border border-transparent focus:border-green-500"
 placeholder="jane@example.com"
 required
 />
 <Mail size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div>
 <label className="text-sm font-medium text-slate-700 mb-1.5 block ml-1">Password</label>
 <div className="relative group">
 <input
 type="password"
 name="password"
 value={formData.password}
 onChange={handleChange}
 className="w-full bg-slate-50 text-slate-900 pl-12 pr-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all border border-transparent focus:border-green-500"
 placeholder="••••••••"
 required
 />
 <Lock size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
 </div>
 </div>
 <div>
 <label className="text-sm font-medium text-slate-700 mb-1.5 block ml-1">Phone Number</label>
 <div className="relative group">
 <input
 type="text"
 name="phone"
 value={formData.phone}
 onChange={handleChange}
 className="w-full bg-slate-50 text-slate-900 pl-12 pr-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all border border-transparent focus:border-green-500"
 placeholder="+20 1..."
 />
 <Phone size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div>
 <label className="text-sm font-medium text-slate-700 mb-1.5 block ml-1">Governorate</label>
 <div className="relative">
 <select
 name="governorate"
 value={formData.governorate}
 onChange={handleChange}
 className="w-full bg-slate-50 text-slate-900 pl-12 pr-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none cursor-pointer border border-transparent focus:border-green-500"
 >
 {EGYPT_GOVERNORATES.map(gov => (
 <option key={gov} value={gov} className="">{gov}</option>
 ))}
 </select>
 <Globe size={20} className="absolute left-4 top-4 text-slate-400" />
 </div>
 </div>
 <div>
 <label className="text-sm font-medium text-slate-700 mb-1.5 block ml-1">City/Area</label>
 <div className="relative group">
 <input
 type="text"
 name="address"
 value={formData.address}
 onChange={handleChange}
 className="w-full bg-slate-50 text-slate-900 pl-12 pr-5 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all border border-transparent focus:border-green-500"
 placeholder="e.g. Maadi"
 />
 <MapPin size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-green-600 transition-colors" />
 </div>
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
 <>Create Account <ArrowRight size={20} /></>
 )}
 </button>
 </form>

 <div className="mt-10 text-center">
 <p className="text-slate-500 font-medium">
 Already have an account?{' '}
 <Link to="/login" className="text-green-600 hover:text-green-700 font-bold">
 Sign In
 </Link>
 </p>
 </div>
 </div>
 </div>
 );
};

export default Register;
