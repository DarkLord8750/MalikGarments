import { supabase } from './supabase';

export const storage = {
    uploadImage: async (file: File): Promise<string> => {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading image:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};
