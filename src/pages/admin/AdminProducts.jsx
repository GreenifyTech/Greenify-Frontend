import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Loader2, Image, Search, X } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { productApi } from '../../api/productApi';
import toast from 'react-hot-toast';
import { uploadImageToCloudinary } from '../../utils/cloudinary';

const initialFormState = { 
 name: "", 
 description: "", 
 price: "", 
 stock: "", 
 category_id: "1", 
 is_featured: false, 
 image_url: "",
 product_type: "PLANT",
 discount_price: ""
};

const AdminProducts = () => {
 const [products, setProducts] = useState([]);
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [imageFile, setImageFile] = useState(null);
 const [isUploading, setIsUploading] = useState(false);
 
 const dialogRef = useRef(null);
 const [editingProduct, setEditingProduct] = useState(null);
 const [formData, setFormData] = useState(initialFormState);

 useEffect(() => {
 fetchData();
 }, []);

 const fetchData = async () => {
 try {
 const [prodData, catData] = await Promise.all([
 productApi.getAllProducts(),
 productApi.getCategories()
 ]);
 setProducts(prodData.items || prodData);
 setCategories(catData);
 } catch (error) {
 console.error("Failed to fetch products", error);
 toast.error("Could not load products");
 } finally {
 setLoading(false);
 }
 };

 const openModal = (product = null) => {
 if (product) {
 setEditingProduct(product);
 setFormData({
 name: product.name || "",
 description: product.description || "",
 price: String(product.price || ""),
 stock: String(product.stock || ""),
 category_id: String(product.category_id || "1"),
 image_url: product.image_url || "",
 product_type: product.product_type || "PLANT",
 is_featured: Boolean(product.is_featured)
 });
 } else {
 setEditingProduct(null);
 setFormData(initialFormState);
 }
 setImageFile(null);
 dialogRef.current.showModal();
 };

 const closeModal = () => {
 dialogRef.current.close();
 };

 const handleChange = (e) => {
 const { name, value, type, checked } = e.target;
 setFormData(prev => ({ 
 ...prev, 
 [name]: type === 'checkbox' ? checked : value
 }));
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setIsSubmitting(true);
 
 let currentImageUrl = formData.image_url;

 if (imageFile) {
 setIsUploading(true);
 const toastId = toast.loading("Uploading image to Cloudinary...");
 try {
 currentImageUrl = await uploadImageToCloudinary(imageFile);
 setFormData(prev => ({ ...prev, image_url: currentImageUrl }));
 toast.success("Image uploaded successfully!", { id: toastId });
 } catch (error) {
 toast.error("Image upload failed. Using existing URL if available.", { id: toastId });
 setIsSubmitting(false);
 setIsUploading(false);
 return;
 } finally {
 setIsUploading(false);
 }
 }

 try {
 // Construct the final JSON payload with strict casting (used as source)
 const payload = {
 name: formData.name,
 description: formData.description,
 price: Number(formData.price),
 stock: Number(formData.stock),
 category_id: Number(formData.category_id),
 is_featured: formData.is_featured,
 image_url: currentImageUrl || formData.image_url,
 product_type: formData.product_type
 };

 console.log("🚀 SOURCE PAYLOAD:", payload);

 // Wrap in FormData for multipart/form-data support (Backend Requirement)
 const formDataToSend = new FormData();
 formDataToSend.append('name', payload.name);
 formDataToSend.append('description', payload.description || "");
 formDataToSend.append('price', payload.price);
 formDataToSend.append('stock', payload.stock);
 formDataToSend.append('category_id', payload.category_id);
 formDataToSend.append('is_featured', payload.is_featured ? 'true' : 'false');
 formDataToSend.append('product_type', payload.product_type);
 
 if (payload.image_url) {
 formDataToSend.append('image_url', payload.image_url);
 }

 console.log("🚀 FINAL FORM-DATA SENT TO BACKEND");

 if (editingProduct) {
 await adminApi.updateProduct(editingProduct.id, formDataToSend);
 toast.success("Product updated!");
 } else {
 await adminApi.createProduct(formDataToSend);
 toast.success("Product created!");
 }
 fetchData();
 closeModal();
 } catch (error) {
 console.error("Save failed", error);
 toast.error("Failed to save product");
 } finally {
 setIsSubmitting(false);
 }
 };

 const handleDelete = async (id) => {
 if (!window.confirm("Are you sure you want to delete this product?")) return;
 try {
 await adminApi.deleteProduct(id);
 toast.success("Product deleted");
 fetchData();
 } catch (error) {
 toast.error("Failed to delete product");
 }
 };

 if (loading) {
 return (
 <div className="flex-grow flex flex-col items-center justify-center py-16 md:py-32 bg-white ">
 <Loader2 size={48} className="animate-spin text-primary-600 mb-4" />
 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading inventory...</p>
 </div>
 );
 }

 return (
 <div className="w-full flex-grow bg-white transition-colors duration-300">
 <div className="flex flex-wrap items-center justify-between gap-6 mb-8 md:mb-12">
 <div>
 <h1 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold text-slate-900 mb-2">Product Inventory</h1>
 <p className="text-slate-500 text-xs md:text-medium">Manage your botanical catalog and stock levels.</p>
 </div>
 <button 
 onClick={() => openModal()}
 className="bg-primary-700 text-white px-6 py-3.5 md:px-8 md:py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-primary-800 transition-all shadow-xl shadow-primary-900/20 active:scale-95 cursor-pointer"
 >
 <Plus size={20} md:size={22} /> Add New Product
 </button>
 </div>

 {/* TABLE */}
 <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50 border-b border-slate-100 ">
 <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Botanical Specimen</th>
 <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Taxonomy</th>
 <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Valuation</th>
 <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Status</th>
 <th className="px-4 py-4 md:px-8 md:py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50 ">
 {products.map((product) => (
 <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
 <td className="px-4 py-4 md:px-8 md:py-6">
 <div className="flex items-center gap-3 md:gap-5">
 <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
 <img src={product.image_url || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
 </div>
 <div className="min-w-0">
 <p className="font-bold text-slate-900 truncate text-sm md:text-lg tracking-tight">{product.name}</p>
 <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[120px] md:max-w-[250px] font-medium">{product.description}</p>
 </div>
 </div>
 </td>
 <td className="px-4 py-4 md:px-8 md:py-6">
 <span className="text-[10px] font-bold bg-primary-50 text-primary-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-primary-100 uppercase tracking-widest">
 {product.category?.name || 'Uncategorized'}
 </span>
 </td>
 <td className="px-4 py-4 md:px-8 md:py-6 font-serif font-bold text-slate-900 text-sm md:text-lg">${parseFloat(product.price).toFixed(2)}</td>
 <td className="px-4 py-4 md:px-8 md:py-6">
 <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${product.stock < 10 ? 'text-red-600 ' : 'text-slate-600 '}`}>
 {product.stock} <span className="opacity-50">Available</span>
 </span>
 </td>
 <td className="px-4 py-4 md:px-8 md:py-6 text-right">
 <div className="flex justify-end gap-2 md:gap-3 transition-opacity">
 <button 
 onClick={() => openModal(product)}
 className="p-2 md:p-3 text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg md:rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 cursor-pointer"
 >
 <Edit size={16} md:size={18} />
 </button>
 <button 
 onClick={() => handleDelete(product.id)}
 className="p-2 md:p-3 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg md:rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 cursor-pointer"
 >
 <Trash2 size={16} md:size={18} />
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* MODAL DIALOG */}
 <dialog 
 ref={dialogRef}
 className="fixed inset-0 m-auto w-[95%] md:w-full md:max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-0 overflow-hidden outline-none transition-all backdrop:bg-slate-950/40 backdrop:backdrop-blur-sm"
 onClick={(e) => e.target === dialogRef.current && closeModal()}
 >
 <div className="flex flex-col max-h-[90dvh]">
 <div className="flex justify-between items-center p-6 md:p-8 border-b border-slate-100 ">
 <div>
 <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-slate-900 ">
 {editingProduct ? 'Modify Specimen' : 'Add New Specimen'}
 </h2>
 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Catalog Entry Management</p>
 </div>
 <button onClick={closeModal} className="p-2 md:p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl md:rounded-2xl transition-all cursor-pointer">
 <X size={20} md:size={24} />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 md:space-y-8 overflow-y-auto">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
 <div className="md:col-span-2">
 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Product Name</label>
 <input
 type="text"
 name="name"
 value={formData.name}
 onChange={handleChange}
 required
 className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary-400 outline-none transition-all font-bold"
 />
 </div>
 
 <div>
 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Taxonomy (Category)</label>
 <select
 name="category_id"
 value={formData.category_id}
 onChange={handleChange}
 required
 className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary-400 outline-none transition-all font-bold appearance-none cursor-pointer"
 >
 {categories.length > 0 ? (
 categories.map(cat => (
 <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
 ))
 ) : (
 <option value="1">Plant</option>
 )}
 </select>
 </div>

 <div>
 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Price ($)</label>
 <input
 type="number"
 step="0.01"
 name="price"
 value={formData.price}
 onChange={handleChange}
 required
 className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary-400 outline-none transition-all font-bold"
 />
 </div>

 <div>
 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Product Type</label>
 <select
 name="product_type"
 value={formData.product_type}
 onChange={handleChange}
 required
 className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary-400 outline-none transition-all font-bold appearance-none cursor-pointer"
 >
 <option value="PLANT">PLANT</option>
 <option value="BOUQUET">BOUQUET</option>
 <option value="MEDICINE">MEDICINE</option>
 <option value="TOOL">TOOL</option>
 </select>
 </div>

 <div>
 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Inventory Levels</label>
 <input
 type="number"
 name="stock"
 value={formData.stock}
 onChange={handleChange}
 required
 className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary-400 outline-none transition-all font-bold"
 />
 </div>

 <div>
 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Discount Price ($)</label>
 <input
 type="number"
 step="0.01"
 name="discount_price"
 value={formData.discount_price}
 onChange={handleChange}
 placeholder="Optional"
 className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary-400 outline-none transition-all font-bold"
 />
 </div>

 <div className="flex items-center gap-3 pt-6">
 <input
 type="checkbox"
 id="is_featured"
 name="is_featured"
 checked={formData.is_featured}
 onChange={handleChange}
 className="w-6 h-6 rounded-lg text-primary-600 focus:ring-primary-500 border-slate-200 bg-slate-50 cursor-pointer"
 />
 <label htmlFor="is_featured" className="text-sm font-bold text-slate-700 cursor-pointer">
 Featured Specimen (Promote to Home)
 </label>
 </div>

 <div className="md:col-span-2">
 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Visual Asset</label>
 <div className="flex flex-col gap-4">
 <div className="flex items-center gap-4">
 <label className="flex-1 flex items-center justify-center gap-3 px-5 py-4 border-2 border-dashed border-slate-200 rounded-2xl hover:border-primary-400 cursor-pointer transition-all bg-slate-50/50 group">
 <Image size={20} className="text-slate-400 group-hover:text-primary-600" />
 <span className="text-sm font-bold text-slate-500 ">
 {imageFile ? imageFile.name : 'Upload New Specimen Image'}
 </span>
 <input 
 type="file" 
 className="hidden" 
 onChange={(e) => setImageFile(e.target.files[0])} 
 accept="image/*"
 />
 </label>
 {imageFile && (
 <button 
 type="button" 
 onClick={() => setImageFile(null)}
 className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
 >
 <X size={20} />
 </button>
 )}
 </div>
 <input
 type="text"
 name="image_url"
 value={formData.image_url}
 onChange={handleChange}
 className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary-400 outline-none transition-all text-[10px] text-slate-400 font-mono"
 placeholder="External URL fallback..."
 />
 </div>
 </div>

 <div className="md:col-span-2">
 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Description</label>
 <textarea
 name="description"
 value={formData.description}
 onChange={handleChange}
 rows={4}
 className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-primary-400 outline-none transition-all resize-none font-medium"
 />
 </div>
 </div>

 <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
 <button 
 type="button" 
 onClick={closeModal} 
 className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
 >
 Cancel
 </button>
 <button 
 type="submit"
 disabled={isSubmitting}
 className="bg-primary-700 text-white px-12 py-4 rounded-2xl font-bold hover:bg-primary-800 transition-all shadow-xl shadow-primary-900/20 disabled:opacity-70 flex items-center gap-3 active:scale-95 cursor-pointer"
 >
 {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : (editingProduct ? 'Commit Changes' : 'Initialize Specimen')}
 </button>
 </div>
 </form>
 </div>
 </dialog>
 </div>
 );
};

export default AdminProducts;
