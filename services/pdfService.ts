import { Product } from '../types';

// A mock PDF generator. In a real app, use 'jspdf' and 'jspdf-autotable'
export const generateCatalogPDF = (products: Product[]) => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Title,Category,Price,Status\n"
    + products.map(p => `"${p.title}","${p.category}",${p.price},"${p.stock_status === 'coming_soon' ? 'Coming Soon' : ''}"`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "malik_garments_catalog.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert("Catalog downloaded as CSV (PDF generation requires large libraries, using CSV for demo)");
};
