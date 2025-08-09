# ClickablePhoto v2 🎨

A modern, high-performance social media card generator built with cutting-edge technologies.

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Image Processing**: Advanced image handling with Sharp
- **Drag & Drop**: Intuitive file upload with react-dropzone
- **Real-time Preview**: Live card preview as you type
- **Database Storage**: Persistent storage with Prisma and SQLite
- **Type Safety**: Full TypeScript support
- **Performance**: Optimized with Next.js 14 App Router
- **Animations**: Smooth interactions with Framer Motion
- **Download**: Direct card download functionality

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma + SQLite
- **Image Processing**: Sharp
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **File Upload**: React Dropzone
- **Icons**: Lucide React

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Initialize database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

1. **Upload an Image**: Drag and drop or click to select an image
2. **Add Details**: Fill in title, description, and destination URL
3. **Choose Size**: Select between Small (600x314) or Large (1200x628)
4. **Preview**: See real-time preview of your card
5. **Generate**: Click "Generate Card" to create and save
6. **Download**: Use the download button to save your card

## 🚀 Deployment

### Vercel (Recommended)

```bash
npx vercel --prod
```

## 📝 Environment Variables

```env
DATABASE_URL="file:./dev.db"
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
```

---

**Built with ❤️ using modern web technologies**
