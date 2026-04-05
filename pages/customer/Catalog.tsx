import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, ArrowUpDown, X } from 'lucide-react';
import { db } from '../../services/db';
import { Product, Category } from '../../types';
import SEO from '../../components/SEO';
import { getKeywordsForCategory } from '../../utils/seo-constants';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const brand = searchParams.get('brand') || '';
  const material = searchParams.get('material') || '';
  const fabric = searchParams.get('fabric') || '';
  const color = searchParams.get('color') || '';
  const sortBy = searchParams.get('sort') || 'name_asc';

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          db.products.list(),
          db.categories.list()
        ]);
        console.log('Loaded categories:', cats);
        setProducts(prods || []);
        setCategories(cats || []);
      } catch (error) {
        console.error('Error loading data:', error);
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Get unique values for filters
  const uniqueBrands = useMemo(() => {
    const brands = products.map(p => p.brand).filter((b): b is string => !!b);
    return Array.from(new Set(brands)).sort();
  }, [products]);

  const uniqueMaterials = useMemo(() => {
    const materials = products.map(p => p.material).filter((m): m is string => !!m);
    return Array.from(new Set(materials)).sort();
  }, [products]);

  const uniqueFabrics = useMemo(() => {
    const fabrics = products.map(p => p.fabric).filter((f): f is string => !!f);
    return Array.from(new Set(fabrics)).sort();
  }, [products]);

  const uniqueColors = useMemo(() => {
    const colors = products.map(p => p.color).filter((c): c is string => !!c);
    return Array.from(new Set(colors)).sort();
  }, [products]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 };
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesCategory = activeCategory ? p.category === activeCategory : true;
      const matchesSearch = searchQuery ? (() => {
        const terms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
        const productText = (p.title + ' ' + p.description).toLowerCase();
        return terms.every(term => productText.includes(term));
      })() : true;
      const matchesMinPrice = minPrice ? p.price >= parseFloat(minPrice) : true;
      const matchesMaxPrice = maxPrice ? p.price <= parseFloat(maxPrice) : true;
      const matchesBrand = brand ? p.brand === brand : true;
      const matchesMaterial = material ? p.material === material : true;
      const matchesFabric = fabric ? p.fabric === fabric : true;
      const matchesColor = color ? p.color === color : true;

      return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice &&
        matchesBrand && matchesMaterial && matchesFabric && matchesColor;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

        default:
          return 0;
      }
    });

    return sorted;
  }, [products, activeCategory, searchQuery, minPrice, maxPrice, brand, material, fabric, color, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (activeCategory) count++;
    if (searchQuery) count++;
    if (minPrice) count++;
    if (maxPrice) count++;

    if (brand) count++;
    if (material) count++;
    if (fabric) count++;
    if (color) count++;
    return count;
  }, [activeCategory, searchQuery, minPrice, maxPrice, brand, material, fabric, color]);

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const currentCategory = categories.find(c => c.name === activeCategory);

  const seoKeywords = useMemo(() => {
    if (currentCategory?.keywords) {
      const explicitKeywords = currentCategory.keywords.split(',').map(k => k.trim());
      // Combine explicit keywords with generated ones
      return [...explicitKeywords, ...getKeywordsForCategory(activeCategory)];
    }
    return getKeywordsForCategory(activeCategory);
  }, [currentCategory, activeCategory]);

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
      <SEO
        title={activeCategory ? `${activeCategory} Wholesale` : 'Wholesale Catalog'}
        description={`Browse our extensive collection of ${activeCategory || 'wholesale garments'}. Best prices for retailers and bulk buyers.`}
        keywords={seoKeywords}
      />
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent break-words">
          Wholesale Catalog
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg break-words">
          Browse <span className="font-semibold text-gold-600 dark:text-gold-400">{products.length}</span> products available for bulk order
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gold-200 dark:border-gold-900 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Filter size={18} className="text-gold-600 dark:text-gold-400" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
          </span>
          <span className={`transform transition-transform text-gray-600 dark:text-gray-400 ${showMobileFilters ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block lg:col-span-1 mb-6 lg:mb-0 w-full`}>
          <div className={`bg-white dark:bg-gray-900 p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 h-fit ${showMobileFilters ? '' : 'lg:sticky lg:top-28'}`}>
            <div className="flex items-center gap-2 font-bold text-lg md:text-xl mb-4 md:mb-6 text-gray-900 dark:text-white">
              <div className="bg-gold-100 dark:bg-gold-900/30 p-1.5 md:p-2 rounded-lg">
                <Filter size={18} className="md:w-5 md:h-5 text-gold-600 dark:text-gold-400" />
              </div>
              Filters
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Search Products</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchParams(prev => {
                    prev.set('search', e.target.value);
                    return prev;
                  })}
                />
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3 block">Categories</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all ${activeCategory === '' ? 'bg-gold-50 dark:bg-gold-900/20 border-2 border-gold-500' : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                  <input
                    type="radio"
                    name="category"
                    checked={activeCategory === ''}
                    onChange={() => setSearchParams(prev => {
                      prev.delete('category');
                      return prev;
                    })}
                    className="text-gold-600 focus:ring-gold-500 w-4 h-4"
                  />
                  <span className={`font-medium ${activeCategory === '' ? 'text-gold-700 dark:text-gold-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    All Categories
                  </span>
                </label>
                {categories.map(cat => (
                  <label
                    key={cat.id}
                    className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all ${activeCategory === cat.name ? 'bg-gold-50 dark:bg-gold-900/20 border-2 border-gold-500' : 'border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={activeCategory === cat.name}
                      onChange={() => setSearchParams(prev => {
                        prev.set('category', cat.name);
                        return prev;
                      })}
                      className="text-gold-600 focus:ring-gold-500 w-4 h-4"
                    />
                    <span className={`font-medium ${activeCategory === cat.name ? 'text-gold-700 dark:text-gold-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-4 md:mb-6">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3 block">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min={0}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-sm bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white"
                  value={minPrice}
                  onChange={(e) => setSearchParams(prev => {
                    if (e.target.value) prev.set('minPrice', e.target.value);
                    else prev.delete('minPrice');
                    return prev;
                  })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  min={0}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-sm bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white"
                  value={maxPrice}
                  onChange={(e) => setSearchParams(prev => {
                    if (e.target.value) prev.set('maxPrice', e.target.value);
                    else prev.delete('maxPrice');
                    return prev;
                  })}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹{priceRange.min} - ₹{priceRange.max}</p>
            </div>



            {/* Brand Filter */}
            {uniqueBrands.length > 0 && (
              <div className="mb-4 md:mb-6">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3 block">Brand</label>
                <select
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-sm bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white"
                  value={brand}
                  onChange={(e) => setSearchParams(prev => {
                    if (e.target.value) prev.set('brand', e.target.value);
                    else prev.delete('brand');
                    return prev;
                  })}
                >
                  <option value="">All Brands</option>
                  {uniqueBrands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Material Filter */}
            {uniqueMaterials.length > 0 && (
              <div className="mb-4 md:mb-6">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3 block">Material</label>
                <select
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-sm bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white"
                  value={material}
                  onChange={(e) => setSearchParams(prev => {
                    if (e.target.value) prev.set('material', e.target.value);
                    else prev.delete('material');
                    return prev;
                  })}
                >
                  <option value="">All Materials</option>
                  {uniqueMaterials.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Fabric Filter */}
            {uniqueFabrics.length > 0 && (
              <div className="mb-4 md:mb-6">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3 block">Fabric</label>
                <select
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-sm bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white"
                  value={fabric}
                  onChange={(e) => setSearchParams(prev => {
                    if (e.target.value) prev.set('fabric', e.target.value);
                    else prev.delete('fabric');
                    return prev;
                  })}
                >
                  <option value="">All Fabrics</option>
                  {uniqueFabrics.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Filter */}
            {uniqueColors.length > 0 && (
              <div className="mb-4 md:mb-6">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 md:mb-3 block">Color</label>
                <select
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-sm bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white"
                  value={color}
                  onChange={(e) => setSearchParams(prev => {
                    if (e.target.value) prev.set('color', e.target.value);
                    else prev.delete('color');
                    return prev;
                  })}
                >
                  <option value="">All Colors</option>
                  {uniqueColors.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="w-full flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all font-semibold text-xs md:text-sm"
              >
                <X size={16} />
                Clear All Filters ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="col-span-full lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl h-48 md:h-64 animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="max-w-md mx-auto px-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="md:w-8 md:h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-semibold mb-2 break-words">No products found</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-4 md:mb-6 break-words">Try adjusting your filters to see more results</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="bg-gradient-to-r from-gold-600 to-gold-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold hover:from-gold-700 hover:to-gold-800 transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> of {products.length} products
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
                  <ArrowUpDown size={16} className="md:w-5 md:h-5 text-gold-600 dark:text-gold-400" />
                  <select
                    className="flex-1 sm:flex-initial px-3 md:px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none text-xs md:text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    value={sortBy}
                    onChange={(e) => setSearchParams(prev => {
                      prev.set('sort', e.target.value);
                      return prev;
                    })}
                  >
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="price_asc">Price (Low-High)</option>
                    <option value="price_desc">Price (High-Low)</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>

                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredProducts.map((product, index) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col animate-fade-in block w-full"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative aspect-[9/16] h-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.stock_status === 'coming_soon' && (
                        <div className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg">
                          Coming Soon
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex-grow flex flex-col">
                      <p className="text-gold-600 dark:text-gold-400 text-[10px] uppercase font-bold mb-1 tracking-wider">{product.category}</p>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 transition-colors group-hover:text-gold-600 dark:group-hover:text-gold-400 leading-tight break-words mb-2">
                        {product.title}
                      </h3>
                      <div className="mt-auto pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-1">
                        <div>
                          <p className="text-lg font-bold text-gold-700 dark:text-gold-400">₹{product.price}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-500">per piece</p>
                        </div>
                        <span className="bg-gradient-to-r from-gold-600 to-gold-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-gold-700 hover:to-gold-800 transition-all shadow-md hover:shadow-lg whitespace-nowrap">
                          View
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}