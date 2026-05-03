import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Plus, Loader2, Save, Trash2, 
  Tag, Search, AlertCircle, Edit2, X
} from 'lucide-react';
import { productApi } from '../../api/productApi';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name,
        description: editingCategory.description || ''
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [editingCategory]);

  const fetchCategories = async () => {
    try {
      const data = await productApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Could not load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await productApi.updateCategory(editingCategory.id, formData);
        toast.success("Category updated!");
      } else {
        await productApi.createCategory(formData);
        toast.success("Category created!");
      }
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category", error);
      toast.error(error.response?.data?.detail || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && categories.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-16 md:py-32 bg-white">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Indexing taxonomies...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-grow bg-white transition-colors duration-300">
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-2">Category Taxonomy</h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium">Define and organize the botanical hierarchy.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <input 
            type="text"
            placeholder="Filter categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 pr-6 py-2.5 md:py-3.5 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-emerald-400 transition-all w-full text-sm font-bold text-slate-900"
          />
          <Search size={20} className="absolute left-5 top-4 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
        {/* CATEGORY FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm sticky top-32 transition-all">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              {editingCategory ? (
                <>
                  <Edit2 size={20} className="text-emerald-600" /> Edit Category
                </>
              ) : (
                <>
                  <Plus size={20} className="text-emerald-600" /> New Category
                </>
              )}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tropical Plants"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-400 outline-none transition-all font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this group..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-400 outline-none transition-all font-medium h-32 resize-none text-slate-900"
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : editingCategory ? <><Save size={20} /> Update Category</> : <><Save size={20} /> Create Category</>}
                </button>
                
                {editingCategory && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* CATEGORIES LIST */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCategories.length === 0 ? (
              <div className="col-span-2 py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                <AlertCircle size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No categories found matching your search.</p>
              </div>
            ) : (
              filteredCategories.map((cat) => (
                <div key={cat.id} className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-50">
                      <Tag size={20} />
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {cat.id}</span>
                      <button 
                        onClick={() => setEditingCategory(cat)}
                        className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-sm border border-slate-100"
                        title="Edit Category"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{cat.name}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">
                    {cat.description || 'No description provided for this taxonomy entry.'}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                      <ChevronRight size={14} /> Taxonomy Active
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
