import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { defaultKeywords } from '../utils/seo-constants';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
}

export default function SEO({
    title,
    description,
    keywords = [],
    image,
    url
}: SEOProps) {
    const location = useLocation();
    const currentUrl = url || window.location.origin + location.pathname;

    const siteTitle = 'MalikGarments Wholesale';
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || 'Premium wholesale clothing distributor. Supplying quality garments to retailers across the country since 1995.';

    // Combine props keywords with default ones and remove duplicates
    const finalKeywords = Array.from(new Set([...keywords, ...defaultKeywords])).join(', ');

    useEffect(() => {
        // Update Title
        document.title = finalTitle;

        // Helper to update meta tags
        const updateMeta = (name: string, content: string) => {
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Helper to update OG tags (property instead of name)
        const updateOgMeta = (property: string, content: string) => {
            let element = document.querySelector(`meta[property="${property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        updateMeta('description', finalDescription);
        updateMeta('keywords', finalKeywords);

        // Open Graph / Facebook
        updateOgMeta('og:type', 'website');
        updateOgMeta('og:url', currentUrl);
        updateOgMeta('og:title', finalTitle);
        updateOgMeta('og:description', finalDescription);
        if (image) {
            updateOgMeta('og:image', image);
        }

        // Twitter
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:url', currentUrl);
        updateMeta('twitter:title', finalTitle);
        updateMeta('twitter:description', finalDescription);
        if (image) {
            updateMeta('twitter:image', image);
        }

        // Cleanup function not strictly necessary as we overwrite, 
        // but good practice if we were adding/removing nodes dynamically in a complex way.
        // Here we just update attributes which is efficient.

    }, [finalTitle, finalDescription, finalKeywords, image, currentUrl]);

    return null;
}
