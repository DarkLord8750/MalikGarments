import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Phone, Sparkles, Search, Sun, Moon, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SEO from './SEO';

export default function Layout() {
  const { cart, settings, isDarkMode, toggleTheme } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // SEO Component handles title and meta updates
  // Favicon update logic remains if not handled by SEO component (SEO component handles meta tags, title)
  useEffect(() => {
    if (settings?.logo_url) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.logo_url;
    }
  }, [settings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(1200px_circle_at_30%_-10%,rgba(214,164,54,0.10),transparent_60%),radial-gradient(900px_circle_at_80%_0%,rgba(0,0,0,0.06),transparent_55%)] bg-[#fbf8f2] dark:bg-black dark:from-black dark:to-black transition-colors duration-300">
      <SEO
        title={settings?.site_name}
        description={settings?.footer_description}
        image={settings?.logo_url}
      />
      {/* Top Bar */}
      <div className="bg-[#0b0b0c] text-white text-xs py-2.5 px-4 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <p className="flex items-center gap-2">
            <Sparkles size={12} className="text-gold-300" />
            <span>GST IN : 09BNWPS8315J1Z0</span>
          </p>
          <div className="flex items-center gap-6">
            {settings?.instagram_url && (
              <span><a href={settings.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-gold-200 transition-colors group"><Instagram size={16} className="group-hover:scale-110 transition-transform" /></a></span>
            )}
            {settings?.facebook_url && (
              <span><a href={settings.facebook_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-gold-200 transition-colors group"><Facebook size={16} className="group-hover:scale-110 transition-transform" /></a></span>
            )}
            {settings?.youtube_url && (
              <span><a href={settings.youtube_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-gold-200 transition-colors group"><Youtube size={16} className="group-hover:scale-110 transition-transform" /></a></span>
            )}
            {(settings?.phone_numbers && settings.phone_numbers.length > 0) ? (
              <div className="flex items-center gap-4">
                {settings.phone_numbers.slice(0, 1).map((phone, idx) => (
                  <a
                    key={idx}
                    href={`tel:+${phone}`}
                    className="flex items-center gap-1.5 hover:text-gold-200 transition-colors group"
                  >
                    <Phone size={13} className="group-hover:scale-110 transition-transform" />
                    <span>+{phone.slice(0, 2)} {phone.slice(2, 7)} {phone.slice(7)}</span>
                  </a>
                ))}
              </div>
            ) : (
              <a
                href={`tel:+${settings?.whatsapp_number || '918287430650'}`}
                className="flex items-center gap-1.5 hover:text-gold-200 transition-colors group"
              >
                <Phone size={13} className="group-hover:scale-110 transition-transform" />
                <span>+{settings?.whatsapp_number?.slice(0, 2) || '91'} {settings?.whatsapp_number?.slice(2, 7) || '82874'} {settings?.whatsapp_number?.slice(7) || '30650'}</span>
              </a>
            )}
            <Link to="/admin" className="hover:text-gold-200 transition-colors">Admin Login</Link>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`bg-[#fbf8f2]/90 dark:bg-black/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 border-b border-black/5 dark:border-white/10 ${scrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.06)]' : 'shadow-none'
        }`}>
        <div className="container mx-auto px-4 lg:px-6">
          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between h-16">
            {/* Mobile Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={settings?.site_name || 'Logo'} className="h-8 w-auto rounded-lg shadow-sm dark:invert" />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-gold-300 to-gold-600 rounded-lg flex items-center justify-center shadow-[0_8px_20px_rgba(214,164,54,0.25)] group-hover:shadow-[0_10px_25px_rgba(214,164,54,0.35)] transition-all group-hover:scale-105">
                  <ShoppingBag size={16} className="text-[#0b0b0c]" />
                </div>
              )}
              <div>
                <div className="text-lg font-bold text-[#0b0b0c] dark:text-white font-display tracking-wide">
                  {settings?.site_name ? (
                    <>
                      {settings.site_name.split(' ')[0]}
                      <span className="text-[#2a2a2a] dark:text-gray-300">
                        {settings.site_name.split(' ').length > 1 ? ' ' + settings.site_name.split(' ').slice(1).join(' ') : ''}
                      </span>
                    </>
                  ) : (
                    <>Malik<span className="text-[#2a2a2a] dark:text-gray-300">Garments</span></>
                  )}
                </div>
                <div className="text-[9px] text-[#6b6256] dark:text-gray-400 font-medium uppercase tracking-[0.2em]">Wholesale</div>
              </div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="text-[#2a2a2a] dark:text-white p-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center h-20">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0 mr-4 lg:mr-8">
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={settings?.site_name || 'Logo'} className="h-10 w-auto rounded-xl shadow-sm dark:invert" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-gold-300 to-gold-600 rounded-xl flex items-center justify-center shadow-[0_10px_25px_rgba(214,164,54,0.25)] group-hover:shadow-[0_14px_30px_rgba(214,164,54,0.35)] transition-all group-hover:scale-105">
                  <ShoppingBag size={20} className="text-[#0b0b0c]" />
                </div>
              )}
              <div>
                <div className="text-xl lg:text-2xl font-bold text-[#0b0b0c] dark:text-white font-display tracking-wide">
                  {settings?.site_name ? (
                    <>
                      {settings.site_name.split(' ')[0]}
                      <span className="text-[#2a2a2a] dark:text-gray-300">
                        {settings.site_name.split(' ').length > 1 ? ' ' + settings.site_name.split(' ').slice(1).join(' ') : ''}
                      </span>
                    </>
                  ) : (
                    <>Malik<span className="text-[#2a2a2a] dark:text-gray-300">Garments</span></>
                  )}
                </div>
                <div className="text-[10px] text-[#6b6256] dark:text-gray-400 font-medium uppercase tracking-[0.25em]">Wholesale</div>
              </div>
            </Link>

            {/* Search Bar - Centered */}
            <div className="flex-1 justify-center px-4 lg:px-8 hidden xl:flex">
              <form onSubmit={handleSearch} className="w-full max-w-md">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Products..."
                    className="w-full px-5 py-3 pl-12 pr-24 text-sm bg-gradient-to-r from-white/90 to-white/95 dark:from-gray-800 dark:to-gray-900 border border-gold-200/60 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/80 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(214,164,54,0.15)] focus:shadow-[0_12px_40px_rgba(214,164,54,0.25)] transition-all duration-300 placeholder-[#9f9482] dark:placeholder-gray-500 font-medium text-gray-900 dark:text-white"
                  />
                  <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6b6256] dark:text-gray-400 group-focus-within:text-gold-600 dark:group-focus-within:text-gold-400 transition-colors duration-300" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-[0_4px_15px_rgba(214,164,54,0.3)] hover:shadow-[0_6px_20px_rgba(214,164,54,0.4)] transition-all duration-300 hover:scale-105 border border-gold-400/50"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Menu - Right */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg text-[#2a2a2a] hover:bg-white/60 hover:text-[#0b0b0c] dark:text-gray-200 dark:hover:bg-gray-800 transition-all duration-200 mr-1"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                to="/"
                className={`px-3 lg:px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${location.pathname === '/'
                  ? 'bg-gold-50 dark:bg-gray-800 text-[#0b0b0c] dark:text-white shadow-sm border border-gold-200 dark:border-gray-700'
                  : 'text-[#2a2a2a] dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800 hover:text-[#0b0b0c] dark:hover:text-white'
                  }`}
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className={`px-3 lg:px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${location.pathname === '/catalog'
                  ? 'bg-gold-50 dark:bg-gray-800 text-[#0b0b0c] dark:text-white shadow-sm border border-gold-200 dark:border-gray-700'
                  : 'text-[#2a2a2a] dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800 hover:text-[#0b0b0c] dark:hover:text-white'
                  }`}
              >
                Catalog
              </Link>

              <Link to="/enquiry-cart" className="relative ml-2">
                <div className="flex items-center gap-2 bg-[#0b0b0c] dark:bg-gray-800 text-gold-200 px-4 lg:px-5 py-2.5 rounded-lg hover:bg-[#141416] dark:hover:bg-gray-700 transition-all duration-200 shadow-[0_12px_25px_rgba(0,0,0,0.14)] hover:shadow-[0_16px_34px_rgba(0,0,0,0.18)] hover:scale-[1.02] border border-gold-600/30">
                  <ShoppingBag size={18} />
                  <span className="font-semibold hidden sm:inline">Enquiry Bag</span>
                  <span className="font-semibold sm:hidden">Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold-500 text-[#0b0b0c] text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#fbf8f2] dark:bg-black border-t border-black/10 dark:border-white/10 shadow-lg animate-fade-in">
            <div className="container mx-auto px-4 py-6 flex flex-col space-y-3">
              <div className="flex items-center justify-between px-4 mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-4 rounded-lg font-medium transition-colors text-left ${location.pathname === '/' ? 'bg-gold-50 dark:bg-gray-800 text-[#0b0b0c] dark:text-white border border-gold-200 dark:border-gray-700' : 'text-[#2a2a2a] dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800'
                  }`}
              >
                Home
              </Link>
              <Link
                to="/catalog"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-4 rounded-lg font-medium transition-colors text-left ${location.pathname === '/catalog' ? 'bg-gold-50 dark:bg-gray-800 text-[#0b0b0c] dark:text-white border border-gold-200 dark:border-gray-700' : 'text-[#2a2a2a] dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800'
                  }`}
              >
                Catalog
              </Link>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4 py-4">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Products..."
                    className="w-full px-4 py-4 pl-12 pr-20 text-base bg-gradient-to-r from-white/95 to-white/98 dark:from-gray-800 dark:to-gray-900 border border-gold-200/60 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(214,164,54,0.15)] focus:shadow-[0_12px_40px_rgba(214,164,54,0.25)] transition-all duration-300 placeholder-[#9f9482] dark:placeholder-gray-500 font-medium text-gray-900 dark:text-white"
                  />
                  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6b6256] dark:text-gray-400 group-focus-within:text-gold-600 dark:group-focus-within:text-gold-400 transition-colors duration-300" />
                  <button
                    type="submit"
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-[0_4px_15px_rgba(214,164,54,0.3)] hover:shadow-[0_6px_20px_rgba(214,164,54,0.4)] transition-all duration-300 hover:scale-105 border border-gold-400/50"
                  >
                    Search
                  </button>
                </div>
              </form>

              <Link
                to="/enquiry-cart"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-4 rounded-lg font-semibold bg-gradient-to-r from-[#0b0b0c] to-gray-900 dark:from-gray-800 dark:to-gray-900 text-gold-200 flex items-center justify-between hover:from-gray-900 hover:to-[#0b0b0c] dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 border border-gold-600/30"
              >
                <span>View Cart</span>
                {totalItems > 0 && (
                  <span className="bg-gold-500 text-[#0b0b0c] px-3 py-1 rounded-full text-sm font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${settings?.whatsapp_number}?text=Hi, I visited your website and have some queries.`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#0b0b0c] text-gold-200 p-3 md:p-4 rounded-full shadow-2xl hover:shadow-[0_18px_40px_rgba(214,164,54,0.20)] transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group animate-fade-in border border-gold-600/30"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current group-hover:rotate-12 transition-transform">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Footer */}
      <footer className="bg-[#0b0b0c] text-[#d8d1c4] mt-16 md:mt-20 border-t border-gold-600/20">
        <div className="container mx-auto px-4 lg:px-6 py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt={settings?.site_name || 'Logo'} className="h-8 md:h-10 w-auto rounded-lg md:rounded-xl shadow-sm invert" />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-gold-300 to-gold-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_8px_20px_rgba(214,164,54,0.25)] md:shadow-[0_10px_25px_rgba(214,164,54,0.25)]">
                    <ShoppingBag size={16} className="md:w-5 md:h-5 text-[#0b0b0c]" />
                  </div>
                )}
                <div>
                  <h3 className="text-white text-lg md:text-xl font-bold font-display tracking-wide">{settings?.site_name || 'MalikGarments'}</h3>
                  <p className="text-xs text-[#9f9482] uppercase tracking-[0.2em] md:tracking-[0.25em]">Wholesale</p>
                </div>
              </div>
              <p className="text-sm text-[#bfb6a7] leading-relaxed max-w-md text-justify md:text-left whitespace-pre-wrap">
                {settings?.footer_description || 'Premium wholesale clothing distributor. Supplying quality garments to retailers across the country since 1995. Your trusted partner in fashion wholesale.'}
              </p>
              <h3 className="text-white text-base md:text-lg font-bold mb-2 md:mb-2 mt-4 font-display tracking-wide ">Company Details</h3>
              <ul className="space-y-1 md:space-y-1 text-sm">
                <li>
                  <Link to="#" className="hover:text-gold-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Owner Name: Mr. Shamsad
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-gold-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    GST IN: 09BNWPS8315J1Z0
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-gold-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Account No.: 4789002100000816
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-gold-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    IFSC Code: PUNB0478900
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-gold-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Branch Name: Tronica City
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-base md:text-lg font-bold mb-3 md:mb-4 font-display tracking-wide">Quick Links</h3>
              <ul className="space-y-2 md:space-y-3 text-sm">
                <li>
                  <Link to="/catalog" className="hover:text-gold-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Full Catalog
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Rain%20suit" className="hover:text-gold-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Men's Collection
                  </Link>
                </li>
                <li>
                  <Link to="/catalog?category=Women%27s%20Wear" className="hover:text-gold-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Women's Collection
                  </Link>
                </li>
                {/* <li>
                  <a href="#" className="hover:text-gold-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Terms & Conditions
                  </a>
                </li> */}
              </ul>
            </div>
            <div>
              <h3 className="text-white text-base md:text-lg font-bold mb-3 md:mb-4 font-display tracking-wide">Contact Us</h3>
              <ul className="space-y-1 md:space-y-2 text-sm">
                {settings?.footer_address && (
                  <li className="flex items-start gap-2">
                    <MapPin size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                    <span>{settings.footer_address}</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span><a href={settings?.google_maps_url || '#'} target="_blank" rel="noreferrer" className="hover:text-gold-200 transition-colors">Get Directions</a></span>
                </li>
                {settings?.footer_email && (
                  <li className="flex items-center gap-2">
                    <span className="text-gold-300">✉</span>
                    <a href={`mailto:${settings.footer_email}`} className="hover:text-gold-200 transition-colors">
                      {settings.footer_email}
                    </a>
                  </li>
                )}
                {settings?.phone_numbers && settings.phone_numbers.length > 0 ? (
                  settings.phone_numbers.map((phone, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Phone size={16} className="text-gold-300 flex-shrink-0" />
                      <a href={`tel:+${phone}`} className="hover:text-gold-200 transition-colors">
                        +{phone.slice(0, 2)} {phone.slice(2, 7)} {phone.slice(7)}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2">
                    <Phone size={16} className="text-gold-300 flex-shrink-0" />
                    <a href={`tel:+${settings?.whatsapp_number || '919876543210'}`} className="hover:text-gold-200 transition-colors">
                      +{settings?.whatsapp_number?.slice(0, 2) || '91'} {settings?.whatsapp_number?.slice(2, 7) || '98765'} {settings?.whatsapp_number?.slice(7) || '43210'}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gold-600/20 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-xs text-[#9f9482] px-4">
            {settings?.footer_copyright
              ? settings.footer_copyright.replace('{year}', new Date().getFullYear().toString())
              : `© ${new Date().getFullYear()} MalikGarments Wholesale. All rights reserved.`
            }
          </div>
        </div>
      </footer>
    </div>
  );
}