# CVPB Web App

Computer Vision Pipeline Builder (MVP) web uygulamasi.

## Canli Demo

- Uygulama: https://cvpb-frontend-25c2uz62w-buyukeren53-2077s-projects.vercel.app/

## README'de Gorsel / GIF Kullanimi

README icine dogrudan gorsel eklemek icin medyayi repoya koyup markdown ile referans vermek en temiz yontemdir.

1. Ornek medya dosyanizi repoya ekleyin (onerilen klasor: `assets/readme/`).
2. README icine asagidaki satiri ekleyin:

```md
![CVPB Demo](assets/readme/cvpb-demo.gif)
```

PNG/JPG ekran goruntusu eklemek isterseniz:

```md
![CVPB Ekran Goruntusu](assets/readme/cvpb-screenshot.png)
```

Not: GIF dosyasi buyukse (ozellikle 10MB+), `ffmpeg` ile optimize edip eklemeniz tavsiye edilir.

Kullanici bir goruntu yukler, pipeline adimlari ekler (Grayscale, Blur, Canny), sonucu canvas uzerinde anlik gorur ve pipeline tanimini backend'e kaydedebilir.

## Mimari

- Frontend: React + TypeScript + OpenCV.js + HTML5 Canvas
- Compute: Browser icinde OpenCV.js (WASM)
- Backend: ASP.NET Core Web API + EF Core + PostgreSQL

## MVP Ozellikleri

- Image upload
- Pipeline bar (adim ekleme/silme, tum operasyonlarda parametre düzenleme)
- Deterministic full recompute (orijinal goruntuden tekrar calistirma)
- OpenCV.js ile client-side processing
- Client-side output download
- Pipeline kaydet / listele / yukle / sil

## Desteklenen Operations

Temel görüntü dönüşümleri, filtreler, kenar/kontur adımları, eşikleme, morfolojik işlemler, şekil çizme, geometri/dönüşüm ve ROI/maskeleme adımları dahil geniş bir set eklendi. Başlangıçta `cvtColor` seçildiğinde default olarak grayscale gelir; kullanıcı aynı adım içinde farklı renk uzaylarını seçebilir.

## Proje Yapisi

- frontend: React uygulamasi
- backend: ASP.NET Core Web API

## Kurulum

Bu proje icin en pratik kurulum yolu PostgreSQL'i Docker ile calistirmaktir. Elle SQL kurmak isterseniz asagidaki adimlarda gerekli isimlendirmeler de verilmis durumda.

Not: `dotnet` sistem PATH'inde yoksa sorun degil; repo kurulumunda kullanilan lokal SDK [dotnet-install.sh](dotnet-install.sh) ile `~/.dotnet` altina kuruludur.

### 1) Gereksinimler

- Node.js 20+
- npm 10+
- .NET SDK 8+
- Docker Desktop / Docker Engine
- PostgreSQL 14+ (opsiyonel, Docker kullanmayacaksaniz)

### 2) .NET SDK (sudo olmadan, opsiyonel)

Bu repo gelistirilirken yerel kullanici klasorune kurulum ile test edildi:

```bash
curl -fsSL https://dot.net/v1/dotnet-install.sh -o dotnet-install.sh
bash dotnet-install.sh --channel 8.0 --install-dir "$HOME/.dotnet"
export PATH="$HOME/.dotnet:$PATH"
```

### 3) PostgreSQL hazirlama

Varsayilan isimlendirme:

- Veritabani adi: `cvpb`
- Kullanici adi: `postgres`
- Parola: `postgres`

#### Secenek A: Docker Compose ile

Repo kokunde sunulan [docker-compose.yml](docker-compose.yml) dosyasi PostgreSQL'i hazirlar.

```bash
docker compose up -d postgres
```

Durumu kontrol etmek icin:

```bash
docker compose ps
```

#### Secenek B: Elle PostgreSQL kurulumu

Eger yerel PostgreSQL kullanacaksaniz, su komutlarla veritabani ve kullaniciyi olusturabilirsiniz:

```sql
CREATE DATABASE cvpb;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE cvpb TO postgres;
```

Backend ilk calistiginda tabloyu otomatik olusturur. Isterseniz SQL baslangic dosyasini [sql/init.sql](sql/init.sql) olarak da kullanabilirsiniz.

Backend varsayilan baglanti dizesi:

```json
"ConnectionStrings": {
	"DefaultConnection": "Host=localhost;Port=5432;Database=cvpb;Username=postgres;Password=postgres"
}
```

Bu degeri [backend/appsettings.json](backend/appsettings.json) dosyasindan ihtiyaciniza gore degistirebilirsiniz.

### 4) Frontend ortam degiskeni

[frontend/.env.example](frontend/.env.example) dosyasini [frontend/.env](frontend/.env) olarak kopyalayin:

```bash
cd frontend
cp .env.example .env
```

## Calistirma

Sira su sekilde olmalidir:

1. PostgreSQL'i calistirin.
2. Backend'i calistirin.
3. Frontend'i calistirin.

Iki terminal acin.

### Terminal 1: Backend

```bash
bash scripts/run-backend.sh
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173  
Backend Swagger: http://localhost:5080/swagger

## Hızlı Baslatma

Eger Docker kullaniyorsaniz, tipik akis su sekildedir:

```bash
docker compose up -d postgres
cd backend
export PATH="$HOME/.dotnet:$PATH"
dotnet restore
dotnet run --urls http://localhost:5080
cd ../frontend
npm install
npm run dev
```

## API Endpointleri

- POST /api/pipelines
- GET /api/pipelines
- GET /api/pipelines/{id}
- DELETE /api/pipelines/{id}

POST body ornegi:

```json
{
	"name": "Edge Pipeline",
	"pipeline": [
		{ "type": "grayscale" },
		{ "type": "blur", "params": { "ksize": 5 } },
		{ "type": "canny", "params": { "t1": 100, "t2": 200 } }
	]
}
```

## PostgreSQL'i Inceleme

Evet, pipeline kayitlari PostgreSQL'e yaziliyor. Kayitlar [backend/Controllers/PipelinesController.cs](backend/Controllers/PipelinesController.cs) icindeki `SaveChangesAsync` cagrisi ile DB'ye gider ve [backend/Data/AppDbContext.cs](backend/Data/AppDbContext.cs) icinde tanimli `Pipelines` tablosunda saklanir.

Docker Compose ile calistiriyorsaniz iceri girip sorgu atabilirsiniz:

```bash
docker exec -it cvpb-postgres psql -U postgres -d cvpb
```

Psql icinde ornek sorgular:

```sql
\dt
SELECT * FROM "Pipelines" ORDER BY "CreatedAt" DESC;
SELECT "Id", "Name", "CreatedAt" FROM "Pipelines";
```

Kayit dogrulamanin en hizli yolu da frontend'den Save yaptiktan sonra su endpointi kontrol etmektir:

```bash
curl http://localhost:5080/api/pipelines
```

Not: Docker volume kullanildigi icin container silinmedigi surece veriler kalici olur.

## Notlar

- OpenCV.js memory yonetimi icin her pipeline calismasinda Mat nesneleri delete edilerek temizlenir.
- Islem adimlarinda hata olusursa ilgili adim UI'da isaretlenir.
- MVP'de cache yoktur, her degisiklikte pipeline bastan calisir.
- PostgreSQL baslamadan backend acilmaz; bu durumda `127.0.0.1:5432 connection refused` alirsiniz.
