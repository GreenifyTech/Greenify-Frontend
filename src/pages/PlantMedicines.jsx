import React from 'react';
import { ShieldPlus, Bug, FlaskConical, Beaker, HelpCircle, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

const PlantMedicines = () => {
 const { t } = useLang();
 
 const categories = [
 { 
 title: t('natural_pesticides'), 
 icon: <Bug />, 
 items: ['Neem Oil Extract', 'Insecticidal Soap', 'Diatomaceous Earth'],
 desc: t('natural_pesticides_desc')
 },
 { 
 title: t('growth_boosters'), 
 icon: <TrendingUp />, 
 items: ['Liquid Seaweed', 'Bio-Stimulants', 'Worm Castings'],
 desc: t('growth_boosters_desc')
 },
 { 
 title: t('antifungals'), 
 icon: <ShieldPlus />, 
 items: ['Copper Fungicide', 'Baking Soda Mix', 'Sulfur Powder'],
 desc: t('antifungals_desc')
 }
 ];

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow transition-colors duration-300">
 <div className="mb-20 text-center sm:text-left rtl:sm:text-right">
 <h1 className="text-6xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
 {t('medicine_cabinet').split(' ')[0]} <span className="text-primary-600">{t('medicine_cabinet').split(' ')[1] || ''}</span>
 </h1>
 <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
 {t('medicine_desc')}
 </p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
 {categories.map((cat, idx) => (
 <div key={idx} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 hover:shadow-xl transition-all flex flex-col group rtl:text-right">
 <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-700 mb-8 group-hover:scale-110 transition-transform rtl:mr-auto rtl:ml-0">
 {React.cloneElement(cat.icon, { size: 32 })}
 </div>
 <h3 className="text-2xl font-bold text-slate-900 mb-4">{cat.title}</h3>
 <p className="text-slate-500 mb-8 flex-grow font-medium leading-relaxed">{cat.desc}</p>
 <ul className="space-y-3 pt-8 border-t border-slate-50 ">
 {cat.items.map((item, i) => (
 <li key={i} className="flex items-center gap-3 text-sm font-bold text-primary-900 rtl:flex-row-reverse">
 <div className="w-1.5 h-1.5 rounded-full bg-primary-400"></div>
 {item}
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
 <div className="bg-primary-50 rounded-[3rem] p-12 border border-primary-100 flex flex-col justify-center rtl:text-right">
 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 rtl:mr-auto rtl:ml-0">
 <AlertTriangle className="text-orange-500" />
 </div>
 <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('when_to_use_medicine')}</h2>
 <p className="text-primary-800 leading-relaxed mb-10 font-medium">
 {t('when_to_use_medicine_desc')}
 </p>
 <Link to="/ai-doctor" className="bg-primary-950 text-white px-8 py-4 rounded-xl font-bold w-fit hover:bg-primary-800 transition-all flex items-center gap-2 rtl:mr-auto rtl:ml-0">
 {t('consult_ai_doctor')} <ArrowRight size={20} className="rtl:rotate-180" />
 </Link>
 </div>
 <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-[3rem] p-12 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl rtl:text-right">
 <div className="relative z-10">
 <h2 className="text-4xl font-serif font-bold mb-6">{t('professional_consultation')}</h2>
 <p className="text-primary-50 leading-relaxed mb-10 text-lg opacity-90 font-medium">
 {t('professional_consultation_desc')}
 </p>
 <div className="flex gap-4 items-center rtl:flex-row-reverse">
 <div className="flex -space-x-3 rtl:space-x-reverse">
 {[1, 2, 3].map(i => (
 <div key={i} className="w-12 h-12 rounded-full border-4 border-primary-800 bg-slate-200 overflow-hidden shadow-lg">
 <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
 </div>
 ))}
 </div>
 <span className="text-sm font-bold tracking-wide flex items-center gap-2">
 Join <span className="bg-white/20 px-2 py-0.5 rounded-lg">500+</span> professionals
 </span>
 </div>
 </div>
 <div className="absolute -top-10 -right-10 text-white/5 rotate-12">
 <Beaker size={250} />
 </div>
 <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
 </div>
 </div>
 </div>
 );
};

export default PlantMedicines;
