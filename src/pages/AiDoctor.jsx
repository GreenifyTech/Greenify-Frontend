import React, { useState } from 'react';
import {
 Bot, Sparkles, AlertCircle, CheckCircle2,
 Activity, Thermometer, ShieldAlert, Loader2, Info, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { aiApi } from '../api/aiApi';
import { useLang } from '../context/LangContext';

const AiDoctor = () => {
 const { t, lang } = useLang();
 const [symptoms, setSymptoms] = useState('');
 const [isDiagnosing, setIsDiagnosing] = useState(false);
 const [result, setResult] = useState(null);

 const suggestions = [
 t('suggestion_1'),
 t('suggestion_2'),
 t('suggestion_3'),
 t('suggestion_4'),
 t('suggestion_5'),
 ];

 const handleDiagnose = async (e) => {
 e.preventDefault();
 if (!symptoms.trim()) {
 toast.error(t('describe_symptoms_error') || "Please describe your plant's symptoms first.");
 return;
 }

 setIsDiagnosing(true);
 setResult(null);
 try {
 const data = await aiApi.diagnose(symptoms);
 setResult(data);
 toast.success(t('diagnosis_complete') || "Diagnosis complete!");
 } catch (error) {
 console.error("Diagnosis failed", error);
 toast.error(t('doctor_busy') || "The doctor is busy. Please try again in a moment.");
 } finally {
 setIsDiagnosing(false);
 }
 };

 const getConfidenceStyles = (level) => {
 switch (level?.toLowerCase()) {
 case 'high': return 'bg-green-100 text-green-700 border-green-200 ';
 case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200 ';
 case 'low': return 'bg-red-100 text-red-700 border-red-200 ';
 default: return 'bg-slate-100 text-slate-600 border-slate-200 ';
 }
 };

 return (
 <div className="w-full min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 pt-28">

 {/* HEADER */}
 <section className="py-16 px-4 bg-white ">
 <div className="max-w-4xl mx-auto text-center flex flex-col gap-4 items-center">
 <div className="p-3 bg-primary-50 rounded-2xl border border-primary-100 ">
 <Bot size={36} className="text-primary-700 " />
 </div>
 <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold tracking-tight">{t('ai_doctor')}</h1>
 <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
 {t('ai_doctor_hero_subtitle')}
 </p>
 </div>
 </section>

 {/* FORM AREA */}
 <section className="max-w-4xl mx-auto w-full px-4 pb-20">
 <div className="flex flex-col gap-8">

 {/* INPUT CARD */}
 <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
 <form onSubmit={handleDiagnose} className="flex flex-col gap-6">
 <div>
 <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
 <Activity size={14} className="text-green-600" /> {t('describe_symptoms')}
 </label>
 <textarea
 value={symptoms}
 onChange={(e) => setSymptoms(e.target.value)}
 placeholder={t('symptom_placeholder')}
 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-green-500 outline-none transition-colors h-36 resize-none text-base text-slate-900 "
 />
 </div>

 <div>
 <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">{t('quick_suggestions')}</p>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {suggestions.map((text, i) => (
 <button
 key={i}
 type="button"
 onClick={() => setSymptoms(text)}
 className="text-left rtl:text-right text-sm text-slate-600 bg-slate-50 p-3 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors border border-slate-100 flex items-center justify-between cursor-pointer"
 >
 <span className="truncate pr-3 rtl:pr-0 rtl:pl-3">{text}</span>
 <ArrowRight size={14} className="text-slate-300 flex-shrink-0 rtl:rotate-180" />
 </button>
 ))}
 </div>
 </div>

 <button
 type="submit"
 disabled={isDiagnosing}
 className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer shadow-lg shadow-green-900/10 active:scale-[0.98]"
 >
 {isDiagnosing ? (
 <><Loader2 className="animate-spin" size={22} /> {t('analyzing')}</>
 ) : (
 <><Sparkles size={22} /> {t('get_diagnosis')}</>
 )}
 </button>
 </form>
 </div>

 {/* RESULTS */}
 {result && (
 <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
 {/* Status bar */}
 <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
 <div className="flex items-center gap-2">
 <CheckCircle2 size={16} className="text-green-600" />
 <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ">{t('diagnostic_report')}</span>
 </div>
 <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${getConfidenceStyles(result.confidence)}`}>
 {result.confidence} {t('confidence')}
 </span>
 </div>

 <div className="p-6 sm:p-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Diagnosis */}
 <div className="flex flex-col gap-6">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <Thermometer size={16} className="text-green-600" />
 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('condition')}</span>
 </div>
 <h2 className="text-xl md:text-3xl font-serif font-bold mb-1">
 {lang === 'ar' ? result.possible_disease_ar : result.possible_disease}
 </h2>
 <p className="text-green-600 font-serif italic">
 {lang === 'ar' ? result.possible_disease : result.possible_disease_ar}
 </p>
 </div>

 <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 ">
 <div className="flex items-start gap-3">
 <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
 <div>
 <h5 className="font-bold mb-1">{t('likely_cause')}</h5>
 <p className="text-slate-500 text-sm leading-relaxed">{result.cause}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Treatment */}
 <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex flex-col gap-4">
 <div className="flex items-center gap-2">
 <ShieldAlert size={16} className="text-green-700 " />
 <span className="text-[10px] font-bold text-green-700/70 uppercase tracking-widest">{t('treatment')}</span>
 </div>
 <p className="text-slate-700 text-base leading-relaxed font-medium">
 {result.treatment}
 </p>
 <div className="flex items-start gap-2 text-xs text-slate-400 bg-white/50 p-4 rounded-lg border border-slate-100/50 italic">
 <Info size={14} className="flex-shrink-0 mt-0.5" />
 <p>{result.disclaimer}</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Footer info */}
 {!result && (
 <div className="text-center">
 <span className="inline-flex items-center gap-2 text-slate-400 text-sm bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
 <ShieldAlert size={14} /> {t('bio_verified')}
 </span>
 </div>
 )}
 </div>
 </section>
 </div>
 );
};

export default AiDoctor;
