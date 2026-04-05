import { supabase } from './supabase';
import { Product, Category, Enquiry, AdminStats, Settings, EnquiryStatus, ActivityLog } from '../types';

const DEFAULT_SETTINGS: Settings = {
  site_name: 'MalikGarments',
  logo_url: '',
  whatsapp_number: '919876543210',
  phone_numbers: ['919876543210'],
  footer_description: 'Premium wholesale clothing distributor. Supplying quality garments to retailers across the country since 1995. Your trusted partner in fashion wholesale.',
  footer_address: 'New Textile Market, Surat, Gujarat',
  footer_email: 'info@malikgarments.com',
  footer_copyright: `© ${new Date().getFullYear()} MalikGarments Wholesale. All rights reserved.`,
  google_maps_url: '',
  instagram_url: '',
  facebook_url: '',
  youtube_url: ''
};

const logActivity = async (action: string, details: string) => {
  const { error } = await supabase.from('activity_logs').insert([{ action, details }]);
  if (error) console.error('Failed to log activity:', error.message || JSON.stringify(error));
};

export const db = {
  products: {
    list: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error.message || JSON.stringify(error));
        return [];
      }
      return (data || []).map((p: any) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : (p.image_url ? [p.image_url] : [])
      })) as Product[];
    },

    get: async (id: string): Promise<Product | undefined> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error.message || JSON.stringify(error));
        return undefined;
      }
      const product = data as any;
      return {
        ...product,
        images: product.images ? JSON.parse(product.images) : (product.image_url ? [product.image_url] : [])
      } as Product;
    },

    create: async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
      const payload: any = { ...product };
      // Ensure image_url is set for backward compatibility
      if (product.images && product.images.length > 0) {
        payload.image_url = product.images[0];
        payload.images = JSON.stringify(product.images);
      } else {
        payload.images = '[]';
      }

      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      await logActivity('Product Created', `Created product: ${data.title}`);

      return {
        ...data,
        images: product.images || []
      } as Product;
    },

    update: async (id: string, updates: Partial<Product>): Promise<Product | null> => {
      const payload: any = { ...updates };
      // Sync image_url if images are updated
      if (updates.images) {
        if (updates.images.length > 0) {
          payload.image_url = updates.images[0];
        }
        payload.images = JSON.stringify(updates.images);
      }

      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await logActivity('Product Updated', `Updated product: ${data.title}`);

      const result = data as any;
      return {
        ...result,
        images: result.images ? JSON.parse(result.images) : []
      } as Product;
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await logActivity('Product Deleted', `Deleted product ID: ${id}`);
    }
  },

  categories: {
    list: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, image_url, created_at, keywords')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error.message || JSON.stringify(error));
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Ensure all required fields exist and provide defaults
      return data.map(cat => ({
        id: cat.id,
        name: cat.name || 'Unnamed Category',
        image_url: cat.image_url || '', // Removed placeholder
        created_at: cat.created_at,
        keywords: cat.keywords
      })) as Category[];
    },

    get: async (id: string): Promise<Category | undefined> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching category:', error.message || JSON.stringify(error));
        return undefined;
      }
      return data as Category;
    },

    create: async (category: Omit<Category, 'id'>): Promise<Category> => {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      await logActivity('Category Created', `Created category: ${data.name}`);
      return data as Category;
    },

    update: async (id: string, updates: Partial<Category>): Promise<Category | null> => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await logActivity('Category Updated', `Updated category: ${data.name}`);
      return data as Category;
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await logActivity('Category Deleted', `Deleted category ID: ${id}`);
    }
  },

  enquiries: {
    list: async (): Promise<Enquiry[]> => {
      const { data, error } = await supabase
        .from('enquiries')
        .select(`
          *,
          enquiry_items (
            quantity,
            products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching enquiries:', error.message || JSON.stringify(error));
        return [];
      }

      // Transform data to match local Enquiry type structure
      return (data || []).map((e: any) => ({
        ...e,
        items: e.enquiry_items ? e.enquiry_items.map((i: any) => {
          const rawProduct = Array.isArray(i.products) ? i.products[0] : i.products;
          const product = rawProduct ? {
            ...rawProduct,
            images: rawProduct.images ? JSON.parse(rawProduct.images) : (rawProduct.image_url ? [rawProduct.image_url] : [])
          } : null;

          return {
            product,
            quantity: i.quantity
          };
        }).filter((i: any) => i.product) : [] // Filter out items with null products
      })) as Enquiry[];
    },

    create: async (data: Omit<Enquiry, 'id' | 'created_at' | 'status'>): Promise<Enquiry> => {
      // 1. Insert Enquiry
      const { data: newEnquiry, error: enqError } = await supabase
        .from('enquiries')
        .insert([{
          customer_name: data.customer_name,
          customer_email: data.customer_email,
          customer_phone: data.customer_phone,
          message: data.message,
          status: 'New'
        }])
        .select()
        .single();

      if (enqError) throw enqError;

      // 2. Insert Items into enquiry_items
      if (data.items.length > 0) {
        const itemsPayload = data.items.map(item => ({
          enquiry_id: newEnquiry.id,
          product_id: item.product.id,
          quantity: item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('enquiry_items')
          .insert(itemsPayload);

        if (itemsError) {
          console.error('Error inserting enquiry items:', itemsError.message || JSON.stringify(itemsError));
          throw itemsError;
        }
      }

      await logActivity('New Enquiry', `Received enquiry from ${data.customer_name}`);

      return {
        ...newEnquiry,
        items: data.items,
        created_at: newEnquiry.created_at
      } as Enquiry;
    },

    updateStatus: async (id: string, status: EnquiryStatus, notes?: string): Promise<void> => {
      const updates: any = { status };
      if (notes !== undefined) updates.notes = notes;

      const { error } = await supabase
        .from('enquiries')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await logActivity('Enquiry Status Updated', `Enquiry ${id} marked as ${status}`);
    }
  },

  admins: {
    verify: async (password: string): Promise<boolean> => {
      console.log('Verifying admin password against DB...');
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('password', password)
        .limit(1);

      if (error) {
        console.error('Admin verify error:', error.message || JSON.stringify(error));
        return false;
      }

      const isValid = !!(data && data.length > 0);
      console.log('Admin match found:', isValid);
      return isValid;
    }
  },

  settings: {
    get: async (): Promise<Settings> => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error || !data) {
        if (error) console.error('Error fetching settings:', error.message || JSON.stringify(error));
        // Return default settings if table is empty or fetch fails to ensure app doesn't crash
        return DEFAULT_SETTINGS;
      }

      // Parse phone_numbers from JSON string if it exists
      const settings = data as any;
      if (settings.phone_numbers && typeof settings.phone_numbers === 'string') {
        try {
          settings.phone_numbers = JSON.parse(settings.phone_numbers);
        } catch (e) {
          settings.phone_numbers = settings.phone_numbers ? [settings.phone_numbers] : [];
        }
      } else if (!settings.phone_numbers) {
        settings.phone_numbers = [];
      }

      return settings as Settings;
    },

    update: async (updates: Partial<Settings>): Promise<Settings> => {
      // Get existing settings or create if doesn't exist
      const existing = await db.settings.get();

      // Convert phone_numbers array to JSON string for storage
      const updateData: any = { ...existing, ...updates };
      if (updateData.phone_numbers && Array.isArray(updateData.phone_numbers)) {
        updateData.phone_numbers = JSON.stringify(updateData.phone_numbers);
      }

      const { data, error } = await supabase
        .from('settings')
        .upsert([updateData], { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      await logActivity('Settings Updated', 'Site settings were updated');

      // Parse phone_numbers back to array
      const result = data as any;
      if (result.phone_numbers && typeof result.phone_numbers === 'string') {
        try {
          result.phone_numbers = JSON.parse(result.phone_numbers);
        } catch (e) {
          result.phone_numbers = result.phone_numbers ? [result.phone_numbers] : [];
        }
      }

      return result as Settings;
    }
  },

  logs: {
    list: async (): Promise<ActivityLog[]> => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching logs:', error.message || JSON.stringify(error));
        return [];
      }
      return (data || []) as ActivityLog[];
    }
  },

  stats: {
    get: async (): Promise<AdminStats> => {
      const [
        { count: totalProducts, error: err1 },
        { count: totalEnquiries, error: err2 },
        { count: pendingEnquiries, error: err3 },
        { count: comingSoonCount, error: err4 }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'New'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock_status', 'coming_soon')
      ]);

      if (err1 || err2 || err3 || err4) {
        console.error('Error fetching stats:', {
          products: err1?.message,
          enquiries: err2?.message,
          pending: err3?.message,
          stock: err4?.message
        });
        return {
          total_products: 0,
          total_enquiries: 0,
          pending_enquiries: 0,
          coming_soon_count: 0
        };
      }

      return {
        total_products: totalProducts || 0,
        total_enquiries: totalEnquiries || 0,
        pending_enquiries: pendingEnquiries || 0,
        coming_soon_count: comingSoonCount || 0
      };
    }
  }
};