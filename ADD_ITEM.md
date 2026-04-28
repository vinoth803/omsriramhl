# Adding New Items to Saree Catalog

This guide explains how to add new saree items to the e-commerce catalog, including image preparation and code changes.

## Overview

To add a new saree item, you need to:
1. Prepare and add the saree image
2. Update the backend product database
3. No frontend code changes required (auto-generated from backend data)

## Step 1: Prepare the Saree Image

### Image Requirements
- **Format**: JPEG, PNG, or WebP
- **Size**: Minimum 800x800px, Maximum 2000x2000px
- **Aspect Ratio**: Square (1:1) or Portrait (3:4) preferred
- **File Size**: Under 2MB for optimal loading
- **Quality**: High resolution, clear product visibility

### Image Naming Convention
- Use descriptive names without special characters
- Example: `elegant-red-silk-saree.jpg` instead of `WhatsApp Image 2026-04-27 at 07.12.47.jpeg`
- Avoid spaces, use hyphens or underscores
- Keep names under 50 characters

## Step 2: Add Image Files

### Backend Image Location
Copy your saree image to both locations:

```bash
# Copy to backend (required for serving images)
copy "path\to\your\saree-image.jpg" "c:\website-host\backend\public\sarees\"

# Copy to frontend (optional, for backup)
copy "path\to\your\saree-image.jpg" "c:\website-host\frontend\public\sarees\"
```

### Using PowerShell:
```powershell
Copy-Item "path\to\your\saree-image.jpg" "c:\website-host\backend\public\sarees\" -Force
Copy-Item "path\to\your\saree-image.jpg" "c:\website-host\frontend\public\sarees\" -Force
```

## Step 3: Update Backend Product Database

### Location
File: `c:\website-host\backend\server.js`

### Find the Products Object
Look for the `products` object (around line 25):

```javascript
const products = {
  '1': {
    id: '1',
    name: 'Elegant Silk Saree - Red & Gold',
    // ... existing products
  },
  // Add new product here
};
```

### Add New Product Entry

Add a new product entry with the next sequential ID:

```javascript
const products = {
  // ... existing products ...
  '11': {
    id: '11',                                    // Sequential ID (string)
    name: 'Your Saree Name',                     // Display name (50 chars max)
    price: 2500,                                 // Price in INR (number)
    description: 'Detailed description of the saree, highlighting fabric, design, and occasion suitability',
    image: 'your-saree-image.jpg',              // Filename only (no path)
    category: 'saree',                           // Always 'saree'
    fabric: 'Silk',                             // Fabric type
    color: 'Red & Gold'                         // Color description
  }
};
```

### Product Field Guidelines

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Sequential number as string | `'11'`, `'12'`, `'13'` |
| `name` | String | Display name (max 50 chars) | `'Elegant Banarasi Saree'` |
| `price` | Number | Price in Indian Rupees | `3500`, `1200`, `5000` |
| `description` | String | Detailed description (max 200 chars) | `'Beautiful silk saree with...'` |
| `image` | String | Filename only (no path/URL) | `'banarasi-silk-saree.jpg'` |
| `category` | String | Always use `'saree'` | `'saree'` |
| `fabric` | String | Fabric type | `'Silk'`, `'Cotton'`, `'Chiffon'` |
| `color` | String | Color description | `'Red & Gold'`, `'Blue'` |

### Price Guidelines
- **Cotton Sarees**: ₹1,200 - ₹2,500
- **Silk Sarees**: ₹2,500 - ₹4,000
- **Designer/Premium**: ₹4,000 - ₹8,000
- **Wedding/Bridal**: ₹5,000 - ₹15,000

## Step 4: Restart Backend Server

After adding the new product, restart the backend server:

```bash
# Navigate to backend directory
cd c:\website-host\backend

# Stop existing server (if running)
# Press Ctrl+C in the terminal running the server

# Start server again
node server.js
```

Or using PowerShell:
```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Restart backend
cd c:\website-host\backend
node server.js
```

## Step 5: Verify Addition

### Check Backend API
Test if the new product is accessible:
```bash
curl "http://localhost:5001/api/product/11"
```

### Check Image Serving
Test if the image is being served:
```bash
curl -I "http://localhost:5001/sarees/your-saree-image.jpg"
```

### Frontend Verification
1. Open `http://localhost:3001` in browser
2. New saree should appear in the grid
3. Click on the new saree to test detail page
4. Test add to cart functionality

## Example: Complete Addition Process

### 1. Prepare Image
- Original: `IMG_20240427_wedding_saree.jpg`
- Renamed: `golden-wedding-saree.jpg`
- Resized: 1200x1200px, 800KB

### 2. Copy Image
```powershell
Copy-Item "C:\Downloads\golden-wedding-saree.jpg" "c:\website-host\backend\public\sarees\" -Force
```

### 3. Add Product (in server.js)
```javascript
'11': {
  id: '11',
  name: 'Golden Wedding Saree',
  price: 7500,
  description: 'Exquisite golden silk saree with heavy zari work, perfect for weddings and grand celebrations',
  image: 'golden-wedding-saree.jpg',
  category: 'saree',
  fabric: 'Pure Silk',
  color: 'Golden'
}
```

### 4. Restart Server
```bash
cd c:\website-host\backend
node server.js
```

### 5. Test
- API: `http://localhost:5001/api/product/11`
- Image: `http://localhost:5001/sarees/golden-wedding-saree.jpg`
- Frontend: `http://localhost:3001` (should show new item)

## Troubleshooting

### Image Not Loading
1. Check if image exists in `backend\public\sarees\`
2. Verify filename matches exactly (case-sensitive)
3. Ensure image format is supported (JPG, PNG, WebP)
4. Check image file size (under 2MB)

### Product Not Showing
1. Verify JSON syntax in `products` object
2. Check for trailing commas
3. Ensure ID is unique and sequential
4. Restart backend server after changes

### 404 Error on Product Page
1. Check if product ID exists in products object
2. Verify ID format (string, not number)
3. Check for typos in product data

## Best Practices

### Image Optimization
- Use online tools like TinyPNG for compression
- Maintain aspect ratio during resizing
- Use descriptive filenames for SEO

### Product Data Quality
- Write compelling descriptions (100-200 characters)
- Use consistent fabric naming (`Silk` not `silk` or `SILK`)
- Price competitively within market ranges
- Include care instructions in descriptions

### Testing Checklist
- [ ] Image loads on catalog page
- [ ] Product detail page displays correctly
- [ ] Add to cart functionality works
- [ ] Price displays properly
- [ ] Description is readable and complete
- [ ] Image has fallback (saree emoji) if loading fails

## File Structure Reference

```
c:\website-host\
├── backend\
│   ├── public\
│   │   └── sarees\          # ← Add images here
│   │       ├── saree1.jpg
│   │       └── new-saree.jpg
│   └── server.js            # ← Update products object
├── frontend\
│   ├── public\
│   │   └── sarees\          # ← Optional backup location
│   └── pages\
│       ├── index.js         # Auto-updates from API
│       └── product\[id].js  # Auto-updates from API
└── ADD_ITEM.md             # ← This guide
```

## Support

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Verify backend server is running on port 5001
3. Check network tab for failed image/API requests
4. Ensure all file paths use forward slashes (`/`)

---

**Note**: The frontend automatically updates when new products are added to the backend - no frontend code changes are required!
