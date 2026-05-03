import React, { useState, useEffect, useContext } from 'react';
import { 
  Sparkles, Flower2, Palette, Hash, MessageSquare, 
  Plus, Minus, ShoppingBag, Trash2, Loader2, ArrowRight,
  Leaf, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bouquetApi } from '../api/bouquetApi';
import { AuthContext } from '../context/AuthContext';
import { formatPrice } from '../utils/formatCurrency';

const FLOWER_TYPES = [
  { id: 'rose', name: 'Rose', price: 5, icon: '🌹' },
  { id: 'lily', name: 'Lily', price: 7, icon: '🌺' },
  { id: 'tulip', name: 'Tulip', price: 4, icon: '🌷' },
  { id: 'sunflower', name: 'Sunflower', price: 6, icon: '🌻' },
  { id: 'orchid', name: 'Orchid', price: 12, icon: '🌸' },
  { id: 'daisy', name: 'Daisy', price: 3, icon: '🌼' },
];

const COLORS = [
  { id: 'red', name: 'Red', hex: '#EF4444', class: 'bg-red-500' },
  { id: 'white', name: 'White', hex: '#FFFFFF', class: 'bg-white border-slate-200' },
  { id: 'pink', name: 'Pink', hex: '#F472B6', class: 'bg-pink-400' },
  { id: 'yellow', name: 'Yellow', hex: '#FACC15', class: 'bg-yellow-400' },
  { id: 'purple', name: 'Purple', hex: '#A855F7', class: 'bg-purple-500' },
  { id: 'blue', name: 'Blue', hex: '#3B82F6', class: 'bg-blue-500' },
];

const BASE_STEMS_URL = "https://images.unsplash.com/photo-1599148482840-d7d8e8282c7c?auto=format&fit=crop&q=80&w=600";

// Mapping of Species Names to Photorealistic PNG Assets (Simulated Cloudinary/High-Res Links)
const REALISTIC_ASSETS = {
  'Rose': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
  'Lily': 'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?auto=format&fit=crop&q=80&w=400',
  'Tulip': 'https://images.unsplash.com/photo-1520323232427-6b6230f3ef51?auto=format&fit=crop&q=80&w=400',
  'Sunflower': 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&q=80&w=400',
  'Orchid': 'https://images.unsplash.com/photo-1534885391148-bcc48c06242e?auto=format&fit=crop&q=80&w=400',
  'Daisy': 'https://images.unsplash.com/photo-1464973347741-26743b71593c?auto=format&fit=crop&q=80&w=400',
};

const LiveBouquetSimulation = ({ selectedFlowers, selectedColors }) => {
  const getFlowerColor = (index) => {
    if (selectedColors.length === 0) return '#FFFFFF'; 
    return COLORS.find(c => c.id === selectedColors[index % selectedColors.length])?.hex || '#FFFFFF';
  };

  const positions = [
    { bottom: '40%', left: '30%', rotate: -25, scale: 0.9 },
    { bottom: '45%', left: '50%', rotate: 0, scale: 1.1 },
    { bottom: '40%', left: '70%', rotate: 25, scale: 0.9 },
    { bottom: '55%', left: '40%', rotate: -15, scale: 0.8 },
    { bottom: '55%', left: '60%', rotate: 15, scale: 0.8 },
    { bottom: '30%', left: '50%', rotate: 10, scale: 1 },
  ];

  return (
    <div className="bg-slate-50 border border-slate-100 shadow-inner rounded-3xl h-80 w-full relative overflow-hidden flex items-center justify-center mb-8 group transition-all duration-500 hover:shadow-lg">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-50/50 to-transparent opacity-60"></div>
      
      <div className="relative w-full h-full flex items-end justify-center pb-6 z-10">
        {selectedFlowers.length === 0 ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border border-emerald-50 mb-4 text-emerald-400">
              <Leaf size={40} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Begin your floral masterpiece...</span>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-end justify-center overflow-hidden rounded-b-3xl">
              <img 
                src={BASE_STEMS_URL} 
                className="w-full h-full object-cover opacity-80 mix-blend-multiply" 
                alt="Bouquet Base" 
              />
            </div>

            {selectedFlowers.map((flower, idx) => {
              const basePos = positions[idx % positions.length];
              const color = getFlowerColor(idx);
              const rotationVar = (idx * 13) % 20 - 10; 
              const scaleVar = ((idx * 7) % 5) / 20; 
              const finalRotate = basePos.rotate + rotationVar;
              const finalScale = basePos.scale + scaleVar;
              const realisticUrl = REALISTIC_ASSETS[flower.name];

              return (
                <div 
                  key={`${flower.id}-${idx}`}
                  className="absolute transition-all duration-700 ease-out animate-pop-in"
                  style={{ 
                    bottom: basePos.bottom, 
                    left: basePos.left, 
                    transform: `translate(-50%, 0) rotate(${finalRotate}deg) scale(${finalScale})`,
                  }}
                >
                  <div className="relative group/flower">
                    <img 
                      src={realisticUrl} 
                      className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl rounded-full"
                      style={{ 
                        filter: color === '#FFFFFF' ? 'none' : 'grayscale(1) brightness(0.8)',
                      }}
                      alt={flower.name}
                    />
                    {color !== '#FFFFFF' && (
                      <div 
                        className="absolute inset-0 rounded-full mix-blend-color opacity-90 transition-all duration-700"
                        style={{ backgroundColor: color }}
                      ></div>
                    )}
                    <div className="absolute top-0 right-0 animate-bounce delay-150">
                      <Sparkles size={16} className="text-white/40" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 pointer-events-none border border-white/40 rounded-3xl m-2"></div>
    </div>
  );
};

const BouquetBuilder = () => {
  const { user } = useContext(AuthContext);
  const [selectedFlowers, setSelectedFlowers] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [savedBouquets, setSavedBouquets] = useState([]);
  const [isLoadingBouquets, setIsLoadingBouquets] = useState(true);

  useEffect(() => {
    fetchSavedBouquets();
  }, []);

  const fetchSavedBouquets = async () => {
    try {
      const data = await bouquetApi.getMyBouquets();
      setSavedBouquets(data);
    } catch (error) {
      console.error("Failed to fetch bouquets", error);
    } finally {
      setIsLoadingBouquets(false);
    }
  };

  const toggleFlower = (flower) => {
    if (selectedFlowers.find(f => f.id === flower.id)) {
      setSelectedFlowers(selectedFlowers.filter(f => f.id !== flower.id));
    } else if (selectedFlowers.length < 6) {
      setSelectedFlowers([...selectedFlowers, flower]);
    } else {
      toast.error("Maximum 6 flower types per bouquet.");
    }
  };

  const toggleColor = (colorId) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter(c => c !== colorId));
    } else if (selectedColors.length < 3) {
      setSelectedColors([...selectedColors, colorId]);
    } else {
      toast.error("Limit: 3 colors per palette.");
    }
  };

  const calculateEstimate = () => {
    const basePrice = selectedFlowers.reduce((sum, f) => sum + f.price, 0);
    return basePrice * quantity;
  };

  const handleSubmit = async () => {
    if (selectedFlowers.length === 0) {
      toast.error("Please select at least one flower type");
      return;
    }
    if (selectedColors.length === 0) {
      toast.error("Please select at least one color");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: `Botanical Creation (${selectedFlowers.map(f => f.name).join(', ')})`,
        flower_types: selectedFlowers.map(f => f.name),
        colors: selectedColors,
        total_quantity: quantity,
        notes: notes,
        shipping_address: user?.address || 'Default Address',
        phone: user?.phone || '0000000000',
        payment_method: 'cash_on_delivery'
      };
      
      await bouquetApi.createBouquet(payload);
      toast.success("Bouquet saved successfully!", { icon: '🌿' });
      setSelectedFlowers([]);
      setSelectedColors([]);
      setQuantity(1);
      setNotes('');
      fetchSavedBouquets();
    } catch (error) {
      console.error("Failed to save bouquet", error);
      toast.error("Failed to save bouquet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await bouquetApi.deleteBouquet(id);
      toast.success("Bouquet removed", { icon: '🗑️' });
      fetchSavedBouquets();
    } catch (error) {
      toast.error("Failed to delete bouquet");
    }
  };

  const estimate = calculateEstimate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 w-full flex-grow bg-slate-50 text-slate-900 transition-all duration-300 antialiased">
      <div className="mb-12 md:mb-16 text-center lg:text-left">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-4 mb-3">
          <Sparkles className="text-emerald-600 animate-pulse" size={40} /> Bouquet Builder
        </h1>
        <p className="text-slate-500 text-sm md:text-lg font-medium max-w-2xl">Design your perfect arrangement. Use icons to select your species and watch them come to life realistically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 items-start">
        {/* LEFT COLUMN: BUILDER FORM */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12">
          {/* Flower Selection - Step 1: Icon Grid */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-900/20">1</span>
                <h3 className="text-2xl font-serif font-bold text-slate-900">Select Species</h3>
              </div>
              <Info size={20} className="text-slate-300 hover:text-emerald-500 transition-colors cursor-help" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
              {FLOWER_TYPES.map((flower) => {
                const isSelected = selectedFlowers.find(f => f.id === flower.id);
                return (
                  <button
                    key={flower.id}
                    onClick={() => toggleFlower(flower)}
                    className={`p-6 md:p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 cursor-pointer relative ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-xl shadow-emerald-900/10 ring-2 ring-emerald-500/20 scale-[1.02]' 
                        : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-emerald-200 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <span className="text-5xl md:text-6xl mb-2 drop-shadow-sm group-active:scale-90 transition-transform">
                      {flower.icon}
                    </span>
                    <span className="font-black text-xs uppercase tracking-[0.2em]">{flower.name}</span>
                    <span className="text-[10px] font-black opacity-40">{formatPrice(flower.price)} / stem</span>
                    
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-emerald-600 text-white rounded-full p-1.5 shadow-md">
                        <Plus size={12} className="rotate-45" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Color Selection - Step 2 */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-900/20">2</span>
              <h3 className="text-2xl font-serif font-bold text-slate-900">Color Palette</h3>
            </div>
            <div className="flex flex-wrap gap-6 md:gap-10 justify-center md:justify-start">
              {COLORS.map((color) => {
                const isSelected = selectedColors.includes(color.id);
                return (
                  <button
                    key={color.id}
                    onClick={() => toggleColor(color.id)}
                    className={`group relative flex flex-col items-center gap-4 cursor-pointer`}
                  >
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-[6px] border-white shadow-xl transition-all ${color.class} ${
                      isSelected 
                        ? 'ring-4 ring-emerald-500 ring-offset-4 scale-110' 
                        : 'scale-100 hover:scale-110'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <CheckIcon colorId={color.id} />
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors ${isSelected ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Quantity & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-900/20">3</span>
                <h3 className="text-2xl font-serif font-bold text-slate-900">Stem Count</h3>
              </div>
              <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-3xl p-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl text-slate-400 hover:text-emerald-600 shadow-sm transition-all active:scale-90 cursor-pointer"
                >
                  <Minus size={24} />
                </button>
                <span className="text-4xl md:text-5xl font-serif font-bold text-slate-900 px-6">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(Math.min(30, quantity + 1))}
                  className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl text-slate-400 hover:text-emerald-600 shadow-sm transition-all active:scale-90 cursor-pointer"
                >
                  <Plus size={24} />
                </button>
              </div>
            </section>
           
            <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-900/20">4</span>
                <h3 className="text-2xl font-serif font-bold text-slate-900">Notes</h3>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special requests..."
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:border-emerald-500 focus:bg-white outline-none transition-all h-32 resize-none text-sm font-medium text-slate-700"
              />
            </section>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY SUMMARY CARD WITH REALISTIC PREVIEW */}
        <aside className="lg:sticky lg:top-24">
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-emerald-900/10 border border-slate-100 relative overflow-hidden flex flex-col">
            <LiveBouquetSimulation selectedFlowers={selectedFlowers} selectedColors={selectedColors} />
            
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-10">Your Creation</h2>
            
            <div className="space-y-10 mb-12">
              <div className="relative">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Composition</h4>
                {selectedFlowers.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {selectedFlowers.map(f => (
                      <span key={f.id} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50/80 px-4 py-2.5 rounded-2xl border border-emerald-100/50">
                        {f.icon} {quantity}x {f.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-slate-400 font-medium ml-1">Select your species above.</p>
                )}
              </div>
             
              <div>
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Palette</h4>
                {selectedColors.length > 0 ? (
                  <div className="flex gap-4">
                    {selectedColors.map(c => (
                      <div 
                        key={c} 
                        className={`w-10 h-10 rounded-2xl border-4 border-white shadow-lg ${COLORS.find(col => col.id === c)?.class}`} 
                        title={c}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-slate-400 font-medium ml-1">Choose colors above.</p>
                )}
              </div>
             
              <div className="pt-8 border-t border-slate-50 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Estimate</p>
                  <span className="text-4xl md:text-5xl font-serif font-bold text-emerald-600">{formatPrice(estimate)}</span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-1">
                   <ShoppingBag size={24} />
                </div>
              </div>
            </div>
           
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || selectedFlowers.length === 0}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-bold text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-4 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer group"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <span>Order Masterpiece</span>
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50/30 rounded-full blur-3xl -z-10"></div>
          </div>
        </aside>
      </div>

      {/* SAVED BOUQUETS GRID */}
      <section className="mt-20 md:mt-32">
        <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-6">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-slate-900">Floral Archive</h2>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-full">
            {savedBouquets.length} Saved
          </span>
        </div>
        
        {isLoadingBouquets ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
          </div>
        ) : savedBouquets.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
              <Flower2 size={40} />
            </div>
            <p className="text-slate-400 italic text-sm font-bold uppercase tracking-widest">No saved creations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {savedBouquets.map((bouquet) => (
              <div key={bouquet.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100/50 ">
                    <Flower2 size={28} />
                  </div>
                  <button 
                    onClick={() => handleDelete(bouquet.id)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer active:scale-90"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 className="font-serif font-bold text-slate-900 mb-4 truncate text-xl" title={bouquet.name}>{bouquet.name}</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Stem Count</span>
                    <span className="font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">{bouquet.total_quantity}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Valuation</span>
                    <span className="font-serif font-bold text-emerald-600 text-lg">{formatPrice(bouquet.estimated_price)}</span>
                  </div>
                </div>
                
                <Link 
                  to="/cart" 
                  className="w-full py-4 rounded-2xl bg-emerald-600 text-white text-sm font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
                >
                  Place Order <ArrowRight size={18} />
                </Link>
                
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-50/30 rounded-full blur-2xl group-hover:bg-emerald-100/40 transition-all"></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const CheckIcon = ({ colorId }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colorId === 'white' ? '#64748b' : 'white'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default BouquetBuilder;
