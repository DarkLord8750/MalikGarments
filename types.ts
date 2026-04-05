export type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  image_url: string;
  description: string;
  stock_status: 'in_stock' | 'coming_soon';
  created_at: string;
  // Additional product details
  color?: string;
  size?: string;
  fabric?: string;
  material?: string;
  care_instructions?: string;
  weight?: string;
  dimensions?: string;
  brand?: string;
  sku?: string;
  images: string[];
  keywords?: string;
  video_url?: string;
};

export type Category = {
  id: string;
  name: string;
  image_url: string;
  created_at?: string;
  keywords?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type EnquiryStatus = 'New' | 'Contacted' | 'Closed';

export type Enquiry = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  message: string;
  items: CartItem[];
  status: EnquiryStatus;
  created_at: string;
  notes?: string;
};

export type AdminStats = {
  total_products: number;
  total_enquiries: number;
  pending_enquiries: number;
  coming_soon_count: number;
};

export interface Settings {
  site_name: string;
  logo_url: string;
  whatsapp_number: string; // Single WhatsApp number for messaging
  phone_numbers?: string[]; // Multiple phone numbers for calling
  // Footer content
  footer_description?: string;
  footer_address?: string;
  footer_email?: string;
  footer_copyright?: string;
  // Social Media & External Links
  google_maps_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
}

export type ActivityLog = {
  id: string;
  action: string;
  details: string;
  created_at: string;
};
