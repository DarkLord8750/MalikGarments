import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Send, ShoppingBag } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useStore } from '../../context/StoreContext';
import { db } from '../../services/db';

export default function EnquiryCart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-20 text-center">
        <div className="bg-gradient-to-br from-gold-100 to-amber-100 dark:from-gray-800 dark:to-gray-700 w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gold-600 dark:text-gold-400 shadow-lg">
          <ShoppingBag size={36} className="md:w-12 md:h-12" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">Your Enquiry Bag is Empty</h2>
        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto">
          Browse our catalog and add products to send a bulk enquiry. We'll get back to you within 24 hours.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-600 to-gold-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:from-gold-700 hover:to-gold-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Save to Database
      await db.enquiries.create({
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        message: formData.message,
        items: cart
      });

      // 2. Send Email Notification
      // Use the helper service we created
      const { sendEnquiryEmail } = await import('../../services/email');
      await sendEnquiryEmail(formData, cart);

      clearCart();
      alert("Enquiry sent successfully! We will contact you shortly.");
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Failed to send enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Review Enquiry
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Review your items and submit your enquiry</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white dark:bg-gray-900 p-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all flex gap-5 items-center"
            >
              <img
                src={item.product.image_url}
                alt={item.product.title}
                className="w-24 h-24 object-cover rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm"
              />
              <div className="flex-grow">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{item.product.title}</h3>

                <div className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                  ₹{item.product.price}
                  <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">/pc</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                  className="w-24 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-2 text-center text-sm font-semibold focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center gap-1.5 font-medium transition-colors"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))}

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 rounded-2xl border-2 border-gold-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">Total Items:</span>
              <span className="text-gray-900 dark:text-white font-bold text-base md:text-lg">{cart.reduce((sum, item) => sum + item.quantity, 0)} pcs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">Estimated Value:</span>
              <span className="text-gold-700 dark:text-gold-400 font-bold text-lg md:text-xl">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="bg-white dark:bg-gray-900 p-6 lg:p-8 rounded-2xl border-2 border-gray-100 dark:border-gray-800 shadow-lg h-fit sticky top-28">
          <h2 className="font-bold text-2xl mb-6 text-gray-900 dark:text-white">Your Details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
              <input
                required
                type="text"
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
              <input
                required
                type="tel"
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address (Optional)</label>
              <input
                type="email"
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="your@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message (Optional)</label>
              <textarea
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-28 transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 resize-none text-gray-900 dark:text-white"
                placeholder="Any special requirements or questions..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-700 text-white py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:from-gold-700 hover:to-gold-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending Enquiry...
                </>
              ) : (
                <>
                  <Send size={20} /> Send Enquiry
                </>
              )}
            </button>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By sending, you agree to receive a response via Phone/Email. We'll contact you within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}