import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, ArrowLeft, Star, ShieldCheck, 
  Truck, RefreshCcw, Leaf, Loader2, Plus, Minus
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { formatPrice } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [viewers, setViewers] = useState(1);

  useEffect(() => {
    const fetchViewers = async () => {
      try {
        const data = await productApi.getLiveViewers(id);
        setViewers(data.live_viewers || 1);
      } catch (error) {
        console.error("Failed to fetch live viewers", error);
      }
    };

    fetchViewers();
    const interval = setInterval(fetchViewers, 15000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Product not found or connection error.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart.', { icon: '🔒' });
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await addItem(Number(id), quantity);
      toast.success(`${product.name} added to cart!`, { icon: '🌿' });
    } catch (err) {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center transition-colors duration-300">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{t('botanical_data_loading')}</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-red-50 p-12 rounded-[2.5rem] text-center border border-red-100 max-w-md w-full">
          <Leaf size={48} className="mx-auto text-red-400 mb-6" />
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">{t('oops')}</h2>
          <p className="text-slate-600 mb-8">{error || t('product_not_found')}</p>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-950/20"
          >
            <ArrowLeft size={18} className="rtl:rotate-180" /> {t('back_to_catalog')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 transition-colors duration-300 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <Link to="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-bold text-xs uppercase tracking-widest mb-10 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform rtl:rotate-180" /> {t('back_to_collection')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="aspect-[4/5] md:aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm relative group">
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1000'} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 rtl:left-auto rtl:right-6">
                <span className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl border border-white ">
                  {t(product.category?.name?.toUpperCase()) || product.category?.name || 'Species'}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-slate-400 ml-2 rtl:ml-0 rtl:mr-2 uppercase tracking-widest">{t('reviews', { count: 120 })}</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 md:mb-4 tracking-tight">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                {product.discount_price && Number(product.discount_price) < Number(product.price) ? (
                  <>
                    <span className="text-3xl md:text-5xl font-serif font-bold text-red-600 ">
                      {formatPrice(product.discount_price)}
                    </span>
                    <span className="text-xl md:text-2xl line-through text-slate-400 font-bold mt-2">
                      {formatPrice(product.price)}
                    </span>
                    <span className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg shadow-red-500/20 uppercase tracking-widest ml-2 rtl:ml-0 rtl:mr-2">
                      -{Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)}% {t('off')}
                    </span>
                  </>
                ) : (
                  <p className="text-3xl md:text-5xl font-serif font-bold text-emerald-700 ">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
              <p className="text-slate-600 text-lg leading-relaxed font-medium mb-8">
                {product.description || "A beautiful botanical specimen, carefully cultivated to bring nature's tranquility into your living space."}
              </p>
            </div>

            {/* Live Viewers FOMO */}
            <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-slate-50 rounded-2xl w-fit border border-slate-100 transition-all hover:border-red-100 ">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-sm text-slate-600 font-bold" dir="auto">
                {t('viewing_now', { count: viewers })}
              </span>
            </div>

            {/* Inventory & Quantity */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-10">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 rtl:ml-0 rtl:mr-1">{t('selection_quantity')}</p>
                  <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 w-fit">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={product.stock === 0}
                      className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors text-slate-600 cursor-pointer disabled:opacity-20"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-right rtl:text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('availability')}</p>
                  <div className="text-xs font-bold uppercase tracking-widest">
                    {product.stock > 5 ? (
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                        {t('in_stock', { count: product.stock })}
                      </span>
                    ) : product.stock > 0 ? (
                      <span className="px-4 py-2 bg-orange-50 text-orange-700 border border-orange-100 rounded-full animate-pulse">
                        {t('low_stock', { count: product.stock })}
                      </span>
                    ) : (
                      <span className="px-4 py-2 bg-red-50 text-red-700 border border-red-100 rounded-full">
                        {t('out_of_stock')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock <= 0}
                className="flex-1 flex items-center justify-center gap-3 bg-emerald-700 hover:bg-emerald-800 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-950/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                {addingToCart ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                    <span>{t('add_to_botanical_cart')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-slate-100 ">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 ">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">{t('eco_shipping')}</p>
                  <p className="text-xs text-slate-500 font-medium">{t('eco_shipping_desc')}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 ">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold mb-1">{t('botanical_warranty')}</p>
                  <p className="text-xs text-slate-500 font-medium">{t('botanical_warranty_desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
