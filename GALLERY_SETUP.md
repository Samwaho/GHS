# Gallery Setup Instructions

## Overview
A complete gallery system has been added to your spa application with the following features:

### Features Added:
1. **Admin Gallery Management**
   - Upload images using Uploadcare
   - Add titles and descriptions
   - Reorder gallery items
   - Toggle active/inactive status
   - Delete gallery items

2. **Public Gallery Display**
   - Responsive grid layout
   - Lightbox modal for full-size viewing
   - Navigation between images
   - Loading states and empty states

3. **Database Integration**
   - New Gallery model in Prisma schema
   - Migration created and applied
   - tRPC procedures for CRUD operations

## Setup Instructions

### 1. Environment Variables
Add the following to your `.env` file:

```env
# Uploadcare Configuration
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY="your-uploadcare-public-key"
UPLOADCARE_SECRET_KEY="your-uploadcare-secret-key"
```

### 2. Get Uploadcare Keys
1. Go to [Uploadcare](https://uploadcare.com/)
2. Sign up for a free account
3. Create a new project
4. Get your Public Key and Secret Key from the project settings
5. Add them to your `.env` file

### 3. Access the Gallery

#### Admin Access:
1. Login as an admin user
2. Go to `/admin`
3. Click on the "Gallery" tab
4. Start uploading and managing images

#### Public Access:
- Visit `/gallery` to see the public gallery
- Gallery link is added to the main navigation

### 4. File Structure Added:

```
├── components/
│   ├── admin/
│   │   └── GalleryManager.tsx          # Admin gallery management
│   └── gallery/
│       └── GalleryGrid.tsx             # Public gallery display
├── app/
│   └── gallery/
│       └── page.tsx                    # Public gallery page
├── lib/
│   └── uploadcare.ts                   # Uploadcare configuration
├── prisma/
│   └── schema.prisma                   # Updated with Gallery model
└── trpc/routers/
    ├── admin.ts                        # Gallery admin procedures
    └── public.ts                       # Gallery public procedures
```

### 5. Database Changes:
- New `Gallery` table with fields:
  - `id`: Unique identifier
  - `title`: Image title
  - `description`: Optional description
  - `imageUrl`: Uploadcare image URL
  - `imageUuid`: Uploadcare UUID for management
  - `order`: Display order
  - `isActive`: Visibility toggle
  - `createdAt`, `updatedAt`: Timestamps

### 6. Features:

#### Admin Features:
- ✅ Upload images with Uploadcare widget
- ✅ Add titles and descriptions
- ✅ Toggle active/inactive status
- ✅ Delete gallery items
- ✅ Reorder items (basic structure ready)
- ✅ Preview images in admin

#### Public Features:
- ✅ Responsive grid layout
- ✅ Lightbox modal for full-size viewing
- ✅ Navigation between images in lightbox
- ✅ Loading states
- ✅ Empty state handling

### 7. Next Steps:
1. Set up your Uploadcare account and add the API keys
2. Test the gallery functionality
3. Optionally add drag-and-drop reordering in admin
4. Customize the gallery styling to match your brand

### 8. Uploadcare Configuration:
The system is configured with these Uploadcare settings:
- Image-only uploads
- Crop functionality
- Image effects (rotate, mirror, flip, enhance, etc.)
- Automatic image compression
- Maximum size: 2048x2048px
- Multiple upload tabs: file, camera, URL

### 9. Image Transformations:
Pre-configured image sizes:
- Thumbnail: 300x200
- Medium: 600x400
- Large: 1200x800
- Gallery: 400x300
- Hero: 1920x1080

All images are automatically optimized and served via Uploadcare's CDN.
