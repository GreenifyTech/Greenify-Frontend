import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, Mail, Phone, MapPin, 
  Loader2, Search, UserCheck, UserX, UserMinus, Shield, ShieldAlert,
  ChevronUp, ChevronDown, X, AlertTriangle
} from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import toast from 'react-hot-toast';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-fade-in-up">
        <div className="p-8 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <div className={`p-3 rounded-2xl ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
              <AlertTriangle size={24} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">{title}</h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg ${
                type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    userId: null,
    newRole: null,
    userName: '',
    title: '',
    message: '',
    confirmText: '',
    type: 'emerald'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Could not load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, currentStatus) => {
    const toastId = toast.loading(`${currentStatus ? 'Deactivating' : 'Activating'} user...`);
    try {
      await adminApi.toggleUserActive(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'}`, { id: toastId });
    } catch (error) {
      toast.error("Operation failed", { id: toastId });
    }
  };

  const handleRoleChange = async () => {
    const { userId, newRole } = modalConfig;
    const toastId = toast.loading(`Updating user role...`);
    
    // Close modal first
    setModalConfig(prev => ({ ...prev, isOpen: false }));

    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { 
        ...u, 
        role: newRole.toLowerCase() === 'admin' ? 'admin' : 'customer',
        is_admin: newRole.toLowerCase() === 'admin'
      } : u));
      toast.success("Access privileges updated successfully.", { id: toastId });
    } catch (error) {
      toast.error("Failed to update role", { id: toastId });
    }
  };

  const openPromotionModal = (user) => {
    setModalConfig({
      isOpen: true,
      userId: user.id,
      newRole: 'ADMIN',
      userName: user.full_name,
      title: 'Confirm Promotion',
      message: `Are you sure you want to grant Administrator privileges to ${user.full_name}? This will allow them to manage products, categories, and orders.`,
      confirmText: 'Confirm Upgrade',
      type: 'emerald'
    });
  };

  const openDemotionModal = (user) => {
    setModalConfig({
      isOpen: true,
      userId: user.id,
      newRole: 'MEMBER',
      userName: user.full_name,
      title: 'Revoke Admin Rights',
      message: `Are you sure you want to revoke Administrator privileges from ${user.full_name}? They will lose access to all administrative modules.`,
      confirmText: 'Confirm Revocation',
      type: 'danger'
    });
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-16 md:py-32 bg-white transition-colors duration-300">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing personnel...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow bg-white transition-colors duration-300 antialiased">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 md:mb-12 px-4 md:px-0">
        <div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-2">User Directory</h1>
          <p className="text-slate-500 text-xs md:text-medium font-medium">Manage access privileges and ecosystem participants.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <input 
            type="text"
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 pr-6 py-3.5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-emerald-400 transition-all w-full text-sm font-bold "
          />
          <Search size={20} className="absolute left-5 top-4 text-slate-400" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all mx-4 md:mx-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 ">
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Entity</th>
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Contact Intel</th>
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Privileges</th>
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Security Status</th>
                <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 ">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-4 md:px-8 md:py-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base md:text-lg border border-emerald-100 flex-shrink-0">
                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-base md:text-lg tracking-tight truncate">{user.full_name || 'Anonymous'}</p>
                        <p className="text-[10px] md:text-xs text-slate-400 font-medium truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-8 md:py-6 text-[10px] md:text-sm font-medium text-slate-600 ">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 whitespace-nowrap"><Phone size={14} className="opacity-50" /> {user.phone || '—'}</div>
                      <div className="flex items-center gap-2 whitespace-nowrap"><MapPin size={14} className="opacity-50" /> {user.address || '—'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-8 md:py-6">
                    <div className="flex items-center gap-3">
                      {user.is_admin ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-100 ">
                          <Shield size={14} />
                          Administrator
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100 ">
                          Member
                        </div>
                      )}
                      
                      {/* Separate Promotion/Demotion Button */}
                      {!user.is_admin ? (
                        <button 
                          onClick={() => openPromotionModal(user)}
                          title="Promote to Admin"
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-slate-200 shadow-sm active:scale-90 cursor-pointer"
                        >
                          <ChevronUp size={18} />
                        </button>
                      ) : (
                        user.id !== 1 && (
                          <button 
                            onClick={() => openDemotionModal(user)}
                            title="Demote to Member"
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-slate-200 shadow-sm active:scale-90 cursor-pointer"
                          >
                            <ChevronDown size={18} />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-8 md:py-6">
                    <span className={`inline-flex items-center gap-2 text-[10px] md:text-xs font-bold ${user.is_active ? 'text-emerald-600 ' : 'text-red-600 '}`}>
                      <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${user.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                      {user.is_active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-4 py-4 md:px-8 md:py-6 text-right whitespace-nowrap">
                    <button 
                      onClick={() => handleToggleActive(user.id, user.is_active)}
                      disabled={user.is_admin && user.id === 1} // Safety lock for root admin
                      className={`inline-flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        user.is_active 
                          ? 'text-red-600 bg-red-50 hover:bg-red-100 ' 
                          : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 '
                      } disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 cursor-pointer shadow-sm`}
                    >
                      {user.is_active ? <UserX size={16} /> : <UserCheck size={16} />}
                      {user.is_active ? 'Revoke Access' : 'Restore Access'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleRoleChange}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
      />
    </div>
  );
};

export default AdminUsers;
