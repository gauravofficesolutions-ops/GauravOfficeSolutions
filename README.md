# Gaurav Office Solutions - Portfolio Website

A modern, responsive portfolio website for Gaurav Office Solutions featuring premium waste bins and packaging solutions.

## 🚀 Features

- **Modern Design**: Clean, professional design with TailwindCSS-inspired styling
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Product Showcase**: Dynamic product grid with filtering and search capabilities
- **Contact Integration**: Direct links to WhatsApp, Instagram, and email
- **PDF Product Extraction**: Automated extraction of product data from PDF catalogs

## 📁 Project Structure

```
my_portfolio/
├── gaurav_solutions/          # Main website files
│   ├── index.html            # Main HTML file
│   ├── style.css             # Custom CSS styles
│   ├── script.js             # JavaScript functionality
│   ├── products.json         # Product data (auto-generated)
│   └── assets/               # Product images (auto-generated)
├── input_pdfs/               # Source PDF files
│   └── Gaurav_Solutions_Combined.pdf
├── scripts/                  # Python extraction scripts
│   ├── extract_products.py   # Main extraction script
│   ├── requirements.txt      # Python dependencies
│   └── run_extraction.sh     # Automated extraction script
└── README.md                 # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- Modern web browser

### Installation

1. **Clone or download the project**
   ```bash
   cd /path/to/my_portfolio
   ```

2. **Install Python dependencies**
   ```bash
   cd scripts
   pip3 install -r requirements.txt
   ```

3. **Run the PDF extraction script**
   ```bash
   # Option 1: Use the automated script
   ./run_extraction.sh
   
   # Option 2: Run directly
   python3 extract_products.py
   ```

4. **Open the website**
   ```bash
   cd ../gaurav_solutions
   # Open index.html in your web browser
   # Or serve with a local server:
   python3 -m http.server 8000
   # Then visit: http://localhost:8000
   ```

## 📊 Extraction Results

The PDF extraction script successfully processed:
- **Total Products**: 845 products extracted
- **Images Extracted**: 845 product images
- **Categories Found**: 8 main categories
  - Dustbins: 135 products
  - Packaging: 102 products
  - Plastic Bags: 48 products
  - Garbage Bags: 21 products
  - Office Stationery: 19 products
  - Floor Protection: 9 products
  - Machinery & Tools: 8 products
  - Other Products: 503 products

## 🎨 Website Features

### Navigation
- **Home**: Hero section with company introduction
- **Products**: Dynamic product grid with filtering
- **About**: Company information and statistics
- **Contact**: Multiple contact methods

### Product Display
- **Responsive Grid**: 1-3 cards per row based on screen size
- **Category Filtering**: Filter by product categories
- **Search Functionality**: Search by product name or description
- **Pagination**: Navigate through large product catalogs
- **Image Optimization**: Lazy loading and error handling

### Contact Integration
- **WhatsApp**: Direct link to chat (98333555184)
- **Instagram**: Social media integration
- **Email**: Direct email link (gauravofficesolutions@gmail.com)
- **Partnership**: Link to Maruti Office India

## 🔧 Customization

### Updating Product Data
1. Place new PDF files in `input_pdfs/` directory
2. Update the PDF path in `scripts/extract_products.py` if needed
3. Run the extraction script: `python3 extract_products.py`
4. Refresh the website to see new products

### Modifying Website Content
- **Company Name**: Update in `index.html` (search for "Gaurav Office Solutions")
- **Contact Information**: Update WhatsApp number and email in `index.html`
- **Styling**: Modify `style.css` for design changes
- **Functionality**: Update `script.js` for behavior changes

### Adding New Categories
1. Update the `categorize_product()` function in `script.js`
2. Add new filter buttons in the HTML
3. Update the category mapping in the extraction script

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: 1200px+ (3 columns)
- **Tablet**: 768px-1199px (2 columns)
- **Mobile**: <768px (1 column)

## 🎯 Performance Features

- **Lazy Loading**: Images load only when needed
- **Pagination**: Large product catalogs are paginated
- **Optimized Images**: PNG format with compression
- **Smooth Animations**: CSS transitions and hover effects
- **Error Handling**: Graceful fallbacks for missing images

## 🔍 Search and Filter

### Search Functionality
- Search by product name
- Search by product description
- Real-time filtering as you type

### Category Filters
- All Products
- Dustbins
- Packaging
- Plastic Bags
- Garbage Bags
- Office Stationery
- Floor Protection
- Machinery & Tools
- Other Products

## 📞 Contact Information

- **WhatsApp**: [98333555184](https://wa.me/919833355184)
- **Email**: [gauravofficesolutions@gmail.com](mailto:gauravofficesolutions@gmail.com)
- **Instagram**: [@your_handle](https://instagram.com/YOUR_HANDLE)
- **Partnership**: [Maruti Office India](http://www.marutiofficeindia.com/)

## 🚀 Deployment

### Local Development
```bash
cd gaurav_solutions
python3 -m http.server 8000
```

### Production Deployment
1. Upload all files to your web server
2. Ensure `products.json` and `assets/` folder are included
3. Configure your web server to serve static files
4. Update any absolute paths if needed

## 🐛 Troubleshooting

### Common Issues

1. **PDF Extraction Fails**
   - Ensure PyMuPDF is installed: `pip3 install PyMuPDF`
   - Check PDF file path in the script
   - Verify PDF is not corrupted

2. **Images Not Loading**
   - Check that `assets/` folder exists and has images
   - Verify image paths in `products.json`
   - Check browser console for errors

3. **Website Not Responsive**
   - Clear browser cache
   - Check CSS file is loading properly
   - Verify viewport meta tag in HTML

### Support
For technical support or questions, contact:
- Email: gauravofficesolutions@gmail.com
- WhatsApp: 98333555184

## 📄 License

© 2025 Gaurav Office Solutions. All rights reserved.

---

**Built with ❤️ for Gaurav Office Solutions**
