import React, { useState, useEffect, useContext } from 'react';
import { 
  User, Phone, MapPin, Mail, Camera, Save, 
  Loader2, ShieldCheck, Globe, ShoppingBag, 
  Flower2, ChevronRight, LogOut, Package,
  Settings, Clock, CreditCard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { profileApi } from '../api/profileApi';
import { orderApi } from '../api/orderApi';
import { bouquetApi } from '../api/bouquetApi';
import { AuthContext } from '../context/AuthContext';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import { EGYPT_GOVERNORATES } from '../constants/egypt';
import { formatPrice } from '../utils/formatCurrency';

const Profile = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal'); 
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialProfileState = {
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    date_of_birth: '',
    gender: '',
    profile_image: ''
  };

  const [profile, setProfile] = useState(initialProfileState);
  const [orders, setOrders] = useState([]);
  const [bouquets, setBouquets] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.getMe();
        // Handle potential nulls from backend
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          postal_code: data.postal_code || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          profile_image: data.profile_image || ''
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Could not load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'bouquets') {
      fetchBouquets();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingData(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data.items || []);
    } catch (error) {
      console.error("Failed to load orders", error);
      toast.error("Failed to load orders");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchBouquets = async () => {
    setLoadingData(true);
    try {
      const data = await bouquetApi.getMyBouquets();
      setBouquets(data || []);
    } catch (error) {
      console.error("Failed to load bouquets", error);
      toast.error("Failed to load bouquets");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading avatar...");
    try {
      const secureUrl = await uploadImageToCloudinary(file);
      setProfile({ ...profile, profile_image: secureUrl });
      // Update immediately if possible or wait for save
      toast.success("Avatar uploaded! Save changes to apply.", { id: toastId });
    } catch (error) {
      toast.error("Avatar upload failed", { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        full_name: profile.full_name?.trim() || null,
        phone: profile.phone?.trim() || null,
        address: profile.address?.trim() || null,
        city: profile.city?.trim() || null,
        postal_code: profile.postal_code?.trim() || null,
        date_of_birth: profile.date_of_birth || null,
        gender: profile.gender || null,
        profile_image: profile.profile_image || null
      };

      const updated = await profileApi.updateMe(payload);
      setUser({ ...user, ...updated });
      setProfile({ ...profile, ...updated });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("UPDATE ERROR DETAILS:", error.response?.data || error.message);
      toast.error(error.response?.data?.detail || "Update failed. Please check your data.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-20 transition-colors duration-300">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Botanical identity loading...</p>
      </div>
    );
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'U';

  const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'orders', label: 'Order History', icon: <Clock size={18} /> },
    { id: 'bouquets', label: 'My Bouquets', icon: <Flower2 size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 pb-20 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP HEADER CARD */}
        <div className="bg-white shadow-sm rounded-3xl p-6 md:p-8 mb-8 border border-slate-200 flex flex-col md:flex-row items-center gap-6 md:gap-8 mt-10">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-slate-50 flex items-center justify-center text-emerald-600 text-3xl md:text-4xl font-bold border-4 border-white shadow-xl">
              {profile.profile_image ? (
                <img src={profile.profile_image} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-1 right-1 p-2 bg-emerald-600 text-white rounded-xl cursor-pointer hover:bg-emerald-700 transition-all shadow-lg hover:scale-110 active:scale-95">
                <Camera size={18} />
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            )}
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{profile.full_name || 'Anonymous Plant Lover'}</h1>
            <p className="text-slate-500 font-medium mb-4">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-200 ">
                Customer
              </span>
              {user?.is_admin && (
                <span className="px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-200 ">
                  Admin
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-700 transition-all cursor-pointer shadow-lg shadow-emerald-900/20"
              >
                <Settings size={18} /> Edit Profile
              </button>
            )}
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-red-100 transition-all cursor-pointer border border-red-100 "
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* SIDEBAR */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 ">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all mb-1 cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100 '
                      : 'text-slate-500 hover:bg-slate-50 '
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-slate-200 min-h-[500px]">
              
              {activeTab === 'personal' && (
                <div className="space-y-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Personal Information</h2>
                      <p className="text-slate-500 text-sm font-medium">Update your identity and shipping preferences.</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* FULL NAME */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Full Name</label>
                        <div className="relative">
                          {isEditing ? (
                            <input
                              type="text"
                              name="full_name"
                              value={profile.full_name}
                              onChange={handleChange}
                              className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                              placeholder="Enter your name"
                              required
                            />
                          ) : (
                            <p className="w-full pl-14 pr-4 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-slate-900 font-bold">{profile.full_name || 'Not specified'}</p>
                          )}
                          <User size={20} className="absolute left-5 top-4.5 text-emerald-600 " />
                        </div>
                      </div>

                      {/* PHONE NUMBER */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Phone Number</label>
                        <div className="relative">
                          {isEditing ? (
                            <input
                              type="text"
                              name="phone"
                              value={profile.phone}
                              onChange={handleChange}
                              className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                              placeholder="+20 1..."
                            />
                          ) : (
                            <p className="w-full pl-14 pr-4 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-slate-900 font-bold">{profile.phone || 'Not specified'}</p>
                          )}
                          <Phone size={20} className="absolute left-5 top-4.5 text-emerald-600 " />
                        </div>
                      </div>

                      {/* EMAIL (Read-only) */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Email (Read-only)</label>
                        <div className="relative">
                          <p className="w-full pl-14 pr-4 py-4 bg-slate-100 border-2 border-transparent rounded-2xl text-slate-400 font-bold">{user?.email}</p>
                          <Mail size={20} className="absolute left-5 top-4.5 text-slate-400 " />
                        </div>
                      </div>

                      {/* DATE OF BIRTH */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Date of Birth</label>
                        <div className="relative">
                          {isEditing ? (
                            <input
                              type="date"
                              name="date_of_birth"
                              value={profile.date_of_birth}
                              onChange={handleChange}
                              className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all cursor-pointer text-slate-900 font-bold"
                            />
                          ) : (
                            <p className="w-full pl-14 pr-4 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-slate-900 font-bold">{profile.date_of_birth || 'Not specified'}</p>
                          )}
                          <Clock size={20} className="absolute left-5 top-4.5 text-emerald-600 " />
                        </div>
                      </div>

                      {/* GENDER */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Gender</label>
                        <div className="relative">
                          {isEditing ? (
                            <select
                              name="gender"
                              value={profile.gender}
                              onChange={handleChange}
                              className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer text-slate-900 font-bold"
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          ) : (
                            <p className="w-full pl-14 pr-4 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-slate-900 font-bold capitalize">{profile.gender || 'Not specified'}</p>
                          )}
                          <User size={20} className="absolute left-5 top-4.5 text-emerald-600 " />
                        </div>
                      </div>

                      {/* ADDRESS */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Shipping Address</label>
                        <div className="relative">
                          {isEditing ? (
                            <input
                              type="text"
                              name="address"
                              value={profile.address}
                              onChange={handleChange}
                              className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                              placeholder="Street name, building number"
                            />
                          ) : (
                            <p className="w-full pl-14 pr-4 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-slate-900 font-bold">{profile.address || 'Not specified'}</p>
                          )}
                          <MapPin size={20} className="absolute left-5 top-4.5 text-emerald-600 " />
                        </div>
                      </div>

                      {/* CITY */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">City</label>
                        <div className="relative">
                          {isEditing ? (
                            <input
                              type="text"
                              name="city"
                              value={profile.city}
                              onChange={handleChange}
                              className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                              placeholder="e.g. Cairo"
                            />
                          ) : (
                            <p className="w-full pl-14 pr-4 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-slate-900 font-bold">{profile.city || 'Not specified'}</p>
                          )}
                          <Globe size={20} className="absolute left-5 top-4.5 text-emerald-600 " />
                        </div>
                      </div>

                      {/* POSTAL CODE */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Postal Code</label>
                        <div className="relative">
                          {isEditing ? (
                            <input
                              type="text"
                              name="postal_code"
                              value={profile.postal_code}
                              onChange={handleChange}
                              className="w-full pl-14 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-all text-slate-900 font-bold"
                              placeholder="12345"
                            />
                          ) : (
                            <p className="w-full pl-14 pr-4 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-slate-900 font-bold">{profile.postal_code || 'Not specified'}</p>
                          )}
                          <CreditCard size={20} className="absolute left-5 top-4.5 text-emerald-600 " />
                        </div>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-8 flex justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-10 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="bg-emerald-700 text-white px-12 py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all flex items-center gap-3 shadow-lg shadow-emerald-900/10 active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {isSaving ? <Loader2 size={24} className="animate-spin" /> : <><Save size={24} /> Save Changes</>}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Order History</h2>
                    <p className="text-slate-500 text-sm font-medium">Track and manage your botanical acquisitions.</p>
                  </div>
                  
                  {loadingData ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 size={32} className="animate-spin text-emerald-600 mb-4" />
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Fetching orders...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Link 
                          to={`/orders/${order.id}`} 
                          key={order.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:border-emerald-400 transition-all group shadow-sm"
                        >
                          <div className="flex items-center gap-5 mb-4 sm:mb-0">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 ">
                              <Package size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 ">Order #{order.id}</p>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                            <div className="text-right">
                              <p className="font-serif font-bold text-slate-900 text-lg">{formatPrice(order.total_amount)}</p>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                order.status === 'delivered' ? 'text-emerald-500' : 
                                order.status === 'cancelled' ? 'text-red-500' : 'text-amber-500'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <ChevronRight size={20} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="bg-slate-50 p-8 rounded-full mb-6 border border-slate-100 ">
                        <ShoppingBag size={48} className="text-slate-300 " />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h3>
                      <p className="text-slate-500 max-w-xs mb-8 font-medium">You haven't placed any orders yet. Start your collection today!</p>
                      <Link to="/products" className="bg-emerald-700 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 active:scale-95">
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bouquets' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">My Custom Bouquets</h2>
                    <p className="text-slate-500 text-sm font-medium">Your unique botanical creations.</p>
                  </div>
                  
                  {loadingData ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 size={32} className="animate-spin text-emerald-600 mb-4" />
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Fetching bouquets...</p>
                    </div>
                  ) : bouquets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {bouquets.map((bouquet) => (
                        <div key={bouquet.id} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group shadow-sm">
                          <div className="w-full aspect-square bg-white rounded-2xl flex items-center justify-center mb-6 text-emerald-200 overflow-hidden relative border border-slate-100 ">
                            <Flower2 size={64} className="group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold uppercase tracking-widest">View Design</span>
                            </div>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 mb-2">Bouquet #{bouquet.id}</h4>
                          <div className="flex justify-between items-center pt-4 border-t border-slate-100 ">
                            <p className="text-xl font-serif font-bold text-emerald-600 ">{formatPrice(bouquet.total_price)}</p>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bouquet.items?.length || 0} Flowers</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="bg-slate-50 p-8 rounded-full mb-6 border border-slate-100 ">
                        <Flower2 size={48} className="text-slate-300 " />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">No bouquets yet</h3>
                      <p className="text-slate-500 max-w-xs mb-8 font-medium">You haven't built any custom bouquets yet. Release your inner florist!</p>
                      <Link to="/bouquets" className="bg-emerald-700 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 active:scale-95">
                        Build a Bouquet
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
