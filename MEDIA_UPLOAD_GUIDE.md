# Media Upload Feature

## Overview
The WYSIWYG editor now supports uploading images, videos, and other media files.

## Features
- **Image Upload**: Upload JPG, PNG, GIF, WebP images
- **Video Upload**: Upload MP4, WebM, OGG videos
- **Document Upload**: Upload PDF, DOC, DOCX files
- **Image from URL**: Add images directly from a URL
- **File Size Limit**: 10MB per file

## How to Use

### Upload Files
1. Click the "📁 Upload" button in the editor toolbar
2. Select an image, video, or document from your computer
3. The file will be uploaded and inserted into the editor

### Add Image from URL
1. Click the "🖼️ Image URL" button
2. Enter the image URL in the prompt
3. The image will be inserted into the editor

## Supported File Types
- **Images**: .jpg, .jpeg, .png, .gif, .webp
- **Videos**: .mp4, .webm, .ogg
- **Documents**: .pdf, .doc, .docx

## Technical Details
- Files are stored in `backend/uploads/` directory
- Uploaded files are served at `/uploads/:filename`
- Uses Multer for file handling on the backend
- TipTap Image extension for image rendering
- Videos and documents are inserted as HTML elements

## API Endpoint
```
POST /api/upload
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "url": "/uploads/filename.jpg",
  "filename": "original-name.jpg",
  "size": 12345,
  "mimetype": "image/jpeg"
}
```
