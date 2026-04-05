import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash, Image as ImageIcon, Upload } from 'lucide-react';
import { db } from '../../services/db';
import { Category } from '../../types';
import { supabase } from '../../services/supabase';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await db.categories.list();
      console.log('Loaded categories:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Products in this category will not be deleted.')) {
      try {
        await db.categories.delete(id);
        loadCategories();
      } catch (err) {
        alert('Failed to delete category. Make sure no products are using this category.');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    try {
      if (editingCategory.id) {
        await db.categories.update(editingCategory.id, {
          name: editingCategory.name,
          image_url: editingCategory.image_url,
          keywords: editingCategory.keywords
        });
      } else {
        await db.categories.create({
          name: editingCategory.name,
          image_url: editingCategory.image_url || '',
          keywords: editingCategory.keywords
        });
      }
      setShowModal(false);
      setEditingCategory(null);
      loadCategories();
    } catch (err: any) {
      console.error('Save error:', err);
      alert(`Failed to save category: ${err.message || 'Unknown error'}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setEditingCategory(prev => prev ? { ...prev, image_url: data.publicUrl } : null);
    } catch (error) {
      alert('Error uploading image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const openNewModal = () => {
    setEditingCategory({
      name: '',
      image_url: '', // Removed placeholder
      keywords: ''
    });
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Category Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Organize your products by categories</p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl h-64 animate-pulse"></div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={40} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Categories Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first category to organize products</p>
          <button
            onClick={openNewModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
                  >
                    <Edit size={18} className="text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-lg"
                  >
                    <Trash size={18} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                {cat.created_at && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created {new Date(cat.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && editingCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingCategory.id ? 'Edit Category' : 'New Category'}
              </h2>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
              <form id="category-form" onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category Name *</label>
                  <input
                    required
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="e.g., Men's Wear, Women's Wear"
                    value={editingCategory.name || ''}
                    onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">SEO Keywords</label>
                  <input
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Comma separated keywords (e.g. mens wear, wholesale clothing)"
                    value={editingCategory.keywords || ''}
                    onChange={e => setEditingCategory({ ...editingCategory, keywords: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category Image</label>

                  {/* Image Preview */}
                  {editingCategory.image_url ? (
                    <div className="mb-4 relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 w-32 mx-auto aspect-[9/16] group">
                      <img
                        src={editingCategory.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, image_url: '' })}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl h-32 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 gap-2 bg-gray-50 dark:bg-gray-800/50">
                      <ImageIcon size={32} className="opacity-50" />
                      <span className="text-sm">No image selected</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {/* File Upload Button */}
                    <label className="flex items-center justify-center gap-2 w-full p-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      {uploading ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload size={20} className="text-blue-600 dark:text-blue-400" />
                      )}
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>

                    <div className="relative">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gray-200 dark:bg-gray-800" />
                      <span className="relative z-10 bg-white dark:bg-gray-900 px-2 text-xs text-gray-500 mx-auto block w-fit">OR URL</span>
                    </div>

                    <input
                      className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                      value={editingCategory.image_url || ''}
                      onChange={e => setEditingCategory({ ...editingCategory, image_url: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="category-form"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
