import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
 ArrowRight, Leaf, ShieldCheck, Truck,
 TrendingUp, Users, ShoppingBag, Star,
 Sprout, Heart
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { useLang } from '../context/LangContext';
import ProductCard from '../components/products/ProductCard';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Home = () => {
 const { t } = useLang();
 const navigate = useNavigate();
 const { user } = useContext(AuthContext);
 const { addItem } = useContext(CartContext);
 
 const [topPicks, setTopPicks] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const fetchTopPicks = async () => {
 try {
 const data = await productApi.getAllProducts({ limit: 4 });
 setTopPicks(data.items?.slice(0, 4) || data.slice(0, 4));
 } catch (error) {
 console.error("Failed to fetch top picks", error);
 } finally {
 setLoading(false);
 }
 };
 fetchTopPicks();
 }, []);

 const handleAddToCart = async (product) => {
  if (!user) {
  toast.error('Please login to add items to cart.', { icon: '🔒' });
  navigate('/login');
  return;
  }

  try {
  await addItem(Number(product.id), 1);
  toast.success(`${product.name} added to cart!`, { icon: '🌿' });
  } catch (err) {
  console.error('Add to cart failed:', err);
  toast.error('Failed to add to cart.');
  }
 };

 // Fallback image utility
 const handleImgError = (e) => {
  e.target.src = "https://images.unsplash.com/photo-1497250681554-182325c13cb1?auto=format&fit=crop&q=80&w=800";
 };

 return (
 <div className="w-full bg-slate-50 text-slate-900 transition-colors duration-300">

 {/* PROMO BANNER */}
 <div className="bg-white text-slate-500 py-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-200 ">
 🚀 {t('promo_banner')}
 </div>

 {/* HERO */}
 <section className="bg-slate-50 py-16 sm:py-24">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="space-y-8 text-center lg:text-left rtl:lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100 animate-fade-in-up">
              <Leaf size={14} /> {t('new_season_collection')}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight text-slate-900 animate-fade-in-up">
              {t('hero_title')}
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-in-up-delay">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-end gap-4 animate-fade-in-up-delay">
              <Link to="/products" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-base flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 cursor-pointer active:scale-95">
                {t('shop_now')} <ArrowRight size={18} className="rtl:rotate-180" />
              </Link>
              <Link to="/ai-doctor" className="bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-base hover:bg-slate-50 transition-all cursor-pointer active:scale-95">
                {t('ai_doctor')}
              </Link>
            </div>
          </div>
          {/* Image */}
          <div className="group rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-200 animate-fade-in-up">
            <img
              src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=1000"
              alt="Greenify Botanical"
              onError={handleImgError}
              className="w-full h-[400px] sm:h-[500px] object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
            />
          </div>
 </div>
 </div>
 </section>

 {/* STATS */}
 <section className="bg-white py-16 border-y border-slate-200 ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
 {[
 { icon: <ShoppingBag />, label: t('stats_plants'), sub: 'In Stock' },
 { icon: <Users />, label: t('stats_users'), sub: 'Happy Customers' },
 { icon: <ShieldCheck />, label: t('stats_quality'), sub: 'Guaranteed' },
 { icon: <Star />, label: t('stats_rating'), sub: 'On Trustpilot' }
 ].map((stat, idx) => (
 <div key={idx} className="text-center space-y-3">
 <div className="inline-flex p-4 bg-slate-50 text-primary-700 rounded-2xl shadow-sm border border-slate-200 ">
 {React.cloneElement(stat.icon, { size: 28 })}
 </div>
 <h4 className="text-xl md:text-2xl font-bold tracking-tight">{stat.label}</h4>
 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.sub}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* TOP PICKS */}
 <section className="py-10 md:py-20 bg-slate-50 ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-6">
 <div>
 <h2 className="text-xl sm:text-3xl md:text-5xl font-serif font-bold mb-2">{t('top_picks')}</h2>
 <p className="text-slate-500 text-sm md:text-lg">{t('curated_selections')}</p>
 </div>
 <Link to="/products" className="inline-flex items-center gap-2 text-primary-700 font-bold text-sm uppercase tracking-widest cursor-pointer">
 {t('view_all')} <ArrowRight size={16} className="rtl:rotate-180" />
 </Link>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
 {loading ? (
 [1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-slate-200 "></div>)
 ) : (
 topPicks.map(product => (
 <ProductCard 
 key={product.id} 
 product={product} 
 onAddToCart={handleAddToCart} 
 />
 ))
 )}
 </div>
 </div>
 </section>

 {/* QUALITY PROMISE */}
 <section className="py-10 md:py-20 bg-white border-y border-slate-200 ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
 <div className="space-y-12">
 <h2 className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold leading-[1.1] rtl:text-right">
 {t('quality_trust').split('.')[0]} <br/> <span className="text-primary-600 italic">{t('quality_trust').split('.')[1] || ''}</span>
 </h2>
 <div className="space-y-8">
 {[
 { title: t('ethically_sourced'), desc: t('ethically_sourced_desc'), icon: <Heart className="text-primary-600" /> },
 { title: t('health_guaranteed'), desc: t('health_guaranteed_desc'), icon: <Sprout className="text-primary-600" /> },
 { title: t('fresh_delivery'), desc: t('fresh_delivery_desc'), icon: <Truck className="text-primary-600" /> }
 ].map((item, idx) => (
 <div key={idx} className="flex gap-6 rtl:flex-row-reverse">
 <div className="flex-shrink-0 w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
 {React.cloneElement(item.icon, { size: 24 })}
 </div>
 <div className="rtl:text-right">
 <h4 className="text-xl font-bold mb-1">{item.title}</h4>
 <p className="text-slate-500 leading-relaxed">{item.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
          <div className="grid grid-cols-2 gap-3 md:gap-6">
            <div className="space-y-4 mt-8 md:mt-12">
              <div className="group rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
                <img 
                  src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&q=80&w=500" 
                  className="h-48 md:h-72 lg:h-96 w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
                  alt="Plant Quality" 
                  onError={handleImgError}
                />
              </div>
              <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-100 ">
                <Star className="text-yellow-400 mb-3" fill="currentColor" size={24} />
                <p className="text-sm italic font-serif text-slate-600 ">"Exceptional quality. My home feels alive!"</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-emerald-600 text-white rounded-3xl p-8 shadow-2xl shadow-emerald-200/50 transform transition hover:-translate-y-2 hover:shadow-emerald-300/50 duration-300">
                <TrendingUp size={28} className="mb-3 opacity-60" />
                <p className="text-3xl md:text-5xl font-bold mb-1">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Organic Growth</p>
              </div>
              <div className="group rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
                <img 
                  src="https://res.cloudinary.com/dvbpoxaae/image/upload/v1777811751/ChatGPT_Image_May_3_2026_03_33_32_PM_rtpr8s.png" 
                  className="h-48 md:h-72 lg:h-96 w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110" 
                  alt="Plant aesthetic" 
                  onError={handleImgError}
                />
              </div>
            </div>
          </div>
 </div>
 </div>
 </section>

 {/* CTA CARDS */}
 <section className="py-10 md:py-20 bg-slate-50 ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Bouquet Builder Card */}
            <div className="relative rounded-[2.5rem] overflow-hidden group h-[400px] shadow-xl shadow-slate-200/50 bg-gradient-to-br from-stone-100 to-stone-200 border border-stone-300 transition-transform duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-64 h-64 bg-stone-300/20 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
              <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-stone-600 shadow-sm border border-stone-100 mb-6">
                  <Heart size={32} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-4xl font-serif font-bold text-slate-800 mb-4">{t('bouquet_builder_title')}</h3>
                  <p className="text-slate-600 text-sm md:text-base mb-8 max-w-sm leading-relaxed">{t('bouquet_builder_desc')}</p>
                  <Link to="/bouquets" className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95">
                    {t('start_designing')}
                  </Link>
                </div>
              </div>
            </div>

            {/* AI Doctor Card */}
            <div className="relative rounded-[2.5rem] overflow-hidden group h-[400px] shadow-xl shadow-emerald-100/50 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 transition-transform duration-500 hover:-translate-y-1">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full -mr-20 -mb-20 blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
              <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 mb-6">
                  <Sprout size={32} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-4xl font-serif font-bold text-emerald-900 mb-4">{t('ai_doctor')}</h3>
                  <p className="text-emerald-700/80 text-sm md:text-base mb-8 max-w-sm leading-relaxed">{t('ai_doctor_desc')}</p>
                  <Link to="/ai-doctor" className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95">
                    {t('consult_now')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
 </div>
 </section>
 </div>
 );
};

export default Home;
