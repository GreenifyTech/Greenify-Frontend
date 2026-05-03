import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useLang } from '../../context/LangContext';

const Footer = () => {
 const { t } = useLang();
 
 return (
 <footer className="bg-slate-900 text-white pt-12 md:pt-24 pb-12 border-t border-slate-800 mt-auto relative overflow-hidden transition-colors duration-300">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-12 md:mb-20">
 <div className="space-y-6 md:space-y-8 text-start">
 <Link to="/" className="inline-block group">
 <img src={logo} alt="Greenify" className="h-12 w-auto group-hover:scale-105 transition-transform" />
 </Link>
 <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xs font-medium">
 {t('footer_tagline')}
 </p>
 </div>
 
 <div className="text-start">
 <h4 className="font-bold mb-8 text-slate-100 uppercase tracking-[0.2em] text-[10px]">{t('shop')}</h4>
 <ul className="space-y-4 text-xs md:text-sm font-bold">
 <li><Link to="/products" className="hover:text-primary-700 transition-colors inline-block tracking-tight">{t('full_collection')}</Link></li>
 <li><Link to="/products?category=1" className="hover:text-primary-700 transition-colors inline-block tracking-tight">{t('indoor_species')}</Link></li>
 <li><Link to="/products?category=2" className="hover:text-primary-700 transition-colors inline-block tracking-tight">{t('outdoor_species')}</Link></li>
 <li><Link to="/bouquets" className="hover:text-primary-700 transition-colors inline-block tracking-tight">{t('bouquet_designer')}</Link></li>
 </ul>
 </div>
 
 <div className="text-start">
 <h4 className="font-bold mb-8 text-slate-100 uppercase tracking-[0.2em] text-[10px]">{t('ecosystem')}</h4>
 <ul className="space-y-4 text-xs md:text-sm font-bold">
 <li><Link to="/ai-doctor" className="hover:text-primary-700 transition-colors inline-block tracking-tight">{t('ai_doctor')}</Link></li>
 <li><Link to="/plant-tips" className="hover:text-primary-700 transition-colors inline-block tracking-tight">{t('care_tips')}</Link></li>
 <li><Link to="/plant-medicines" className="hover:text-primary-700 transition-colors inline-block tracking-tight">{t('medicine_cabinet')}</Link></li>
 <li><Link to="/support" className="hover:text-primary-700 transition-colors inline-block tracking-tight">{t('support_hub')}</Link></li>
 </ul>
 </div>
 
 <div className="text-start">
 <h4 className="font-bold mb-8 text-slate-100 uppercase tracking-[0.2em] text-[10px]">{t('academic_context')}</h4>
 <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5 shadow-sm">
 <p className="text-xs text-slate-500 leading-relaxed mb-6 italic font-medium">
 "Project Greenify V2 | BIDT #15 | Helwan National University · 2026"
 </p>
 <div className="flex gap-2">
 <div className="w-2.5 h-2.5 rounded-full bg-primary-600"></div>
 <div className="w-2.5 h-2.5 rounded-full bg-primary-400 opacity-50"></div>
 <div className="w-2.5 h-2.5 rounded-full bg-primary-200 opacity-20"></div>
 </div>
 </div>
 </div>
 </div>
 
 <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-1">
 <span dir="ltr">&copy; {new Date().getFullYear()} GREENIFY BOTANICAL TECH.</span>
 <span>{t('all_rights_reserved').toUpperCase()}</span>
 </p>
 <div className="flex gap-6 md:gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ">
 <Link to="/terms" className="hover:text-primary-700 transition-colors">{t('terms')}</Link>
 <Link to="/privacy" className="hover:text-primary-700 transition-colors">{t('privacy')}</Link>
 <Link to="/security" className="hover:text-primary-700 transition-colors">{t('security')}</Link>
 </div>
 </div>
 </div>
 
 {/* Decorative glow */}
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
 </footer>
 );
};

export default Footer;
