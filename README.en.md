# 🛍️ Pazaryeri MCP Server

**🌍 Languages:** [English](README.en.md) | [Türkçe](README.md)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-FF6B35?style=for-the-badge&logo=anthropic&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Protocol-blue?style=for-the-badge)

<img src="assets/mcp.gif" alt="MCP Server Demo" width="800"/>

## 🔗 Related Project

This MCP server was specifically developed for the **[Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri)** project. The main marketplace application is a modern e-commerce platform developed with Vue.js and TypeScript, and this MCP server enables product management through Claude Desktop.

### Project Components:
- 🏪 **Main Marketplace Application**: [Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri) (Vue.js + TypeScript)
- 🤖 **Claude MCP Server**: This project - For interaction with the Marketplace API

## ✨ Features

### 🎯 **Smart Filters**
- 💰 **Price Range Filter** - Find products within specific price ranges
- 📦 **Stock Level Filter** - View low/high stock products
- 🏷️ **Brand & Category Filter** - Multi-filter support
- ⭐ **Featured Products** - List featured items

### 🛍️ **Shopping Assistant**
- 💡 **Budget Recommendations** - Best product combinations for specific budgets
- 🤖 **Personal Shopping Assistant** - AI-powered smart product suggestions
- 🎁 **Gift Recommendations** - Automatic gift suggestion engine
- 📊 **Budget Analysis** - Spending analysis and optimization

### 🔍 **Advanced Search**
- 🕵️ **Semantic Search** - Smart keyword recognition
- 📋 **Category-based Filtering** - Quick category navigation
- 🏪 **Store-based Listing** - View products by stores

## 🚀 Quick Start

### Requirements
- Node.js 18+ 
- Claude Desktop application
- [Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri) backend API (localhost:3000/api/product)

### 1. 📥 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pazaryeri-mcp.git
cd pazaryeri-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. ⚙️ Claude Desktop Configuration

Edit your Claude Desktop configuration file:

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

### 3. 🔄 Restart Claude Desktop

Close and reopen Claude Desktop. You can now use the Pazaryeri MCP Server!

## 💬 Usage Examples

### 🎯 Smart Filters

```bash
# Price range filtering
"Show products between 1000-5000 TL"

# Stock status control  
"Find low stock products"
"List out of stock items"

# Brand + category combination
"Apple phone products"
"Samsung computer products"

# Featured products
"Show featured items"
```

### 🛍️ Shopping Assistant

```bash
# Budget-based suggestions
"What can I buy with 3000 TL budget?"
"Recommendations for 5000 TL in phone category"

# Personal shopping assistant
"Recommend laptop for gaming"
"Gift suggestions for my boyfriend" 
"Kitchen renovation products"
"Home decoration suggestions"
```

### 🔍 Basic Search

```bash
# General search
"Search for iPhone"
"Show Apple products"

# Category-based
"Products in phone category"
"Kitchen products"

# All products
"Show all marketplace products"
```

## 🛠️ API Reference

### Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `get-products` | Lists all products | - |
| `search-products` | Product search | `query: string` |
| `get-product-by-category` | Filter by category | `category: string` |
| `filter-by-price-range` | Price range filter | `minPrice: number, maxPrice: number` |
| `filter-by-stock-level` | Stock level filter | `stockLevel: "low"\|"medium"\|"high"\|"out_of_stock"` |
| `filter-by-brand-and-category` | Brand + category filter | `brand: string, category: string` |
| `filter-featured-products` | Featured products | - |
| `budget-based-recommendations` | Budget suggestions | `budget: number, category?: string` |
| `personal-shopper` | Personal shopping assistant | `need: string, budget?: number` |

### Example API Response

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

## 🏗️ Development

### Development Mode

```bash
# TypeScript watch mode
npm run dev

# Build
npm run build

# Linting
npm run lint
```

### Adding New Features

1. Add new tool to `capabilities.tools` array in `src/index.ts`
2. Write implementation with `server.tool()`
3. Build the project: `npm run build`
4. Restart Claude Desktop

## 🔧 Configuration

### API Endpoint

This MCP server is designed to work with the backend API of the [Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri) project. By default uses `http://localhost:3000/api/product`. 

To use a different endpoint:

```typescript
// In src/index.ts
const API_ENDPOINT = "https://your-api.com/products";
```

**Note:** The API endpoint must be compatible with the API structure of the [Bekir-Berke/pazaryeri](https://github.com/Bekir-Berke/pazaryeri) backend.

### Customization

- Price formats can be edited in `formatProduct()` function
- Stock levels can be modified in `filter-by-stock-level` tool
- Personal shopping assistant keywords can be updated in `personal-shopper` tool



## 📞 Contact

- 📧 Email: bekiryilmaz594@gmail.com
- 💼 LinkedIn: [Bekir Berke Yılmaz](linkedin.com/in/bekir-berke)

---

⭐ **If you like this project, don't forget to give it a star!**

![Star History](https://img.shields.io/github/stars/Bekir-Berke/pazaryeri-mcp?style=social) 
