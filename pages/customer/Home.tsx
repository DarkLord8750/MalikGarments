import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Truck, Sparkles, CheckCircle2, Award, Users } from 'lucide-react';
import { db } from '../../services/db';
import { Category, Product } from '../../types';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          db.categories.list(),
          db.products.list()
        ]);
        setCategories(cats || []);
        setFeaturedProducts(prods.slice(0, 5));
      } catch (error) {
        console.error('Error loading data:', error);
        setCategories([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[radial-gradient(900px_circle_at_20%_-20%,rgba(214,164,54,0.25),transparent_55%),radial-gradient(700px_circle_at_90%_0%,rgba(255,255,255,0.10),transparent_55%)] bg-[#0b0b0c] text-white py-12 px-4 lg:py-16 border-b border-gold-600/20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in">
            {/* <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium border border-gold-600/30 text-gold-100">
              <Sparkles size={14} />
              <span>Trusted by 500+ Retailers Nationwide</span>
            </div> */}
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight font-display">
              Premium Wholesale
              <br />
              <span className="bg-gradient-to-r from-gold-200 via-gold-300 to-white bg-clip-text text-transparent">
                Garments Collection
              </span>
            </h1>
            <p className="text-[#d8d1c4] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Direct from manufacturers. Best bulk prices. Quality assured. Fast delivery. Your one-stop solution for wholesale fashion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
              <Link
                to="/catalog"
                className="group bg-gradient-to-r from-gold-300 to-gold-600 text-[#0b0b0c] px-6 py-3 rounded-xl font-bold hover:from-gold-200 hover:to-gold-500 transition-all duration-300 shadow-[0_18px_40px_rgba(214,164,54,0.18)] hover:shadow-[0_22px_48px_rgba(214,164,54,0.26)] hover:scale-105 flex items-center justify-center gap-2 text-sm"
              >
                <span>Explore Catalog</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* <Link
                to="/catalog"
                className="group bg-transparent border border-gold-600/40 text-gold-100 px-6 py-3 rounded-xl font-bold hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                <span>View Categories</span>
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 lg:px-6">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="group p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-[#e7dfcf] dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
            <div className="bg-gradient-to-br from-gold-300 to-gold-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0b0b0c] shadow-[0_14px_30px_rgba(214,164,54,0.22)] group-hover:scale-110 transition-transform">
              <Star size={28} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white font-display">Premium Quality</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Rigorous quality checks ensure every piece meets our high standards before shipping.</p>
          </div>
          <div className="group p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-[#e7dfcf] dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
            <div className="bg-gradient-to-br from-[#141416] to-[#0b0b0c] dark:from-gray-800 dark:to-black w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gold-200 shadow-[0_14px_30px_rgba(0,0,0,0.18)] group-hover:scale-110 transition-transform border border-gold-600/25">
              <TrendingUp size={28} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white font-display">Best Margins</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Competitive wholesale pricing designed to maximize your profit margins.</p>
          </div>
          <div className="group p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-[#e7dfcf] dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
            <div className="bg-gradient-to-br from-gold-400 to-gold-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0b0b0c] shadow-[0_14px_30px_rgba(214,164,54,0.22)] group-hover:scale-110 transition-transform">
              <Truck size={28} />
            </div>
            <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white font-display">Fast Delivery</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Express dispatch within 24 hours of order confirmation.</p>
          </div>
        </div>
      </section>


      {/* Featured Products */}
      <section className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              New Arrivals
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">Latest additions to our collection</p>
          </div>
          <Link
            to="/catalog"
            className="group text-gold-600 dark:text-gold-400 font-semibold flex items-center gap-2 hover:text-gold-700 dark:hover:text-gold-300 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl h-96 animate-pulse"></div>
            ))
          ) : (
            featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[9/16] h-auto overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.stock_status === 'coming_soon' && (
                    <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-purple-500 text-white text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg">
                      Coming Soon
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-5">
                  <p className="text-gold-600 dark:text-gold-400 text-xs uppercase font-bold mb-2 tracking-wider">{product.category}</p>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors text-sm md:text-lg leading-tight">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="text-xl md:text-2xl font-bold text-gold-700 dark:text-gold-400">₹{product.price}</span>
                      <span className="text-xs md:text-sm text-gray-500 dark:text-gray-500 font-normal ml-1">/pc</span>
                    </div>
                    <span className="bg-gradient-to-r from-gold-600 to-gold-700 text-white text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg font-semibold hover:from-gold-700 hover:to-gold-800 transition-all shadow-md hover:shadow-lg">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
      {/* Categories */}
      <section className="container mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Shop By Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">Browse our extensive collection of premium garments</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl animate-pulse"></div>
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">No categories available. Please add categories from the admin panel.</p>
            </div>
          ) : (
            categories.map((cat, index) => (
              <Link
                to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                key={cat.id || index}
                className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[9/16] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={cat.image_url || 'https://via.placeholder.com/400x300?text=Category'}
                  alt={cat.name || 'Category'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Category';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                  <span className="text-white font-bold text-sm md:text-lg lg:text-xl uppercase tracking-wider group-hover:translate-y-[-4px] transition-transform">
                    {cat.name || 'Unnamed Category'}
                  </span>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={20} className="text-white" />
                </div>
              </Link>
            ))
          )}
        </div>
      </section>


      {/* Trust Section */}
      <section className="bg-gradient-to-r from-gold-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 py-12 md:py-16 rounded-3xl border border-gold-100 dark:border-gray-800">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-gold-600 to-gold-700 w-12 md:w-16 h-12 md:h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
                <Users size={24} className="md:w-7 md:h-7" />
              </div>
              <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base">Happy Retailers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-gold-600 to-gold-700 w-12 md:w-16 h-12 md:h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
                <Award size={24} className="md:w-7 md:h-7" />
              </div>
              <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">25+</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base">Years Experience</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-gold-600 to-gold-700 w-12 md:w-16 h-12 md:h-16 rounded-full flex items-center justify-center mb-4 text-white shadow-lg">
                <CheckCircle2 size={24} className="md:w-7 md:h-7" />
              </div>
              <div className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium text-sm md:text-base">Quality Assured</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}