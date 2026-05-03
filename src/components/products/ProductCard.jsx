import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { formatPrice } from '../../utils/formatCurrency';

const ProductCard = ({ product, onAddToCart }) => {
  const { t } = useLang();
  const [isAdding, setIsAdding] = useState(false);
  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0 || isAdding) return;

    setIsAdding(true);
    try {
      await onAddToCart(product);
    } catch (error) {
      console.error("Cart addition failed", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col group shadow-sm">
      {/* IMAGE */}
      <Link to={`/products/${product.id}`} className="block relative">
        <div className="aspect-[4/3] overflow-hidden bg-slate-50 relative">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* DISCOUNT BADGE */}
          {hasDiscount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg z-10 shadow-lg shadow-red-500/20 uppercase tracking-widest">
              -{Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)}%
            </div>
          )}
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-md">
            {t(product.category?.name?.toUpperCase()) || product.category?.name || 'Botanical'}
          </span>
          <div className="text-[10px] font-bold uppercase tracking-widest">
            {product.stock > 5 ? (
              <span className="text-emerald-600 ">{t('in_stock', { count: product.stock })}</span>
            ) : product.stock > 0 ? (
              <span className="text-orange-500 animate-pulse">{t('low_stock', { count: product.stock })}</span>
            ) : (
              <span className="text-red-500">{t('out_of_stock')}</span>
            )}
          </div>
        </div>

        <Link to={`/products/${product.id}`}>
          <h3 className="text-xl font-bold mb-4 text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-serif font-bold text-red-600 ">
                  {formatPrice(product.discount_price)}
                </span>
                <span className="text-xs line-through text-slate-400 font-bold">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <p className="text-2xl font-serif font-bold text-slate-900 ">
                {formatPrice(product.price)}
              </p>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAdding}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 ${
              product.stock === 0
                ? 'opacity-50 cursor-not-allowed bg-stone-200 text-stone-500'
                : isAdding
                ? 'bg-emerald-500 text-white opacity-90 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg shadow-emerald-200'
            }`}
          >
            {isAdding ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">{t('adding')}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span>{product.stock === 0 ? t('out_of_stock') : t('add')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
