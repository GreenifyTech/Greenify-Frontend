import React from 'react';
import { Sprout, Sun, Droplets, Wind, Thermometer, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

const PlantTips = () => {
 const { t } = useLang();
 
 const tips = [
 { 
 title: t('light_requirements'), 
 desc: t('light_desc'), 
 icon: <Sun className="text-yellow-500" />,
 bg: 'bg-yellow-50 ',
 border: 'border-yellow-100 '
 },
 { 
 title: t('watering_wisdom'), 
 desc: t('watering_desc'), 
 icon: <Droplets className="text-blue-500" />,
 bg: 'bg-blue-50 ',
 border: 'border-blue-100 '
 },
 { 
 title: t('air_humidity'), 
 desc: t('air_humidity_desc'), 
 icon: <Wind className="text-primary-500" />,
 bg: 'bg-primary-50 ',
 border: 'border-primary-100 '
 },
 { 
 title: t('temp_control'), 
 desc: t('temp_control_desc'), 
 icon: <Thermometer className="text-red-500" />,
 bg: 'bg-red-50 ',
 border: 'border-red-100 '
 }
 ];

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow transition-colors duration-300">
 <div className="mb-16 text-center max-w-3xl mx-auto">
 <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">{t('plant_care_secrets')}</h1>
 <p className="text-lg text-slate-600 font-medium leading-relaxed">{t('expert_advice')}</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
 {tips.map((tip, idx) => (
 <div key={idx} className={`${tip.bg} ${tip.border} rounded-[2.5rem] p-10 border shadow-sm hover:shadow-xl transition-all group relative overflow-hidden rtl:text-right`}>
 <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform relative z-10 rtl:mr-auto rtl:ml-0">
 {tip.icon}
 </div>
 <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{tip.title}</h3>
 <p className="text-slate-600 text-sm leading-relaxed font-medium relative z-10">{tip.desc}</p>
 
 {/* Decorative background element */}
 <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
 </div>
 ))}
 </div>

 <div className="bg-primary-950 rounded-[3rem] p-10 sm:p-20 text-white relative overflow-hidden shadow-2xl">
 <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 <div className="rtl:text-right">
 <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 shadow-lg shadow-red-900/20">
 <ShieldAlert size={14} /> {t('critical_warning')}
 </div>
 <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">{t('yellow_leaf_mystery')}</h2>
 <p className="text-primary-100 mb-10 leading-relaxed text-lg font-medium opacity-90">
 {t('yellow_leaf_desc')}
 </p>
 <Link to="/products" className="bg-white text-primary-950 px-10 py-4 rounded-2xl font-bold hover:bg-primary-50 transition-all shadow-xl shadow-black/20 inline-flex items-center gap-2">
 {t('explore_collection')} <ArrowRight size={20} className="rtl:rotate-180" />
 </Link>
 </div>
 <div className="relative">
 <div className="absolute -inset-4 bg-white/10 rounded-[2.5rem] blur-2xl"></div>
 <img src="https://images.unsplash.com/photo-1530633721334-03463870624b?auto=format&fit=crop&q=80&w=600" className="rounded-[2.5rem] shadow-2xl relative z-10 border border-white/10" alt="" />
 <div className="absolute -bottom-6 -left-6 bg-primary-700 p-6 rounded-[1.5rem] shadow-xl z-20 animate-bounce-subtle">
 <Sprout size={40} className="text-white" />
 </div>
 </div>
 </div>
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px]"></div>
 <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400/10 rounded-full blur-[100px]"></div>
 </div>
 </div>
 );
};

export default PlantTips;
