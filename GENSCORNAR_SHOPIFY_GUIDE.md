# GENSCORNAR Men's Fashion - Storefront Architecture & Shopify Dawn Integration Guide

This guide details the complete architecture of the **GENSCORNAR** luxury men's fashion storefront and provides step-by-step instructions for porting and configuring each section into a **Shopify Dawn theme**.

---

## 1. Brand Identity & Visual System

- **Brand Name**: GENSCORNAR
- **Category**: Premium Men's Fashion
- **Color Palette**:
  - Primary Background: Warm Cream (`#F8F3EB`)
  - Secondary Background: Light Beige (`#E8D8C4`)
  - Main Text: Near Black (`#171412`)
  - Secondary Text: Warm Brown-Gray (`#75675D`)
  - Highlight Accent: Deep Coffee Brown (`#542719`)
  - Metallic Accent: Muted Antique Gold (`#B99355`)
  - Accent / Sale Badges: Deep Burgundy (`#641D2C`)
  - Primary Buttons: Matte Black (`#080808`) with Pure White Text (`#FFFFFF`)
  - Borders & Dividers: Soft Beige (`#E5D8C8`)
- **Typography**:
  - Headings & Editorial Titles: *Playfair Display* (Serif)
  - Navigation, Body & Controls: *Inter* (Sans-serif)

---

## 2. Storefront Structure & Verified Reference Implementation

All layouts from the verified design document (`gen 3 store.pdf`) have been faithfully implemented:

### Page 1: Approved Hero Banner & Quick Categories
- Displays the official **GENSCORNAR** banner with unedited wording:
  - `"GENSCORNAR"`
  - `"MEN'S FASHION"`
  - `"REDEFINED CLASSICS"`
  - `"PREMIUM • STYLISH • TIMELESS"`
  - `"SHOP NOW →"`
- Directly below the banner, the 5-item quick navigation bar (`T-Shirts`, `Shirts`, `Hoodies`, `Jackets`, `Trousers`) allows one-click filtering.

### Page 2: "Find your occasion" (Shop by Collection)
- 8 gracefully arched category cards (`120px` top radius):
  1. **Shirts** — *"Everyday essentials, refined."*
  2. **T-Shirts** — *"Comfort meets contemporary style."*
  3. **Pants** — *"Find your perfect fit."*
  4. **Jackets** — *"Layer up with confidence."*
  5. **Hoodies** — *"Everyday comfort, elevated."*
  6. **Blazers** — *"Sharp style for every occasion."*
  7. **Kurtas** — *"Traditional style, modern comfort."*
  8. **Track Pants** — *"Move freely, look sharp."*

### Page 3: Shirts Collection Landing Page
- Collection Hero Banner featuring model in tailored shirt with *"Shirts - Classic. Comfortable. Always in Style."*
- 4 Subcategory Cards:
  - **Casual Shirts**
  - **Formal Shirts**
  - **Checked Shirts**
  - **Plain Shirts**
- Dynamic sorting (`Featured`, `Best Selling`, `Price Low-High`, `Price High-Low`, `A-Z`) and faceted filtering by size, price range, and color.

### Page 4: Casual Shirts Subcollection
- Breadcrumbs: `Home > Shirts > Casual Shirts`
- Dedicated Banner: *"Relax in Style - Effortless fashion for every occasion."*
- Full catalog cards showing:
  - Olive Green Casual Shirt (`$1,999.00`, `-12%`)
  - Textured White Shirt (`$1,699.00`, `-15%`)
  - Classic Black Shirt (`$1,599.00`, `-20%`)
  - Navy Blue Casual Shirt (`$1,699.00`, `-15%`)

### Page 5: Product Detail Page (PDP) - Olive Green Casual Shirt
- 2-Column Luxury Layout:
  - Left: 4 thumbnail gallery (`Front view`, `Back view`, `Collar detail`, `Full silhouette`) updating the primary high-resolution viewport.
  - Right: Title, rating (`4.8 ★ / 1,250 reviews`), pricing, discount percentage badge, color swatches (`Olive Green`, `Pure White`, `Classic Black`, `Navy Blue`), size selector (`S`, `M`, `L`, `XL`, `XXL`), stock indicators, interactive quantity adjuster, **ADD TO CART**, and **BUY IT NOW**.
  - Feature badges: *Premium Quality*, *Perfect Fit*, *Breathable Fabric*.
  - Collapsible accordions: *Description*, *Fabric & Materials*, *Fit & Sizing*, *Care Instructions*, *Shipping & Returns*.

---

## 3. 3D Interactive Product Experience
- Integrated via **Three.js** (`assets/vendor/three.min.js`) with progressive enhancement.
- Allows customers to rotate 360° via mouse drag / touch gestures, toggle auto-spin with double click, and preview real-time fabric dye changes using interactive swatches.
- **Graceful Fallback**: If WebGL or 3D assets are unavailable, seamlessly renders high-resolution product photography without blocking page interactivity or layout flow.

---

## 4. How to Port to Shopify Dawn Theme

### Step 1: Announcement Bar & Header Colors
In `config/settings_data.json` or Dawn's **Theme Settings > Colors**:
- Set **Scheme 1** (Background 1) to `#F8F3EB` (Warm Cream).
- Set **Scheme 2** (Background 2) to `#E8D8C4` (Light Beige).
- Set **Text** to `#171412` and **Outline button** to `#080808`.
- In the `announcement-bar` section settings, enter:
  `PREMIUM MEN'S FASHION | NEW COLLECTIONS AVAILABLE`
  and set background to `#641D2C` (Burgundy) with light text.

### Step 2: Custom Liquid Section for the 8 Arched Collections
Create `sections/genscornar-arch-collections.liquid` in your Dawn theme:
```liquid
{% schema %}
{
  "name": "Arched Collections Grid",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Find your occasion" },
    { "type": "text", "id": "subheading", "label": "Subheading", "default": "From everyday wear to standout style, every piece is crafted for you." }
  ],
  "blocks": [
    {
      "type": "collection_card",
      "name": "Collection Card",
      "settings": [
        { "type": "collection", "id": "collection", "label": "Select Collection" },
        { "type": "image_picker", "id": "image", "label": "Custom Arch Image" },
        { "type": "text", "id": "subtitle", "label": "Short Subtitle", "default": "Classic & Versatile" }
      ]
    }
  ],
  "presets": [
    { "name": "Arched Collections Grid", "blocks": [ { "type": "collection_card" }, { "type": "collection_card" } ] }
  ]
}
{% endschema %}
```

### Step 3: Custom Liquid Section for Shirt Subcategories
Create `sections/genscornar-subcategories.liquid`:
```liquid
<div class="subcategories-grid">
  {% for block in section.blocks %}
    <div class="subcat-card">
      <img src="{{ block.settings.image | image_url: width: 600 }}" alt="{{ block.settings.title }}" />
      <div class="subcat-card-overlay">
        <h3>{{ block.settings.title }}</h3>
        <a href="{{ block.settings.link }}">SHOP NOW →</a>
      </div>
    </div>
  {% endfor %}
</div>
```

### Step 4: Activating Real Shopify Cart & Customer Accounts
- **Shopping Bag**: Dawn's native cart drawer can be set to `Drawer` under **Theme Settings > Cart > Cart Type**.
- **Customer Accounts**: In Shopify Admin under **Settings > Customer Accounts**, enable **New Customer Accounts** to activate native secure login and order history with the header account icon.
