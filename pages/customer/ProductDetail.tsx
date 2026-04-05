import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, MessageCircle, Palette, Ruler, Shirt, Info, Package, Weight, Box, ChevronLeft, ChevronRight, Maximize2, Play, Youtube } from 'lucide-react';
import { db } from '../../services/db';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import SEO from '../../components/SEO';
import { getKeywordsForCategory } from '../../utils/seo-constants';

// Helper to extract YouTube video ID
const getYoutubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, settings } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'image' | 'video', url: string, videoId?: string }>({ type: 'image', url: '' });
  const [showGallery, setShowGallery] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    if (id) {
      db.products.get(id).then(p => {
        setProduct(p || null);
        if (p) {
          setQty(1);
          // Initialize selected image with the first available image or fallback to main image_url
          const images = p.images && p.images.length > 0 ? p.images : (p.image_url ? [p.image_url] : []);
          if (images.length > 0) {
            setSelectedMedia({ type: 'image', url: images[0] });
          }
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center pt-24">Loading details...</div>;
  if (!product) return <div className="p-8 text-center pt-24">Product not found</div>;

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
  const videoId = product.video_url ? getYoutubeVideoId(product.video_url) : null;

  // Construct media list: [Image 1, Video (if exists), Image 2, Image 3...]
  const mediaList: { type: 'image' | 'video', url: string, videoId?: string }[] = [];

  if (images.length > 0) {
    mediaList.push({ type: 'image', url: images[0] });
  }

  if (videoId) {
    mediaList.push({ type: 'video', url: product.video_url!, videoId });
  }

  if (images.length > 1) {
    images.slice(1).forEach(img => {
      mediaList.push({ type: 'image', url: img });
    });
  }

  // Fallback if no images
  if (mediaList.length === 0 && !videoId) {
    mediaList.push({ type: 'image', url: '' });
  }

  const handleQtyChange = (delta: number) => {
    setQty(prev => {
      const next = prev + delta;
      return next < 1 ? 1 : next;
    });
  };

  const handleAddToBag = () => {
    addToCart(product, qty);
    alert('Added to Enquiry Bag!');
  };

  const openGallery = (index: number) => {
    setCurrentMediaIndex(index);
    setShowGallery(true);
  };

  const nextMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentMediaIndex(prev => (prev + 1) % mediaList.length);
  };

  const prevMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentMediaIndex(prev => (prev - 1 + mediaList.length) % mediaList.length);
  };

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4 md:py-8">
      <SEO
        title={product.title}
        description={product.description}
        keywords={[
          ...(product.keywords ? product.keywords.split(',').map(k => k.trim()) : []),
          ...getKeywordsForCategory(product.category),
          product.title,
          product.category,
          'wholesale',
          'bulk'
        ]}
        image={images[0]}
      />
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gold-600 dark:text-gray-300 dark:hover:text-gold-400 mb-4 md:mb-6 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-sm md:text-base">Back to Catalog</span>
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-xl md:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 p-4 md:p-6 gap-0">
          <div className="flex flex-col gap-4 bg-gray-50 dark:bg-gray-800/50">
            {/* Main Media Container */}
            <div
              className="relative mx-auto rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group max-w-[230px] w-full"
              onClick={() => mediaList[currentMediaIndex].type === 'image' && openGallery(currentMediaIndex)}
            >
              <div className="relative bg-white dark:bg-gray-800 aspect-[9/16]">
                {selectedMedia.type === 'video' ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedMedia.videoId}?autoplay=1`}
                    title="Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover"
                  ></iframe>
                ) : (
                  <>
                    <img
                      src={selectedMedia.url || product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover cursor-zoom-in"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                      <Maximize2 className="text-white opacity-0 group-hover:opacity-100 w-12 h-12 drop-shadow-md transition-opacity duration-300" />
                    </div>
                  </>
                )}
              </div>

              {product.stock_status === 'coming_soon' && (
                <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg pointer-events-none">
                  Coming Soon
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {mediaList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {mediaList.map((media, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedMedia(media);
                      setCurrentMediaIndex(idx);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all relative ${(selectedMedia.type === media.type && selectedMedia.url === media.url)
                        ? 'border-gold-600 shadow-md ring-2 ring-gold-100 dark:ring-gold-900'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gold-300 dark:hover:border-gold-700'
                      }`}
                  >
                    {media.type === 'video' ? (
                      <div className="w-full h-full bg-black flex items-center justify-center relative">
                        <img
                          src={`https://img.youtube.com/vi/${media.videoId}/default.jpg`}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-1">
                            <Play size={12} fill="white" className="text-white" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img src={media.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover bg-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 md:p-6 lg:p-8 flex flex-col">
            <span className="text-gold-600 font-bold uppercase text-xs md:text-sm tracking-wider mb-2 md:mb-3 inline-block bg-gold-50 dark:bg-gold-900/20 px-2 md:px-3 py-1 rounded-full w-fit">
              {product.category}
            </span>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 leading-tight">
              {product.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>

            <div className="p-4 md:p-6 mb-6 md:mb-8 bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gray-800 dark:to-gray-800 rounded-xl md:rounded-2xl border border-gold-100 dark:border-gray-700">
              <div className="text-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm block mb-2 font-medium">Wholesale Price</span>
                <span className="text-2xl md:text-3xl font-bold text-gold-700 dark:text-gold-400">₹{product.price}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 block mt-1">per piece</span>
              </div>
            </div>

            {/* Product Details Section */}
            {(product.color || product.size || product.fabric || product.material || product.care_instructions || product.weight || product.dimensions || product.brand || product.sku) && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-3 md:mb-4 flex items-center gap-2">
                  <Info size={18} className="text-gold-600 md:w-5 md:h-5" />
                  Product Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                  {product.color && (
                    <div className="flex items-start gap-3">
                      <div className="bg-gold-100 dark:bg-gold-900/30 p-2 rounded-lg">
                        <Palette size={18} className="text-gold-600 dark:text-gold-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Color</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{product.color}</p>
                      </div>
                    </div>
                  )}
                  {product.size && (
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                        <Ruler size={18} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Size</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{product.size}</p>
                      </div>
                    </div>
                  )}
                  {product.fabric && (
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                        <Shirt size={18} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Fabric</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{product.fabric}</p>
                      </div>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex items-start gap-3">
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                        <Package size={18} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Material</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{product.material}</p>
                      </div>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex items-start gap-3">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                        <Weight size={18} className="text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Weight</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{product.weight}</p>
                      </div>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                        <Box size={18} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Dimensions</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{product.dimensions}</p>
                      </div>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex items-start gap-3">
                      <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg">
                        <Shirt size={18} className="text-pink-600 dark:text-pink-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Brand</p>
                        <p className="text-gray-900 dark:text-white font-semibold">{product.brand}</p>
                      </div>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                        <Package size={18} className="text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">SKU</p>
                        <p className="text-gray-900 dark:text-white font-semibold font-mono">{product.sku}</p>
                      </div>
                    </div>
                  )}
                  {product.care_instructions && (
                    <div className="flex items-start gap-3 md:col-span-2">
                      <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-lg">
                        <Info size={18} className="text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Care Instructions</p>
                        <p className="text-gray-900 dark:text-white">{product.care_instructions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="mt-auto space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3">
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm md:text-base">Quantity:</span>
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
                  <button
                    onClick={() => handleQtyChange(-1)}
                    className="px-2 md:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    value={qty}
                    readOnly
                    className="w-14 md:w-16 text-center border-x-2 border-gray-200 dark:border-gray-700 py-2 outline-none font-semibold text-sm md:text-base bg-gray-50 dark:bg-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => handleQtyChange(1)}
                    className="px-2 md:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <button
                  onClick={handleAddToBag}
                  className="flex-1 bg-gradient-to-r from-gold-600 to-gold-700 text-white py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base hover:from-gold-700 hover:to-gold-800 transition-all flex items-center justify-center gap-1 md:gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01]"
                >
                  <ShoppingBag size={16} className="md:w-5 md:h-5" /> Add to Enquiry Bag
                </button>
                <a
                  href={`https://wa.me/${settings?.whatsapp_number}?text=Hi, I am interested in ${product.title} (Qty: ${qty}). Please share details.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-gradient-to-r from-black to-gray-900 text-white py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base hover:from-gray-900 hover:to-black transition-all flex items-center justify-center gap-1 md:gap-2 shadow-lg hover:shadow-xl hover:scale-[1.01]"
                >
                  <MessageCircle size={16} className="md:w-5 md:h-5" /> WhatsApp Enquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery Overlay */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm animate-fade-in">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 left-4 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
          >
            <ArrowLeft size={32} />
          </button>

          <button
            onClick={prevMedia}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={nextMedia}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight size={40} />
          </button>

          <div className="w-full h-full p-4 flex items-center justify-center">
            {mediaList[currentMediaIndex].type === 'video' ? (
              <div className="w-full h-full max-w-4xl max-h-[80vh] bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${mediaList[currentMediaIndex].videoId}?autoplay=1`}
                  title="Product Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            ) : (
              <img
                src={mediaList[currentMediaIndex].url}
                alt={`Gallery view ${currentMediaIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
              />
            )}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium bg-black/50 px-4 py-2 rounded-full text-sm">
            {currentMediaIndex + 1} / {mediaList.length}
          </div>
        </div>
      )}
    </div>
  );
}