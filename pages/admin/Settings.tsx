import React, { useEffect, useState } from 'react';
import { Save, Globe, Phone, Image as ImageIcon, Plus, Trash2, MessageCircle, FileText, MapPin, Mail, Copyright } from 'lucide-react';
import { db } from '../../services/db';
import { Settings as SettingsType } from '../../types';

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    site_name: '',
    logo_url: '',
    whatsapp_number: '',
    phone_numbers: [],
    footer_description: '',
    footer_address: '',
    footer_email: '',
    footer_copyright: '',
    google_maps_url: '',
    instagram_url: '',
    facebook_url: '',
    youtube_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const data = await db.settings.get();
    setSettings(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await db.settings.update(settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      // Reload settings to get updated values
      await loadSettings();
      // Force reload to update context
      window.location.reload();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 p-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Site Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your website configuration</p>
      </div>

      <form onSubmit={handleSave}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 p-6 lg:p-8 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl ${message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Globe size={18} className="text-blue-600 dark:text-blue-400" />
                Site Name
              </label>
              <input
                required
                type="text"
                className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="MalikGarments Wholesale"
                value={settings.site_name}
                onChange={e => setSettings({ ...settings, site_name: e.target.value })}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This name will appear throughout your website</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <ImageIcon size={18} className="text-blue-600 dark:text-blue-400" />
                Logo URL
              </label>
              <input
                type="url"
                className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="https://example.com/logo.png"
                value={settings.logo_url || ''}
                onChange={e => setSettings({ ...settings, logo_url: e.target.value })}
              />
              {settings.logo_url && (
                <div className="mt-3 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 w-fit">
                  <img
                    src={settings.logo_url}
                    alt="Logo preview"
                    className="h-20 object-contain bg-gray-50 dark:bg-gray-800 p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x60?text=Invalid+URL';
                    }}
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">URL to your website logo image</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <MessageCircle size={18} className="text-green-600 dark:text-green-400" />
                WhatsApp Number (for messaging)
              </label>
              <input
                required
                type="tel"
                className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="919876543210"
                value={settings.whatsapp_number}
                onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Single WhatsApp number for messaging. Enter without + sign (e.g., 919876543210)</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Phone size={18} className="text-blue-600 dark:text-blue-400" />
                Phone Numbers (for calling)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Add multiple phone numbers that customers can call</p>

              <div className="space-y-3">
                {(settings.phone_numbers || []).map((phone, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="tel"
                      className="flex-1 border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                      placeholder="919876543210"
                      value={phone}
                      onChange={e => {
                        const newPhones = [...(settings.phone_numbers || [])];
                        newPhones[index] = e.target.value;
                        setSettings({ ...settings, phone_numbers: newPhones });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPhones = [...(settings.phone_numbers || [])];
                        newPhones.splice(index, 1);
                        setSettings({ ...settings, phone_numbers: newPhones });
                      }}
                      className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors border-2 border-red-200 dark:border-red-900 hover:border-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      phone_numbers: [...(settings.phone_numbers || []), '']
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all font-medium"
                >
                  <Plus size={18} />
                  Add Phone Number
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Enter numbers without + sign. These will be displayed for customers to call.</p>
            </div>

            {/* Social Media & Links Section */}
            <div className="pt-6 border-t-2 border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Globe size={24} className="text-blue-600 dark:text-blue-400" />
                Social Media & External Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin size={18} className="text-red-500" />
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="https://maps.app.goo.gl/..."
                    value={settings.google_maps_url || ''}
                    onChange={e => setSettings({ ...settings, google_maps_url: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Globe size={18} className="text-pink-600" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="https://instagram.com/..."
                    value={settings.instagram_url || ''}
                    onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Globe size={18} className="text-blue-600" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="https://facebook.com/..."
                    value={settings.facebook_url || ''}
                    onChange={e => setSettings({ ...settings, facebook_url: e.target.value })}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Globe size={18} className="text-red-600" />
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="https://youtube.com/..."
                    value={settings.youtube_url || ''}
                    onChange={e => setSettings({ ...settings, youtube_url: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Footer Content Section */}
            <div className="pt-6 border-t-2 border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={24} className="text-blue-600 dark:text-blue-400" />
                Footer Content
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                    Company Description
                  </label>
                  <textarea
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white resize-none h-24"
                    placeholder="Premium wholesale clothing distributor..."
                    value={settings.footer_description || ''}
                    onChange={e => setSettings({ ...settings, footer_description: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Description shown in the footer about your company</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="New Textile Market, Surat, Gujarat"
                    value={settings.footer_address || ''}
                    onChange={e => setSettings({ ...settings, footer_address: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your business address displayed in footer</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="info@malikgarments.com"
                    value={settings.footer_email || ''}
                    onChange={e => setSettings({ ...settings, footer_email: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email address shown in footer (will be clickable)</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Copyright size={18} className="text-blue-600 dark:text-blue-400" />
                    Copyright Text
                  </label>
                  <input
                    type="text"
                    className="w-full border-2 border-gray-200 dark:border-gray-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder={`© ${new Date().getFullYear()} MalikGarments Wholesale. All rights reserved.`}
                    value={settings.footer_copyright || ''}
                    onChange={e => setSettings({ ...settings, footer_copyright: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Copyright text shown at bottom of footer. Use {`{year}`} for current year.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
