# 🛍️ Pazaryeri MCP Server

**🌍 Languages:** [English](README.en.md) | [Türkçe](README.md)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-FF6B35?style=for-the-badge&logo=anthropic&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Protocol-blue?style=for-the-badge)

<img src="assets/mcp.gif" alt="MCP Server Demo" width="800"/>

## 🔗 İlgili Proje

Bu MCP server, **[Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri)** projesi için özel olarak geliştirilmiştir. Ana pazaryeri uygulaması Vue.js ve TypeScript ile geliştirilmiş modern bir e-ticaret platformudur ve bu MCP server sayesinde Claude Desktop üzerinden ürün yönetimi yapılabilir.

### Proje Bileşenleri:
- 🏪 **Ana Pazaryeri Uygulaması**: [Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri) (Vue.js + TypeScript)
- 🤖 **Claude MCP Server**: Bu proje - Pazaryeri API'si ile etkileşim için

## ✨ Özellikler

### 🎯 **Akıllı Filtreler**
- 💰 **Fiyat Aralığı Filtresi** - Belirli fiyat aralığındaki ürünleri bulun
- 📦 **Stok Seviyesi Filtresi** - Düşük/yüksek stoklu ürünleri görüntüleyin
- 🏷️ **Marka & Kategori Filtresi** - Çoklu filtre desteği
- ⭐ **Öne Çıkan Ürünler** - Featured ürünleri listeleyin

### 🛍️ **Alışveriş Asistanı**
- 💡 **Bütçe Önerileri** - Belirli bütçeye göre en iyi ürün kombinasyonları
- 🤖 **Kişisel Shopping Asistanı** - AI destekli akıllı ürün önerileri
- 🎁 **Hediye Önerileri** - Otomatik hediye önerisi motoru
- 📊 **Bütçe Analizi** - Harcama analizi ve optimizasyon

### 🔍 **Gelişmiş Arama**
- 🕵️ **Semantik Arama** - Akıllı anahtar kelime tanıma
- 📋 **Kategori Bazlı Filtreleme** - Hızlı kategori navigasyonu
- 🏪 **Mağaza Bazlı Listeleme** - Mağazalara göre ürün görüntüleme

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+ 
- Claude Desktop uygulaması
- [Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri) backend API'niz (localhost:3000/api/product)

### 1. 📥 Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/your-username/pazaryeri-mcp.git
cd pazaryeri-mcp

# Bağımlılıkları yükleyin
npm install

# Projeyi build edin
npm run build
```

### 2. ⚙️ Claude Desktop Konfigürasyonu

Claude Desktop konfigürasyon dosyanızı düzenleyin:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "pazaryeri-mcp": {
      "command": "node",
      "args": ["/path/to/pazaryeri-mcp/build/index.js"],
      "env": {}
    }
  }
}
```

### 3. 🔄 Claude Desktop'ı Yeniden Başlatın

Claude Desktop'ı kapatıp tekrar açın. Artık Pazaryeri MCP Server'ı kullanabilirsiniz!

## 💬 Kullanım Örnekleri

### 🎯 Akıllı Filtreler

```bash
# Fiyat aralığı filtreleme
"1000-5000 TL arası ürünleri göster"

# Stok durumu kontrolü  
"Düşük stoklu ürünleri bul"
"Stoksuz ürünleri listele"

# Marka + kategori kombinasyonu
"Apple telefon ürünleri"
"Samsung bilgisayar ürünleri"

# Öne çıkan ürünler
"Featured ürünleri göster"
```

### 🛍️ Alışveriş Asistanı

```bash
# Bütçe bazlı öneriler
"3000 TL bütçemle hangi ürünleri alabilirim?"
"5000 TL telefon kategorisinde öneri"

# Kişisel shopping asistanı
"Gaming için laptop öner"
"Erkek arkadaşıma hediye öner" 
"Mutfak yenileme ürünleri"
"Ev dekorasyonu için öneriler"
```

### 🔍 Temel Arama

```bash
# Genel arama
"iPhone ara"
"Apple ürünlerini göster"

# Kategori bazlı
"Telefon kategorisindeki ürünler"
"Mutfak ürünleri"

# Tüm ürünler
"Pazaryeri'ndeki tüm ürünleri göster"
```

## 🛠️ API Referansı

### Mevcut Araçlar

| Araç | Açıklama | Parametreler |
|------|----------|-------------|
| `get-products` | Tüm ürünleri listeler | - |
| `search-products` | Ürün arama | `query: string` |
| `get-product-by-category` | Kategoriye göre filtreler | `category: string` |
| `filter-by-price-range` | Fiyat aralığı filtresi | `minPrice: number, maxPrice: number` |
| `filter-by-stock-level` | Stok seviyesi filtresi | `stockLevel: "low"\|"medium"\|"high"\|"out_of_stock"` |
| `filter-by-brand-and-category` | Marka + kategori filtresi | `brand: string, category: string` |
| `filter-featured-products` | Öne çıkan ürünler | - |
| `budget-based-recommendations` | Bütçe önerileri | `budget: number, category?: string` |
| `personal-shopper` | Kişisel alışveriş asistanı | `need: string, budget?: number` |

### Örnek API Yanıtı

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vatPrice: number;
  stock: number;
  brand: { name: string };
  categories: Array<{
    category: {
      parent: { name: string }
    }
  }>;
  variants: Array<{
    name: string;
    price: number;
    stock: number;
  }>;
  attributes: Array<{
    name: string;
    value: string;
  }>;
}
```

## 🏗️ Geliştirme

### Development Mode

```bash
# TypeScript watch mode
npm run dev

# Build
npm run build

# Linting
npm run lint
```

### Yeni Özellik Ekleme

1. `src/index.ts` dosyasında `capabilities.tools` array'ine yeni aracı ekleyin
2. `server.tool()` ile implementasyonu yazın
3. Projeyi build edin: `npm run build`
4. Claude Desktop'ı yeniden başlatın

## 🔧 Konfigürasyon

### API Endpoint

Bu MCP server, [Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri) projesinin backend API'si ile çalışacak şekilde tasarlanmıştır. Varsayılan olarak `http://localhost:3000/api/product` adresini kullanır. 

Farklı bir endpoint kullanmak için:

```typescript
// src/index.ts içinde
const API_ENDPOINT = "https://your-api.com/products";
```

**Not:** API endpoint'in [Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri) backend'inin API yapısına uygun olması gerekmektedir.

### Özelleştirme

- Fiyat formatları `formatProduct()` fonksiyonunda düzenlenebilir
- Stok seviyeleri `filter-by-stock-level` aracında değiştirilebilir
- Kişisel alışveriş asistanı anahtar kelimeleri `personal-shopper` aracında güncellenebilir


## 📞 İletişim

- 📧 Email: bekiryilmaz594@gmail.com
- 💼 LinkedIn: [Bekir Berke Yılmaz](linkedin.com/in/bekir-berke)

---

⭐ **Bu projeyi beğendiyseniz, yıldız vermeyi unutmayın!**

![Star History](https://img.shields.io/github/stars/username/pazaryeri-mcp?style=social) 