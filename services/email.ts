import emailjs from '@emailjs/browser';
import { CartItem } from '../types';

// EmailJS Configuration
// NOTE: Make sure to create a template in EmailJS dashboard with these variable names
const SERVICE_ID = 'service_xt9xjti';
const PUBLIC_KEY = 'SNHxqip2p88izevJM';
const TEMPLATE_ID = 'template_go3v917';

export const sendEnquiryEmail = async (
    formData: { name: string; email: string; phone: string; message: string },
    cart: CartItem[]
) => {
    try {
        // Format cart items for email
        const itemsList = cart.map(item =>
            `- ${item.product.title} (${item.quantity} pcs) - Price: ₹${item.product.price}`
        ).join('\n');

        const totalValue = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        const templateParams = {
            to_name: 'Admin', // This goes to zubermalik.07860@gmail.com (configured in EmailJS dashboard)
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            message: formData.message,
            items_list: itemsList,
            total_value: `₹${totalValue.toLocaleString()}`,
            reply_to: formData.email,
        };

        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );

        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        // We don't throw here to avoid blocking the user flow if email service fails
        // The enquiry is already saved to DB by this point
        return null;
    }
};
