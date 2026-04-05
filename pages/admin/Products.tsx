import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash, Search, Upload, X } from 'lucide-react';
import { db } from '../../services/db';
import { storage } from '../../services/storage';
import { Product, Category } from '../../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [prods, cats] = await Promise.all([
      db.products.list(),
      db.categories.list()
    ]);
    setProducts(prods);
    setCategories(cats);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await db.products.delete(id);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (editingProduct.id) {
      await db.products.update(editingProduct.id, editingProduct);
    } else {
      await db.products.create(editingProduct as any);
    }
    setShowModal(false);
    setEditingProduct(null);
    loadData();
  };

  const openNewModal = () => {
    setEditingProduct({
      title: '',
      category: '',
      images: [],
      stock_status: 'in_stock',
      color: '',
      size: '',
      fabric: '',
      material: '',
      care_instructions: '',
      weight: '',
      dimensions: '',
      brand: '',
      sku: '',
      keywords: '',
      video_url: ''
    });
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct({
      ...p,
      images: p.images || (p.image_url ? [p.image_url] : [])
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !editingProduct) return;

    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const publicUrl = await storage.uploadImage(file);

      setEditingProduct(prev => {
        if (!prev) return null;
        const currentImages = prev.images || [];
        return {
          ...prev,
          images: [...currentImages, publicUrl],
          image_url: currentImages.length === 0 ? publicUrl : prev.image_url // Update main image if first one
        };
      });
    } catch (error: any) {
      console.error('Upload Error:', error);
      alert(`Failed to upload image: ${error.message || JSON.stringify(error)}`);
    } finally {
      setIsUploading(false);
    }
  };

  const addImageUrl = () => {
    if (!newImageUrl || !editingProduct) return;
    setEditingProduct(prev => {
      if (!prev) return null;
      const currentImages = prev.images || [];
      return {
        ...prev,
        images: [...currentImages, newImageUrl],
        image_url: currentImages.length === 0 ? newImageUrl : prev.image_url
      };
    });
    setNewImageUrl('');
  };

  const removeImage = (index: number) => {
    if (!editingProduct || !editingProduct.images) return;
    const newImages = [...editingProduct.images];
    newImages.splice(index, 1);

    setEditingProduct({
      ...editingProduct,
      images: newImages,
      image_url: newImages.length > 0 ? newImages[0] : ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Product Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product catalog and inventory</p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-5 font-bold text-gray-700 dark:text-gray-300">Product</th>
                <th className="p-5 font-bold text-gray-700 dark:text-gray-300">Category</th>
                <th className="p-5 font-bold text-gray-700 dark:text-gray-300">Price</th>
                <th className="p-5 font-bold text-gray-700 dark:text-gray-300">Status</th>
                <th className="p-5 font-bold text-gray-700 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
                  <td className="p-5 flex items-center gap-4">
                    <img src={p.image_url} alt="" className="w-14 h-14 rounded-xl object-contain bg-gray-100 dark:bg-gray-800 shadow-sm" />
                    <span className="font-semibold text-gray-900 dark:text-white">{p.title}</span>
                  </td>
                  <td className="p-5 text-gray-700 dark:text-gray-300 font-medium">{p.category}</td>
                  <td className="p-5 text-gray-900 dark:text-white font-bold">₹{p.price}</td>
                  <td className="p-5">
                    {p.stock_status === 'coming_soon' && (
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        Coming Soon
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right space-y-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-2 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingProduct.id ? 'Edit Product' : 'New Product'}
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                <input
                  required
                  className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                  value={editingProduct.title}
                  onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Coming Soon *</label>
                  <select
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    value={editingProduct.stock_status}
                    onChange={e => setEditingProduct({ ...editingProduct, stock_status: e.target.value as any })}
                  >
                    <option value="in_stock">No</option>
                    <option value="coming_soon">Yes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                <select
                  className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                  value={editingProduct.category}
                  onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  required
                >
                  <option value="">Select Category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-orange-600 mt-1">
                    No categories available. <a href="/admin/categories" className="underline font-semibold">Create one first</a>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">SEO Keywords</label>
                <input
                  className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="Comma separated keywords (e.g. wholesale jackets, winter wear)"
                  value={editingProduct.keywords || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, keywords: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">YouTube Video URL</label>
                <input
                  className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  value={editingProduct.video_url || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, video_url: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Images</label>

                {/* Image List */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                  {(editingProduct.images || []).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 cursor-move"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', idx.toString());
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
                        const toIdx = idx;

                        if (fromIdx === toIdx) return;

                        setEditingProduct(prev => {
                          if (!prev || !prev.images) return prev;
                          const newImages = [...prev.images];
                          const [movedItem] = newImages.splice(fromIdx, 1);
                          newImages.splice(toIdx, 0, movedItem);
                          return {
                            ...prev,
                            images: newImages,
                            image_url: newImages.length > 0 ? newImages[0] : ''
                          };
                        });
                      }}
                    >
                      <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <X size={14} />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center p-0.5 pointer-events-none">
                          Main
                        </div>
                      )}

                      {/* Hover Overlay for Drag Hint */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 pointer-events-none transition-colors" />
                    </div>
                  ))}

                  {/* Upload Button */}
                  <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={async (e) => {
                        if (!e.target.files || e.target.files.length === 0 || !editingProduct) return;

                        setIsUploading(true);
                        try {
                          const files = Array.from(e.target.files) as File[];
                          const publicUrls = await Promise.all(
                            files.map(file => storage.uploadImage(file))
                          );

                          setEditingProduct(prev => {
                            if (!prev) return null;
                            const currentImages = prev.images || [];
                            const newImages = [...currentImages, ...publicUrls];
                            return {
                              ...prev,
                              images: newImages,
                              image_url: currentImages.length === 0 ? newImages[0] : prev.image_url
                            };
                          });
                        } catch (error: any) {
                          console.error('Upload Error:', error);
                          alert(`Failed to upload images: ${error.message || JSON.stringify(error)}`);
                        } finally {
                          setIsUploading(false);
                          e.target.value = ''; // Reset input to allow re-uploading same files if needed
                        }
                      }}
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500 font-medium text-center px-2">Upload Multiple</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Add Image URL */}
                <div className="flex gap-2">
                  <input
                    className="flex-1 border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    placeholder="Or add image via URL..."
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImageUrl();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white resize-none"
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>

              {/* Additional Product Details */}
              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Additional Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Color</label>
                    <input
                      className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="e.g., Red, Blue, Multi-color"
                      value={editingProduct.color || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, color: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Size</label>
                    <input
                      className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="e.g., S, M, L, XL or 28-42"
                      value={editingProduct.size || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, size: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Fabric</label>
                    <input
                      className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="e.g., Cotton, Polyester, Blend"
                      value={editingProduct.fabric || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Material</label>
                    <input
                      className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="e.g., 100% Cotton, 60% Cotton 40% Polyester"
                      value={editingProduct.material || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Weight</label>
                    <input
                      className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="e.g., 200g, 0.5kg"
                      value={editingProduct.weight || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dimensions</label>
                    <input
                      className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="e.g., 30x40 cm, Length: 50cm"
                      value={editingProduct.dimensions || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Brand</label>
                    <input
                      className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="Brand name"
                      value={editingProduct.brand || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">SKU</label>
                    <input
                      className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white font-mono"
                      placeholder="Product SKU code"
                      value={editingProduct.sku || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Care Instructions</label>
                  <textarea
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white resize-none"
                    placeholder="e.g., Machine wash cold, Do not bleach, Iron on low heat"
                    value={editingProduct.care_instructions || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, care_instructions: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
