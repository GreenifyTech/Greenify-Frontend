import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Filter, Loader2,
  Leaf, ChevronDown, Plus, X,
  Check, ArrowRight, ShoppingCart
} from 'lucide-react';
import { productApi } from '../api/productApi';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import toast from 'react-hot-toast';
import ProductCard from '../components/products/ProductCard';

const Products = () => {
  const { t } = useLang();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchInitialData();
    fetchProducts();
  }, []);

  const fetchInitialData = async () => {
    try {
      const cats = await productApi.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productApi.getAllProducts();
      setProducts(data.items || data);
      setError(null);
    } catch (err) {
      setError("Failed to load products. Please check your connection.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      const msg = err?.response?.data?.detail || 'Failed to add to cart. Please try again.';
      toast.error(msg);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortOption('newest');
    setMinPrice('');
    setMaxPrice('');
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(product => 
        product.category_id === selectedCategory || 
        product.category?.id === selectedCategory ||
        product.category?.name === selectedCategory
      );
    }

    // 3. Price Filter
    if (minPrice) {
      result = result.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(product => product.price <= parseFloat(maxPrice));
    }

    // 4. Sorting Engine
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => b.id - a.id); 
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortOption, minPrice, maxPrice]);

  return (
    <div className="w-full bg-slate-50 text-slate-900 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 flex flex-col md:flex-row gap-4 md:gap-8">

        {/* SIDEBAR FILTERS */}
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <Filter size={18} className="text-emerald-600" /> {t('filters')}
              </h2>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:opacity-70 transition-opacity cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50 rounded-xl focus:border-emerald-500 outline-none transition-colors text-sm text-slate-900"
                  />
                  <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Categories</label>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                      selectedCategory === 'All'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                        : 'bg-slate-50 text-slate-600 hover:bg-emerald-50'
                    }`}
                  >
                    All {selectedCategory === 'All' && <Check size={14} />}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                        selectedCategory === cat.name
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                          : 'bg-slate-50 text-slate-600 hover:bg-emerald-50'
                      }`}
                    >
                      {cat.name} {selectedCategory === cat.name && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sort By</label>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-slate-200 bg-slate-50 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none appearance-none cursor-pointer text-slate-900"
                  >
                    <option value="newest">New Arrivals</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name-asc">Name: A → Z</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Price (LE)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-sm focus:border-emerald-500 outline-none font-bold text-slate-900"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-sm focus:border-emerald-500 outline-none font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <main className="flex-grow">
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold mb-1 text-slate-900">Our Collection</h1>
            <p className="text-slate-500 text-[10px] md:text-sm font-medium">Showing {filteredAndSortedProducts.length} botanical treasures</p>
          </div>

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-[420px] animate-pulse border border-slate-100 shadow-sm"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 p-8 rounded-2xl text-center border border-red-200">
              <p className="text-red-600 font-bold mb-3">{error}</p>
              <button onClick={fetchProducts} className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors cursor-pointer">
                Try Again
              </button>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="bg-white p-8 md:p-16 rounded-3xl text-center border border-slate-100 shadow-sm animate-fade-in-up">
              <Leaf size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-slate-900">No botanical treasures found</h3>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm font-medium">Try adjusting your filters or search criteria.</p>
              <button
                onClick={handleReset}
                className="bg-emerald-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 cursor-pointer active:scale-95"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart} 
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
