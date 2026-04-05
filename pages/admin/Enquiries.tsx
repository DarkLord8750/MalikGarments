import React, { useEffect, useState } from 'react';
import { db } from '../../services/db';
import { Enquiry, EnquiryStatus } from '../../types';
import { Eye } from 'lucide-react';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    const data = await db.enquiries.list();
    setEnquiries(data);
  };

  const handleStatusUpdate = async (id: string, newStatus: EnquiryStatus) => {
    await db.enquiries.updateStatus(id, newStatus);
    loadEnquiries();
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Enquiries</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage and track customer enquiries</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-5 font-bold text-gray-700 dark:text-gray-300">Date</th>
              <th className="p-5 font-bold text-gray-700 dark:text-gray-300">Customer</th>
              <th className="p-5 font-bold text-gray-700 dark:text-gray-300">Phone</th>
              <th className="p-5 font-bold text-gray-700 dark:text-gray-300">Items</th>
              <th className="p-5 font-bold text-gray-700 dark:text-gray-300">Status</th>
              <th className="p-5 font-bold text-gray-700 dark:text-gray-300 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {enquiries.map(enq => (
              <tr key={enq.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
                <td className="p-5 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {new Date(enq.created_at).toLocaleDateString()}
                </td>
                <td className="p-5 font-semibold text-gray-900 dark:text-white">{enq.customer_name}</td>
                <td className="p-5 text-gray-700 dark:text-gray-300">{enq.customer_phone}</td>
                <td className="p-5 text-gray-700 dark:text-gray-300 font-medium">{enq.items.length} items</td>
                <td className="p-5">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusUpdate(enq.id, e.target.value as EnquiryStatus)}
                    className={`text-xs font-bold px-3 py-2 rounded-lg border-none outline-none cursor-pointer transition-all ${enq.status === 'New' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50' :
                      enq.status === 'Contacted' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                      }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td className="p-5 text-right">
                  <button
                    onClick={() => setSelectedEnquiry(enq)}
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-2 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 lg:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start mb-6 border-b-2 border-gray-200 dark:border-gray-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enquiry Details</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {selectedEnquiry.id.slice(0, 8)}...</p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border-2 border-blue-100 dark:border-blue-900/30">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Customer Info</h3>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Name:</span> {selectedEnquiry.customer_name}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Email:</span> {selectedEnquiry.customer_email}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Phone:</span> {selectedEnquiry.customer_phone}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Message</h3>
                <p className="bg-white dark:bg-gray-800 p-4 rounded-lg text-sm text-gray-700 dark:text-gray-300 italic border border-gray-200 dark:border-gray-700">
                  "{selectedEnquiry.message || 'No message provided'}"
                </p>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">Product Request</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <tr>
                    <th className="p-4 text-left font-bold text-gray-700 dark:text-gray-200">Product</th>
                    <th className="p-4 text-right font-bold text-gray-700 dark:text-gray-200">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEnquiry.items.map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-4">
                        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                          <img
                            src={item.product.images?.[0] || item.product.image_url || '/placeholder.png'}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{item.product.title}</span>
                      </td>
                      <td className="p-4 text-right font-bold text-blue-700 dark:text-blue-400">{item.quantity} pcs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <a
                href={`mailto:${selectedEnquiry.customer_email}`}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold transition-colors"
              >
                Send Email
              </a>
              <a
                href={`https://wa.me/${selectedEnquiry.customer_phone.replace('+', '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Open WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
