# Atelier Studio — Curated Design & Lifestyle

An editorial multi-screen design and lifestyle application featuring artisanal furniture, objects, textiles, and a specialized **Lighting Atelier**. Built with React 19, TypeScript, Tailwind CSS, and Vite.

---

## ✨ Features

### 🔍 Real-Time Name Search & Catalog Filtering
- **Live Search Bar**: Instant real-time filtering across product names and titles with matching result counter and single-click clear (`✕`).
- **Category Quick Chips**: Filter between **All Pieces**, **💡 Lighting Atelier**, **Furniture**, **Ceramics**, **Textiles**, and **Objects**.
- **Popular Suggestion Chips**: Quick-fill search terms such as *Kanso*, *Lantern*, *Washi*, *Solstice*, and *Travertine*.
- **Sorting Options**: Sort results on the fly by Featured, Price (Low to High, High to Low), or Customer Rating.

### 💡 Curated Lighting Atelier
- **Three-Tier Catalog Selection**:
  - **Budget-Friendly / Low-Cost** (< $300): e.g., *Kori Portable Lantern* ($185), *Aura Plaster Wall Sconce* ($240), *Tsubaki Reed Table Light* ($295).
  - **High-Cost / Luxury Statement Pieces** ($1,500+): e.g., *Equinox Kinetic Ring Chandelier* ($3,450), *Forma Cast Bronze Dome Pendant* ($2,850), *Solstice Cast Bronze Sculptural Floor Lamp* ($4,200).
  - **Top Rated** (★ 4.9 – 5.0): e.g., *Nara Washi Paper Floor Lantern* (★ 5.0), *Vapour Optical Crystal Desk Lamp* (★ 5.0), *Helios Radial Opal Glass Sconce* (★ 4.9).
- **Interactive Atmosphere Illumination Simulator**:
  - Toggle between **5000K Daylight**, **2700K Golden Hour**, and **2100K Dusk Candlelight** on piece detail pages to preview real-time light casting and room ambiance.
- **Optical & Technical Specifications**:
  - Color temperature (Kelvin), luminous output (Lumens), dimming compatibility, Color Rendering Index (CRI 95+), and power source details.

### 📖 Editorial Storyboard & Discovery
- **Visual Design Stories**: Full-bleed photographic stories highlighting design philosophies (*The Quiet Materiality of Travertine*, *Wabi-Sabi Illumination*, *Sculptural Living*).
- **Quick View Modal**: Preview specs, materials, and add items directly to cart without losing context.
- **Finish & Material Selectors**: Interactive finish swatch selection (Travertine, Nero Marquina, Brushed Brass, Washi paper).

### 🛒 Cart & Multi-Currency Commerce
- **Currency Switcher**: Real-time display in **USD ($)**, **EUR (€)**, **GBP (£)**, or **JPY (¥)**.
- **Wishlist / Saved Items**: Save favorite pieces across sessions.
- **Cart & Seamless Checkout**: Sliding cart drawer with quantity management, order subtotal calculation, and step-by-step checkout.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)

---

## 🔐 Environment Variables & Security (GitHub Protection)

> [!IMPORTANT]
> **Never commit your `.env` file to GitHub or any public repository.**
> Secret keys and private credentials must always remain local or configured securely in your deployment provider.

### How Secrets are Kept Safe:
1. **Strict `.gitignore` configuration**:
   All `.env`, `.env.local`, `.env.*`, `*.key`, `*.pem`, and `secrets.*` files are explicitly excluded in `.gitignore`.
2. **Safe Template Provided**:
   Only `.env.example` is tracked in git. It contains placeholders without real API keys or sensitive values:
   ```env
   GEMINI_API_KEY="MY_GEMINI_API_KEY"
   APP_URL="MY_APP_URL"
   ```

### Local Setup:
1. Copy the example file to create your local environment file:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your actual private credentials.
3. Before pushing to GitHub, verify that `.env` is ignored:
   ```bash
   git status
   ```
   *(Ensure `.env` does not appear under "Untracked files" or "Changes to be committed".)*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/atelier-studio.git
cd atelier-studio

# Install dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Building for Production
```bash
npm run build
```

### Type Checking & Linting
```bash
npm run lint
```

---

## 📁 Project Structure

```
├── .env.example                # Safe environment variable template (tracked)
├── .gitignore                  # Security rules blocking .env & credentials
├── index.html                  # HTML entry point with metadata
├── package.json                # Project dependencies and scripts
├── src/
│   ├── App.tsx                 # Root application controller & screen router
│   ├── components/
│   │   ├── Header.tsx          # Navigation, search access, currency, cart badge
│   │   ├── Navigation.tsx      # Bottom navigation bar for screens
│   │   ├── QuickViewModal.tsx  # Quick preview modal with lighting info
│   │   ├── StoryboardView.tsx  # Multi-screen canvas layout preview
│   │   └── screens/
│   │       ├── HomeScreen.tsx    # Live search, catalog chips, lighting tiers
│   │       ├── ExploreScreen.tsx # Multi-facet filters, price range slider
│   │       ├── DetailScreen.tsx  # Interactive lighting mood simulator & specs
│   │       ├── SavedScreen.tsx   # Saved pieces / wishlist
│   │       └── CartScreen.tsx    # Shopping cart, summary & checkout
│   ├── data/
│   │   └── mockData.ts         # Curated catalog, lighting tiers, and stories
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces and domain types
│   ├── main.tsx                # React DOM mounting
│   └── index.css               # Tailwind CSS entry point
└── tsconfig.json               # TypeScript configuration
```

---

## 📄 License
This project is licensed under the MIT License.
