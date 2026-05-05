# CVPB (Computer Vision Pipeline Builder) - Vercel Deployment Guide

**Frontend Uygulaması**: React + Vite + OpenCV.js + localStorage

## 🎯 Özellikler

- **Backend Bağımlılığı Yok**: Tamamen browser'da çalışır
- **Offline Çalışır**: Tüm pipelinelar localStorage'da kaydedilir
- **İşleme Hızlı**: Client-side OpenCV ile instant feedback
- **Standalone**: Vercel'de doğrudan deploy edilebilir

## 📦 Lokal Çalıştırma

```bash
cd frontend
npm install
npm run dev
```

Erişim: http://localhost:5173/

## 🚀 Vercel'e Deploy

### Seçenek 1: Vercel CLI (Basit)

```bash
cd frontend
npm install -g vercel
vercel
```

### Seçenek 2: Vercel Web UI (Önerilen)

1. [Vercel Dashboard](https://vercel.com/dashboard) açın
2. **Add New Project** → **Import Git Repository**
3. GitHub repo seçin
4. **Root Directory**: `frontend`
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Deploy** tıklayın ✅

### Seçenek 3: GitHub Integration

1. Repo GitHub'a push edin:
```bash
git push origin main
```

2. Vercel Dashboard'da repo connect edin
3. Otomatik deploy başlar her push'ta

---

## 🔌 Backend Entegrasyonu (Opsiyonel)

Eğer backend API'niz varsa (örn: Railway, Render):

1. **Vercel Environment Variable Ekle**:
   - Dashboard → Settings → Environment Variables
   - `VITE_API_BASE_URL` = `https://your-backend.railway.app`

2. **App.tsx geri dönüştür**:
```bash
cd src
mv App.tsx App.standalone.tsx
mv App.backend.tsx App.tsx
```

3. Redeploy:
```bash
vercel --prod
```

---

## 📱 Özellikler

### 1. Image Upload
- Drag-drop veya file picker
- PNG, JPG, WebP desteği

### 2. CV Operations
- Blur, Edge Detection, Color Conversion
- Morphological Operations
- Custom Filters

### 3. Pipeline Save/Load
- localStorage'da otomatik kaydedilir
- Hiçbir backend gerekli değil
- Browsing history ile sync

### 4. Download Output
- İşlenen görüntüyü PNG olarak indir

---

## 🛠️ Build Komutları

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Lint check
npm run lint
```

---

## 📊 Yapı

```
frontend/
├── src/
│   ├── App.tsx (localStorage kullanır)
│   ├── App.backend.tsx (backend API kullanır - backup)
│   ├── operations.ts (CV işlemleri)
│   ├── main.tsx
│   └── App.css
├── public/
├── vercel.json
├── .env.production
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🌐 Vercel URL Örnekleri

- `https://cvpb.vercel.app`
- `https://cvpb-staging.vercel.app`
- Kendi domain'iniz: Settings → Domains

---

## 📝 Notes

- **localStorage Kapasitesi**: ~5-10MB (çoğu pipeline uygun)
- **OpenCV.js**: CDN'den yüklenir (ilk açılışta 8MB)
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **İnternet Gerekli**: İlk yükleme için, sonra offline çalışır

---

## 🔧 Troubleshooting

### Problem: "OpenCV.js loading" takılı kalıyor
**Çözüm**: CDN bağlantısını kontrol edin, tarayıcı cache'sini temizleyin

### Problem: Pipeline'lar kaydedilmiyor
**Çözüm**: localStorage etkin olduğundan emin olun (Inkognito moddaysa çalışmaz)

### Problem: İşleme çok yavaş
**Çözüm**: Büyük görüntüleri küçültün veya daha az filtre kullanın

---

## 📞 İletişim

GitHub Issues: [Repository Issues](https://github.com/username/repo/issues)

Happy processing! 🎉
