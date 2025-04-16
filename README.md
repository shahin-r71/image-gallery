# Image Gallery

A modern, responsive image gallery application built with Next.js and Material UI that allows users to upload, view, search, and manage images stored in Cloudinary.

## Features

- Responsive image grid with masonry layout
- Image search functionality
- Image preview with detailed view
- Image deletion capability
- Cloud-based storage using Cloudinary
- Modern UI with Material UI components

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Framework**: Material UI 7
- **Styling**: Tailwind CSS 4
- **Image Storage**: Cloudinary
- **Dialog Management**: @toolpad/core

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- Cloudinary account

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/shahin-r71/image-gallery.git
   cd image-gallery
   ```
2. Install dependencies:

   ```
   npm install
   ```
3. Create a `.env.local` file in the root directory with your Cloudinary credentials:

   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
   ```
4. Start the development server:

   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

- **Browse Images**: Scroll through the gallery to view all images
- **Search Images**: Use the search bar in the header to filter images
- **View Details**: Click on any image to open a detailed view
- **Delete Images**: In the detailed view, use the delete option to remove images
