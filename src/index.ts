#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({
    name: "pazaryeri-mcp",
    version: "1.0.0",
    description: "Pazaryeri MCP Server",
    capabilities: {
        tools: [
            {
                name: "get-products",
            },
            {
                name: "search-products",
            },
            {
                name: "get-product-by-category",
            },
            {
                name: "filter-by-price-range",
            },
            {
                name: "filter-by-stock-level",
            },
            {
                name: "filter-by-brand-and-category",
            },
            {
                name: "filter-featured-products",
            },
            {
                name: "budget-based-recommendations",
            },
            {
                name: "personal-shopper",
            }
        ]
    }
})

function formatProduct(product: any): string {
  const basePrice = product.price?.toLocaleString('tr-TR') || 'N/A';
  const vatPrice = product.vatPrice?.toLocaleString('tr-TR') || 'N/A';
  
  let result = `
🛍️ **${product.name}**
📝 ${product.description}
🏷️ Marka: ${product.brand?.name || 'N/A'}
💰 Fiyat: ${basePrice} TL (KDV Hariç) / ${vatPrice} TL (KDV Dahil)
📦 Stok: ${product.stock}
🏪 Mağaza: ${product.store?.name || 'N/A'}
📋 SKU: ${product.sku}

`;

  if (product.variants && product.variants.length > 0) {
    result += "🔄 **Varyantlar:**\n";
    product.variants.forEach((variant: any) => {
      result += `   • ${variant.name} - ${variant.price?.toLocaleString('tr-TR')} TL (Stok: ${variant.stock})\n`;
    });
    result += "\n";
  }

  if (product.attributes && product.attributes.length > 0) {
    result += "⚙️ **Özellikler:**\n";
    product.attributes.forEach((attr: any) => {
      result += `   • ${attr.name}: ${attr.value}\n`;
    });
    result += "\n";
  }

  if (product.categories && product.categories.length > 0) {
    const category = product.categories[0]?.category?.parent;
    if (category) {
      result += `📂 Kategori: ${category.name}\n`;
    }
  }

  result += "---\n";
  return result;
}

server.tool("get-products",
    {
      description: "Pazaryeri'nden tüm ürünleri getirir ve güzel formatta sunar",
    },
    async ({}) => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: "Henüz hiç ürün bulunamadı." 
            }]
          };
        }

        let formattedOutput = `# Pazaryeri Ürünleri (${data.items.length} ürün)\n\n`;
        
        data.items.forEach((product: any) => {
          formattedOutput += formatProduct(product);
        });

        if (data.meta) {
          formattedOutput += `\n📊 **Sayfa Bilgisi:** ${data.meta.page}/${data.meta.pages} - Toplam: ${data.meta.total} ürün`;
        }
        
        return {
          content: [{ 
            type: "text", 
            text: formattedOutput
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Ürünler getirilirken hata oluştu: ${error instanceof Error ? error.message : String(error)}` 
          }]
        };
      }
    }
  );

server.tool("search-products",
    {
      description: "Pazaryeri'nde ürün adına göre arama yapar",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Aranacak ürün adı veya kelime"
          }
        },
        required: ["query"]
      }
    },
    async ({ query }) => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items) {
          return {
            content: [{ 
              type: "text", 
              text: "Ürün verileri alınamadı." 
            }]
          };
        }

        const filteredProducts = data.items.filter((product: any) => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.brand?.name.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredProducts.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `"${query}" araması için hiç ürün bulunamadı.` 
            }]
          };
        }

        let formattedOutput = `# "${query}" Arama Sonuçları (${filteredProducts.length} ürün)\n\n`;
        
        filteredProducts.forEach((product: any) => {
          formattedOutput += formatProduct(product);
        });
        
        return {
          content: [{ 
            type: "text", 
            text: formattedOutput
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Arama yapılırken hata oluştu: ${error instanceof Error ? error.message : String(error)}` 
          }]
        };
      }
    }
  );

server.tool("get-product-by-category",
    {
      description: "Pazaryeri'nde kategoriye göre ürünleri filtreler",
      inputSchema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "Kategori adı (örn: Telefon, Bilgisayar, Mutfak, Mobilya, Giyim)"
          }
        },
        required: ["category"]
      }
    },
    async ({ category }) => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items) {
          return {
            content: [{ 
              type: "text", 
              text: "Ürün verileri alınamadı." 
            }]
          };
        }

        const filteredProducts = data.items.filter((product: any) => {
          if (!product.categories || product.categories.length === 0) return false;
          
          const productCategory = product.categories[0]?.category?.parent?.name;
          return productCategory && productCategory.toLowerCase().includes(category.toLowerCase());
        });

        if (filteredProducts.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `"${category}" kategorisinde hiç ürün bulunamadı.\n\nMevcut kategoriler: Telefon, Bilgisayar, Giyilebilir Teknoloji, Mutfak, Mobilya, Erkek Giyim, Kadın Giyim, TV & Ses Sistemleri` 
            }]
          };
        }

        let formattedOutput = `# ${category} Kategorisi (${filteredProducts.length} ürün)\n\n`;
        
        filteredProducts.forEach((product: any) => {
          formattedOutput += formatProduct(product);
        });
        
        return {
          content: [{ 
            type: "text", 
            text: formattedOutput
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Kategori filtreleme yapılırken hata oluştu: ${error instanceof Error ? error.message : String(error)}` 
          }]
        };
      }
    }
  );

server.tool("filter-by-price-range",
    {
      description: "Belirtilen fiyat aralığındaki ürünleri filtreler",
      inputSchema: {
        type: "object",
        properties: {
          minPrice: {
            type: "number",
            description: "Minimum fiyat (TL)"
          },
          maxPrice: {
            type: "number", 
            description: "Maksimum fiyat (TL)"
          }
        },
        required: ["minPrice", "maxPrice"]
      }
    },
    async ({ minPrice, maxPrice }) => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items) {
          return {
            content: [{ 
              type: "text", 
              text: "Ürün verileri alınamadı." 
            }]
          };
        }

        const filteredProducts = data.items.filter((product: any) => {
          const price = product.vatPrice || product.price;
          return price >= minPrice && price <= maxPrice;
        });

        if (filteredProducts.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `${minPrice.toLocaleString('tr-TR')} - ${maxPrice.toLocaleString('tr-TR')} TL aralığında hiç ürün bulunamadı.` 
            }]
          };
        }

        filteredProducts.sort((a: any, b: any) => {
          const priceA = a.vatPrice || a.price;
          const priceB = b.vatPrice || b.price;
          return priceA - priceB;
        });

        let formattedOutput = `# 💰 ${minPrice.toLocaleString('tr-TR')} - ${maxPrice.toLocaleString('tr-TR')} TL Aralığındaki Ürünler (${filteredProducts.length} ürün)\n\n`;
        
        filteredProducts.forEach((product: any) => {
          formattedOutput += formatProduct(product);
        });
        
        return {
          content: [{ 
            type: "text", 
            text: formattedOutput
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Fiyat filtresi uygulanırken hata oluştu: ${error instanceof Error ? error.message : String(error)}` 
          }]
        };
      }
    }
  );

server.tool("filter-by-stock-level",
    {
      description: "Stok durumuna göre ürünleri filtreler",
      inputSchema: {
        type: "object",
        properties: {
          stockLevel: {
            type: "string",
            enum: ["low", "medium", "high", "out_of_stock"],
            description: "Stok seviyesi: low (0-20), medium (21-50), high (50+), out_of_stock (0)"
          }
        },
        required: ["stockLevel"]
      }
    },
    async ({ stockLevel }) => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items) {
          return {
            content: [{ 
              type: "text", 
              text: "Ürün verileri alınamadı." 
            }]
          };
        }

        // Stok seviyesine göre filtrele
        const filteredProducts = data.items.filter((product: any) => {
          const stock = product.stock || 0;
          
          switch (stockLevel) {
            case "out_of_stock":
              return stock === 0;
            case "low":
              return stock > 0 && stock <= 20;
            case "medium":
              return stock > 20 && stock <= 50;
            case "high":
              return stock > 50;
            default:
              return false;
          }
        });

        if (filteredProducts.length === 0) {
          const levelText: {[key: string]: string} = {
            "out_of_stock": "tükenen",
            "low": "düşük stoklu (1-20)",
            "medium": "orta stoklu (21-50)",
            "high": "yüksek stoklu (50+)"
          };
          
          return {
            content: [{ 
              type: "text", 
              text: `${levelText[stockLevel]} ürün bulunamadı.` 
            }]
          };
        }

        // Stok miktarına göre sırala
        filteredProducts.sort((a: any, b: any) => b.stock - a.stock);

        const levelEmoji: {[key: string]: string} = {
          "out_of_stock": "🚫",
          "low": "⚠️",
          "medium": "📦",
          "high": "✅"
        };

        const levelText: {[key: string]: string} = {
          "out_of_stock": "Tükenen Ürünler",
          "low": "Düşük Stoklu Ürünler (1-20)",
          "medium": "Orta Stoklu Ürünler (21-50)",
          "high": "Yüksek Stoklu Ürünler (50+)"
        };

        let formattedOutput = `# ${levelEmoji[stockLevel]} ${levelText[stockLevel]} (${filteredProducts.length} ürün)\n\n`;
        
        filteredProducts.forEach((product: any) => {
          formattedOutput += formatProduct(product);
        });
        
        return {
          content: [{ 
            type: "text", 
            text: formattedOutput
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Stok filtresi uygulanırken hata oluştu: ${error instanceof Error ? error.message : String(error)}` 
          }]
        };
      }
    }
  );

server.tool("filter-by-brand-and-category",
    {
      description: "Marka ve kategoriye göre ürünleri filtreler",
      inputSchema: {
        type: "object",
        properties: {
          brand: {
            type: "string",
            description: "Marka adı (örn: Apple, Samsung, Korkmaz)"
          },
          category: {
            type: "string",
            description: "Kategori adı (örn: Telefon, Bilgisayar, Mutfak)"
          }
        },
        required: ["brand", "category"]
      }
    },
    async ({ brand, category }) => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items) {
          return {
            content: [{ 
              type: "text", 
              text: "Ürün verileri alınamadı." 
            }]
          };
        }

        // Marka ve kategoriye göre filtrele
        const filteredProducts = data.items.filter((product: any) => {
          const matchesBrand = product.brand?.name.toLowerCase().includes(brand.toLowerCase());
          
          const matchesCategory = product.categories && product.categories.length > 0 && 
            product.categories[0]?.category?.parent?.name.toLowerCase().includes(category.toLowerCase());
          
          return matchesBrand && matchesCategory;
        });

        if (filteredProducts.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `"${brand}" markası "${category}" kategorisinde hiç ürün bulunamadı.` 
            }]
          };
        }

        let formattedOutput = `# 🎯 ${brand} - ${category} Kategorisi (${filteredProducts.length} ürün)\n\n`;
        
        filteredProducts.forEach((product: any) => {
          formattedOutput += formatProduct(product);
        });
        
        return {
          content: [{ 
            type: "text", 
            text: formattedOutput
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Marka ve kategori filtresi uygulanırken hata oluştu: ${error instanceof Error ? error.message : String(error)}` 
          }]
        };
      }
    }
  );

server.tool("filter-featured-products",
    {
      description: "Öne çıkan (featured) ürünleri getirir"
    },
    async ({}) => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items) {
          return {
            content: [{ 
              type: "text", 
              text: "Ürün verileri alınamadı." 
            }]
          };
        }

        // Öne çıkan ürünleri filtrele
        const featuredProducts = data.items.filter((product: any) => product.isFeature === true);

        if (featuredProducts.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: "Henüz öne çıkan ürün bulunmuyor." 
            }]
          };
        }

        let formattedOutput = `# ⭐ Öne Çıkan Ürünler (${featuredProducts.length} ürün)\n\n`;
        
        featuredProducts.forEach((product: any) => {
          formattedOutput += formatProduct(product);
        });
        
        return {
          content: [{ 
            type: "text", 
            text: formattedOutput
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Öne çıkan ürünler getirilirken hata oluştu: ${error instanceof Error ? error.message : String(error)}` 
          }]
        };
      }
    }
  );

// 🛍️ ALIŞVERİŞ ASISTANI

server.tool("budget-based-recommendations",
    {
      description: "Belirlenen bütçeye göre ürün önerileri sunar",
      inputSchema: {
        type: "object",
        properties: {
          budget: {
            type: "number",
            description: "Bütçe (TL)"
          },
          category: {
            type: "string",
            description: "İsteğe bağlı kategori filtresi"
          }
        },
        required: ["budget"]
      }
    },
    async ({ budget, category }) => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items) {
          return {
            content: [{ 
              type: "text", 
              text: "Ürün verileri alınamadı." 
            }]
          };
        }

        let filteredProducts = data.items;

        // Kategori filtresi varsa uygula
        if (category) {
          filteredProducts = filteredProducts.filter((product: any) => {
            return product.categories && product.categories.length > 0 && 
              product.categories[0]?.category?.parent?.name.toLowerCase().includes(category.toLowerCase());
          });
        }

        // Bütçe dahilindeki ürünleri filtrele
        const affordableProducts = filteredProducts.filter((product: any) => {
          const price = product.vatPrice || product.price;
          return price <= budget && product.stock > 0;
        });

        if (affordableProducts.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `${budget.toLocaleString('tr-TR')} TL bütçenizle ${category ? category + ' kategorisinde' : ''} satın alabileceğiniz ürün bulunamadı.` 
            }]
          };
        }

        // Değer/fiyat oranına göre sırala (öne çıkan ürünler ve stok durumu)
        affordableProducts.sort((a: any, b: any) => {
          const priceA = a.vatPrice || a.price;
          const priceB = b.vatPrice || b.price;
          
          // Öne çıkan ürünleri önce göster
          if (a.isFeature && !b.isFeature) return -1;
          if (!a.isFeature && b.isFeature) return 1;
          
          // Sonra fiyata göre sırala
          return priceA - priceB;
        });

        // En iyi 5 öneriyi al
        const topRecommendations = affordableProducts.slice(0, 5);
        const totalBudgetUsed = topRecommendations.reduce((sum: number, product: any) => {
          return sum + (product.vatPrice || product.price);
        }, 0);

        let formattedOutput = `# 💡 ${budget.toLocaleString('tr-TR')} TL Bütçe Önerileri${category ? ` - ${category}` : ''}\n\n`;
        
        formattedOutput += `## 🎯 En İyi Önerilerim (${topRecommendations.length} ürün)\n\n`;
        
        topRecommendations.forEach((product: any, index: number) => {
          formattedOutput += `### ${index + 1}. Öneri\n`;
          formattedOutput += formatProduct(product);
        });

        // Bütçe analizi
        formattedOutput += `\n## 📊 Bütçe Analizi\n`;
        formattedOutput += `💰 Toplam Bütçe: ${budget.toLocaleString('tr-TR')} TL\n`;
        if (topRecommendations.length > 0) {
          formattedOutput += `🛒 Tüm önerilerin toplamı: ${totalBudgetUsed.toLocaleString('tr-TR')} TL\n`;
          formattedOutput += `💳 Kalan bütçe: ${(budget - totalBudgetUsed).toLocaleString('tr-TR')} TL\n`;
        }
        formattedOutput += `📦 Bütçenize uygun toplam ${affordableProducts.length} ürün bulundu\n`;
        
        return {
          content: [{ 
            type: "text", 
            text: formattedOutput
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Bütçe önerileri hazırlanırken hata oluştu: ${error instanceof Error ? error.message : String(error)}` 
          }]
        };
      }
    }
  );

server.tool("personal-shopper",
    {
      description: "Kişisel alışveriş asistanı - ihtiyaçlarınıza göre en uygun ürünleri önerir",
      inputSchema: {
        type: "object",
        properties: {
          need: {
            type: "string",
            description: "İhtiyacınız (örn: 'laptop gaming için', 'hediye erkek arkadaş', 'mutfak yenileme')"
          },
          budget: {
            type: "number",
            description: "İsteğe bağlı bütçe limiti (TL)"
          }
        },
        required: ["need"]
      }
    },
    async ({ need, budget }) => {
      try {
        const response = await fetch("http://localhost:3000/api/product");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.items) {
          return {
            content: [{ 
              type: "text", 
              text: "Ürün verileri alınamadı." 
            }]
          };
        }

        // İhtiyaca göre akıllı filtreleme
        const needLower = need.toLowerCase();
        let relevantProducts = data.items.filter((product: any) => {
          const name = product.name.toLowerCase();
          const desc = product.description.toLowerCase();
          const brand = product.brand?.name.toLowerCase() || '';
          const category = product.categories[0]?.category?.parent?.name.toLowerCase() || '';
          
          // Akıllı anahtar kelime eşleştirme
          if (needLower.includes('laptop') || needLower.includes('bilgisayar') || needLower.includes('gaming')) {
            return category.includes('bilgisayar') || name.includes('laptop') || name.includes('macbook');
          }
          
          if (needLower.includes('telefon') || needLower.includes('phone') || needLower.includes('iphone')) {
            return category.includes('telefon') || name.includes('iphone') || name.includes('phone');
          }
          
          if (needLower.includes('mutfak') || needLower.includes('yemek') || needLower.includes('tencere')) {
            return category.includes('mutfak') || name.includes('tencere') || name.includes('yemek');
          }
          
          if (needLower.includes('hediye') || needLower.includes('gift')) {
            return product.isFeature === true; // Öne çıkan ürünleri hediye olarak öner
          }
          
          if (needLower.includes('erkek') || needLower.includes('man')) {
            return category.includes('erkek') || name.includes('erkek');
          }
          
          if (needLower.includes('kadın') || needLower.includes('woman') || needLower.includes('women')) {
            return category.includes('kadın') || name.includes('kadın');
          }
          
          if (needLower.includes('ev') || needLower.includes('home') || needLower.includes('mobilya')) {
            return category.includes('mobilya') || category.includes('mutfak');
          }
          
          if (needLower.includes('teknoloji') || needLower.includes('tech')) {
            return category.includes('teknoloji') || category.includes('bilgisayar') || category.includes('telefon');
          }
          
          // Genel arama - tüm alanlarda ara
          return name.includes(needLower) || desc.includes(needLower) || brand.includes(needLower) || category.includes(needLower);
        });

        // Bütçe filtresi varsa uygula
        if (budget) {
          relevantProducts = relevantProducts.filter((product: any) => {
            const price = product.vatPrice || product.price;
            return price <= budget;
          });
        }

        // Stokta olan ürünleri filtrele
        relevantProducts = relevantProducts.filter((product: any) => product.stock > 0);

        if (relevantProducts.length === 0) {
          return {
            content: [{ 
              type: "text", 
              text: `"${need}" ihtiyacınız için ${budget ? budget.toLocaleString('tr-TR') + ' TL bütçenizle' : ''} uygun ürün bulunamadı. Farklı anahtar kelimeler deneyin.` 
            }]
          };
        }

        // Akıllı sıralama: öne çıkan ürünler, stok durumu, fiyat
        relevantProducts.sort((a: any, b: any) => {
          // Öne çıkan ürünleri önce göster
          if (a.isFeature && !b.isFeature) return -1;
          if (!a.isFeature && b.isFeature) return 1;
          
          // Stok durumuna göre sırala
          if (a.stock !== b.stock) return b.stock - a.stock;
          
          // Fiyata göre sırala
          const priceA = a.vatPrice || a.price;
          const priceB = b.vatPrice || b.price;
          return priceA - priceB;
        });

        // En iyi 3 öneriyi al
        const topPicks = relevantProducts.slice(0, 3);

        let formattedOutput = `# 🛒 Kişisel Alışveriş Asistanınız\n\n`;
        formattedOutput += `**İhtiyacınız:** ${need}\n`;
        if (budget) formattedOutput += `**Bütçeniz:** ${budget.toLocaleString('tr-TR')} TL\n`;
        formattedOutput += `\n## 🎯 Size Özel Önerilerim\n\n`;
        
        topPicks.forEach((product: any, index: number) => {
          const price = product.vatPrice || product.price;
          const isAffordable = budget ? price <= budget : true;
          const affordabilityIcon = isAffordable ? "✅" : "⚠️";
          
          formattedOutput += `### ${index + 1}. ${affordabilityIcon} ${product.isFeature ? '⭐ ' : ''}Öneri\n`;
          formattedOutput += formatProduct(product);
          
          if (!isAffordable && budget) {
            formattedOutput += `💡 **Not:** Bu ürün bütçenizi ${(price - budget).toLocaleString('tr-TR')} TL aşıyor.\n\n`;
          }
        });

        // Genel öneriler
        formattedOutput += `\n## 💡 Alışveriş Tavsiyeleri\n`;
        formattedOutput += `📊 "${need}" için toplam ${relevantProducts.length} ürün bulundu\n`;
        
        if (budget) {
          const budgetFriendly = relevantProducts.filter((p: any) => (p.vatPrice || p.price) <= budget);
          formattedOutput += `💰 Bütçenize uygun ${budgetFriendly.length} ürün mevcut\n`;
        }
        
        const featuredCount = relevantProducts.filter((p: any) => p.isFeature).length;
        if (featuredCount > 0) {
          formattedOutput += `⭐ ${featuredCount} öne çıkan ürün var - kalite garantili!\n`;
        }
        
        return {
          content: [{ 
            type: "text", 
            text: formattedOutput
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Kişisel alışveriş asistanı hata verdi: ${error instanceof Error ? error.message : String(error)}` 
          }]
        };
      }
    }
  );

  async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Pazaryeri MCP Server running on stdio");
  }
  
  main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });