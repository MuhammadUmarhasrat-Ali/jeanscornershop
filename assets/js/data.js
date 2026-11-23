// JEANSCORNER Product Catalog & Storefront Data (Synchronized with Admin DB)
const GENSCORNAR_DATA = {
  "store": {
    "name": "JEANSCORNER",
    "tagline": "MEN'S FASHION | REDEFINED CLASSICS",
    "badge": "PREMIUM • STYLISH • TIMELESS",
    "announcement": "PREMIUM MEN'S FASHION | NEW COLLECTIONS AVAILABLE",
    "currency": "$",
    "currencyCode": "USD"
  },
  "categories": [
    {
      "id": "new_arrivals",
      "title": "New Arrivals",
      "subtitle": "Freshly Tailored FW26 Drops",
      "description": "Discover the latest luxury tailoring, contemporary essentials, and seasonal signature drops freshly cut for the discerning gentleman.",
      "image": "assets/banners/hero_model_portrait.jpg",
      "banner": "assets/banners/banner_new_arrivals.jpg",
      "badge": "Seasonal Drop",
      "featured": true
    },
    {
      "id": "shirts",
      "title": "Shirts",
      "subtitle": "Classic & Versatile",
      "description": "Everyday essentials, refined. Architectural tailoring, breathable weaves, and effortless masculine elegance.",
      "image": "assets/categories/cat_shirts.jpg",
      "banner": "assets/banners/banner_shirts.jpg",
      "badge": "Best Seller",
      "featured": true,
      "subcategories": [
        "casual_shirts",
        "formal_shirts",
        "checked_shirts",
        "plain_shirts"
      ]
    },
    {
      "id": "tshirts",
      "title": "T-Shirts",
      "subtitle": "Simple & Stylish",
      "description": "Comfort meets contemporary style. Cut from dense 240 GSM combed cotton and mercerized luxury yarns.",
      "image": "assets/categories/cat_tshirts.jpg",
      "banner": "assets/banners/banner_tshirts.jpg",
      "badge": "Trending",
      "featured": true,
      "subcategories": [
        "oversized_tshirts",
        "polo_tshirts",
        "crewneck_tshirts"
      ]
    },
    {
      "id": "pants",
      "title": "Pants",
      "subtitle": "Comfort & Class",
      "description": "Find your perfect fit. Pleated tailored trousers, stretch chinos, and contemporary silhouettes.",
      "image": "assets/categories/cat_pants.jpg",
      "banner": "assets/banners/banner_pants.jpg",
      "badge": "Essential",
      "featured": true,
      "subcategories": [
        "chinos",
        "trousers",
        "cargo_pants"
      ]
    },
    {
      "id": "jackets",
      "title": "Jackets",
      "subtitle": "Layer with Style",
      "description": "Layer up with confidence. Functional utility overshirts, fine leather cuts, and structural bombers.",
      "image": "assets/categories/cat_jackets.jpg",
      "banner": "assets/banners/banner_jackets.jpg",
      "badge": "New",
      "featured": true,
      "subcategories": [
        "leather_jackets",
        "bomber_jackets",
        "denim_jackets"
      ]
    },
    {
      "id": "hoodies",
      "title": "Hoodies",
      "subtitle": "Relaxed Comfort",
      "description": "Everyday comfort, elevated. Substantial 480 GSM French terry fleece engineered for effortless warmth and drape.",
      "image": "assets/categories/cat_hoodies.jpg",
      "banner": "assets/banners/banner_hoodies.jpg",
      "badge": "Cozy",
      "featured": true,
      "subcategories": [
        "pullover_hoodies",
        "zip_hoodies"
      ]
    },
    {
      "id": "blazers",
      "title": "Blazers",
      "subtitle": "Smart & Sophisticated",
      "description": "Sharp style for every occasion. Impeccable unconstructed Italian wool-blend blazers with natural shoulders.",
      "image": "assets/categories/cat_blazers.jpg",
      "banner": "assets/banners/banner_blazers.jpg",
      "badge": "Luxury",
      "featured": true,
      "subcategories": [
        "single_breasted",
        "double_breasted",
        "linen_blazers"
      ]
    },
    {
      "id": "kurtas",
      "title": "Kurtas",
      "subtitle": "Tradition Redefined",
      "description": "Traditional style, modern comfort. Pure artisanal linens, band-collars, and contemporary heritage drapes.",
      "image": "assets/categories/cat_kurtas.jpg",
      "banner": "assets/banners/banner_kurtas.jpg",
      "badge": "Heritage",
      "featured": true,
      "subcategories": [
        "casual_kurtas",
        "festive_kurtas"
      ]
    },
    {
      "id": "trackpants",
      "title": "Track Pants",
      "subtitle": "Move in Style",
      "description": "Move freely, look sharp. Tapered technical knits and elevated athleisure trousers.",
      "image": "assets/categories/cat_trackpants.jpg",
      "banner": "assets/banners/banner_trackpants.jpg",
      "badge": "Athleisure",
      "featured": true,
      "subcategories": [
        "slim_fit_trackpants",
        "joggers"
      ]
    },
    {
      "id": "sale",
      "title": "Sale Up to 40%",
      "subtitle": "Private Seasonal Archive",
      "description": "Exclusive seasonal reductions across signature tailored classics, outerwear, and everyday staples.",
      "image": "assets/banners/banner_casual_shirts.jpg",
      "banner": "assets/banners/banner_sale.jpg",
      "badge": "Sale Up to 40%",
      "featured": true
    }
  ],
  "shirtSubcategories": [
    {
      "id": "casual_shirts",
      "title": "Casual Shirts",
      "description": "Effortless fashion for every occasion.",
      "image": "assets/categories/subcat_casual_shirts.jpg"
    },
    {
      "id": "formal_shirts",
      "title": "Formal Shirts",
      "description": "Crisp tailoring for work and formal events.",
      "image": "assets/categories/subcat_formal_shirts.jpg"
    },
    {
      "id": "checked_shirts",
      "title": "Checked Shirts",
      "description": "Classic checks crafted with modern precision.",
      "image": "assets/categories/subcat_checked_shirts.jpg"
    },
    {
      "id": "plain_shirts",
      "title": "Plain Shirts",
      "description": "Pure minimalism, timeless silhouettes.",
      "image": "assets/categories/subcat_plain_shirts.jpg"
    }
  ],
  "products": [
    {
      "title": "aaaaa",
      "category": "shirts",
      "subCategory": "xxxx",
      "price": 6000,
      "compareAtPrice": 5665,
      "stock": 0,
      "sizes": [
        {
          "size": "S",
          "available": true,
          "stock": 10
        },
        {
          "size": "M",
          "available": true,
          "stock": 10
        },
        {
          "size": "L",
          "available": true,
          "stock": 10
        },
        {
          "size": "XL",
          "available": true,
          "stock": 10
        },
        {
          "size": "XXL",
          "available": true,
          "stock": 10
        }
      ],
      "colors": [
        {
          "name": "Olive",
          "hex": "#141312"
        },
        {
          "name": "White",
          "hex": "#141312"
        },
        {
          "name": "Navy",
          "hex": "#141312"
        },
        {
          "name": "Black",
          "hex": "#141312"
        }
      ],
      "shortDesc": "fghghghfghhfh",
      "image": "assets/uploads/upload_1795418346671_Gemini_Generated_Image_bujvjbujvjbujvjb_png.png",
      "mainImage": "assets/uploads/upload_1795418346671_Gemini_Generated_Image_bujvjbujvjbujvjb_png.png",
      "gallery": [
        "assets/uploads/upload_1795418346671_Gemini_Generated_Image_bujvjbujvjbujvjb_png.png"
      ],
      "featured": false,
      "isNew": true,
      "accordion": {
        "description": "fghghghfghhfh",
        "materials": "100% Premium Combed Cotton. Handcrafted in our bespoke atelier.",
        "fitSizing": "True to size modern tailored fit.",
        "care": "Dry clean or gentle hand wash."
      },
      "id": "prod_1795418392142",
      "handle": "aaaaa",
      "createdAt": "2026-11-23T07:19:52.142Z"
    },
    {
      "title": "Signature Cashmere Overcoat",
      "category": "jackets",
      "subCategory": "luxury_outerwear",
      "price": 495,
      "compareAtPrice": 650,
      "stock": 25,
      "sizes": [
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        }
      ],
      "colors": [
        {
          "name": "Camel Tan"
        }
      ],
      "shortDesc": "Mastercrafted Italian double-faced cashmere overcoat.",
      "image": "assets/products/p_classic_black.jpg",
      "mainImage": "assets/products/p_classic_black.jpg",
      "gallery": [
        "assets/products/p_classic_black.jpg"
      ],
      "featured": true,
      "isNew": true,
      "id": "prod_1795268392716",
      "handle": "signature-cashmere-overcoat",
      "createdAt": "2026-11-21T13:39:52.716Z"
    },
    {
      "id": "olive-green-casual-shirt",
      "title": "Olive Green Casual Shirt",
      "handle": "olive-green-casual-shirt",
      "category": "shirts",
      "subCategory": "casual_shirts",
      "price": 1999,
      "compareAtPrice": 2299,
      "discount": "-12%",
      "rating": 4.8,
      "reviewsCount": 1250,
      "image": "assets/products/p_olive_green.jpg",
      "mainImage": "assets/products/olive_shirt_main.jpg",
      "gallery": [
        "assets/products/olive_shirt_main.jpg",
        "assets/products/olive_shirt_thumb1.jpg",
        "assets/products/olive_shirt_thumb2.jpg",
        "assets/products/olive_shirt_thumb3.jpg",
        "assets/products/olive_shirt_thumb4.jpg"
      ],
      "colors": [
        {
          "name": "Olive Green",
          "hex": "#4C4B37",
          "color3d": 4999991,
          "inStock": true,
          "active": true
        },
        {
          "name": "Pure White",
          "hex": "#EBE8DF",
          "color3d": 15460575,
          "inStock": true,
          "active": false
        },
        {
          "name": "Classic Black",
          "hex": "#1D1A18",
          "color3d": 1907224,
          "inStock": true,
          "active": false
        },
        {
          "name": "Navy Blue",
          "hex": "#1B2A4A",
          "color3d": 1780298,
          "inStock": true,
          "active": false
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true,
          "stock": 8
        },
        {
          "size": "M",
          "available": true,
          "stock": 10
        },
        {
          "size": "L",
          "available": true,
          "stock": 10
        },
        {
          "size": "XL",
          "available": true,
          "stock": 8
        },
        {
          "size": "XXL",
          "available": true,
          "stock": 4
        }
      ],
      "shortDesc": "A versatile casual shirt designed for effortless everyday style. Pair it with your favorite trousers or jeans for a clean, modern look.",
      "features": [
        {
          "icon": "shield",
          "title": "Premium Quality",
          "desc": "100% long-staple breathable cotton"
        },
        {
          "icon": "user-check",
          "title": "Perfect Fit",
          "desc": "Tailored masculine modern silhouette"
        },
        {
          "icon": "feather",
          "title": "Breathable Fabric",
          "desc": "All-day comfort with natural stretch"
        }
      ],
      "accordion": {
        "description": "The JEANSCORNER Olive Green Casual Shirt combines utilitarian luxury with refined tailoring. Cut from breathable, high-grade cotton canvas weave, this shirt transitions effortlessly from daytime layering to evening outings. Finished with horn-effect buttons, clean single-button cuffs, and an understated structured collar.",
        "materials": "100% Premium Combed Cotton. Pre-shrunk weave with durable double-needle stitching along shoulder and side seams.",
        "fitSizing": "True to size modern slim-regular fit. If you prefer an oversized boxy aesthetic, consider sizing up one size.",
        "care": "Machine wash cold with similar dark colors. Gentle cycle. Do not bleach. Tumble dry low or hang dry in shade. Warm iron if needed.",
        "shipping": "Standard domestic shipping delivered within 3-5 business days. Express shipping available at checkout. Secure tracked dispatch.",
        "returns": "Hassle-free 14-day returns and size exchanges on unworn items with original brand tags attached."
      },
      "has3D": true,
      "badge": "BESTSELLER",
      "isNew": true
    },
    {
      "id": "textured-white-shirt",
      "title": "Textured White Shirt",
      "handle": "textured-white-shirt",
      "category": "shirts",
      "subCategory": "casual_shirts",
      "price": 1699,
      "compareAtPrice": 1999,
      "discount": "-15%",
      "rating": 4.9,
      "reviewsCount": 840,
      "image": "assets/products/p_textured_white.jpg",
      "mainImage": "assets/products/p_textured_white.jpg",
      "gallery": [
        "assets/products/p_textured_white.jpg",
        "assets/products/olive_shirt_thumb3.jpg"
      ],
      "colors": [
        {
          "name": "Textured White",
          "hex": "#FAF8F5",
          "color3d": 16447733,
          "inStock": true,
          "active": true
        },
        {
          "name": "Ecru Beige",
          "hex": "#E8D8C4",
          "color3d": 15259844,
          "inStock": true,
          "active": false
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true,
          "stock": 6
        },
        {
          "size": "M",
          "available": true,
          "stock": 12
        },
        {
          "size": "L",
          "available": true,
          "stock": 9
        },
        {
          "size": "XL",
          "available": true,
          "stock": 5
        },
        {
          "size": "XXL",
          "available": false,
          "stock": 0
        }
      ],
      "shortDesc": "Subtle micro-texture elevates this quintessential white shirt into a luxurious statement piece for work and weekends.",
      "features": [
        {
          "icon": "shield",
          "title": "Premium Quality",
          "desc": "Soft textured slub cotton"
        },
        {
          "icon": "user-check",
          "title": "Perfect Fit",
          "desc": "Structured shoulders, clean drape"
        },
        {
          "icon": "feather",
          "title": "Breathable Fabric",
          "desc": "Keeps you cool in any climate"
        }
      ],
      "accordion": {
        "description": "Crafted with micro-dobby waffle texture, this shirt adds dimensional interest to a classic white essential. Versatile enough for boardroom presentations or seaside evenings.",
        "materials": "100% Slub Texture Cotton, mother-of-pearl finish buttons.",
        "fitSizing": "Regular contemporary fit.",
        "care": "Machine wash cold with whites. Warm iron.",
        "shipping": "Standard delivery 3-5 days.",
        "returns": "14-day policy on original condition items."
      },
      "has3D": true,
      "badge": "POPULAR",
      "isNew": true
    },
    {
      "id": "classic-black-shirt",
      "title": "Classic Black Shirt",
      "handle": "classic-black-shirt",
      "category": "shirts",
      "subCategory": "formal_shirts",
      "price": 1599,
      "compareAtPrice": 1999,
      "discount": "-20%",
      "rating": 4.7,
      "reviewsCount": 920,
      "image": "assets/products/p_classic_black.jpg",
      "mainImage": "assets/products/p_classic_black.jpg",
      "gallery": [
        "assets/products/p_classic_black.jpg",
        "assets/products/olive_shirt_thumb2.jpg"
      ],
      "colors": [
        {
          "name": "Deep Onyx Black",
          "hex": "#141312",
          "color3d": 1315602,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true,
          "stock": 7
        },
        {
          "size": "M",
          "available": true,
          "stock": 14
        },
        {
          "size": "L",
          "available": true,
          "stock": 11
        },
        {
          "size": "XL",
          "available": true,
          "stock": 6
        },
        {
          "size": "XXL",
          "available": true,
          "stock": 3
        }
      ],
      "shortDesc": "Rich, saturated jet black shirt with satin-soft finish. An indispensable icon for nocturnal elegance.",
      "features": [
        {
          "icon": "shield",
          "title": "Color-Fast",
          "desc": "Resists fading across dozens of washes"
        },
        {
          "icon": "user-check",
          "title": "Tapered Cut",
          "desc": "Flattering tapered waist silhouette"
        },
        {
          "icon": "feather",
          "title": "Silky Handfeel",
          "desc": "Mercerized combed cotton yarn"
        }
      ],
      "accordion": {
        "description": "An evening icon. Our deep onyx black shirt is garment-dyed with rich reactive dyes to ensure everlasting black depth.",
        "materials": "97% Mercerized Cotton, 3% Elastane for subtle mobility.",
        "fitSizing": "Tailored slim fit.",
        "care": "Wash inside out in cold water. Line dry.",
        "shipping": "Ships in 24-48 hours.",
        "returns": "Full exchange and return support."
      },
      "has3D": true,
      "badge": "SALE",
      "isNew": false
    },
    {
      "id": "navy-blue-casual-shirt",
      "title": "Navy Blue Casual Shirt",
      "handle": "navy-blue-casual-shirt",
      "category": "shirts",
      "subCategory": "casual_shirts",
      "price": 1699,
      "compareAtPrice": 1999,
      "discount": "-15%",
      "rating": 4.8,
      "reviewsCount": 610,
      "image": "assets/products/p_navy_blue.jpg",
      "mainImage": "assets/products/p_navy_blue.jpg",
      "gallery": [
        "assets/products/p_navy_blue.jpg"
      ],
      "colors": [
        {
          "name": "Navy Blue",
          "hex": "#1B2A4A",
          "color3d": 1780298,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true,
          "stock": 5
        },
        {
          "size": "M",
          "available": true,
          "stock": 8
        },
        {
          "size": "L",
          "available": true,
          "stock": 10
        },
        {
          "size": "XL",
          "available": true,
          "stock": 7
        },
        {
          "size": "XXL",
          "available": true,
          "stock": 2
        }
      ],
      "shortDesc": "Rich midnight navy casual shirt made from breathable oxford weave. Clean styling with subtle horn buttons.",
      "features": [
        {
          "icon": "shield",
          "title": "Premium Quality",
          "desc": "Fine-yarn oxford weave"
        },
        {
          "icon": "user-check",
          "title": "Perfect Fit",
          "desc": "Comfortable standard chest room"
        },
        {
          "icon": "feather",
          "title": "All-Day Wear",
          "desc": "Wrinkle-resistant breathable finish"
        }
      ],
      "accordion": {
        "description": "Refined navy casual shirt with timeless button-down styling. Effortless to match with khaki chinos or dark selvedge denim.",
        "materials": "100% Oxford Cotton.",
        "fitSizing": "Modern standard fit.",
        "care": "Machine wash cold.",
        "shipping": "Standard delivery.",
        "returns": "14-day easy return window."
      },
      "has3D": true,
      "badge": "HOT",
      "isNew": true
    },
    {
      "id": "heavyweight-relaxed-tee",
      "title": "Heavyweight Relaxed T-Shirt",
      "handle": "heavyweight-relaxed-tee",
      "category": "tshirts",
      "subCategory": "oversized_tshirts",
      "price": 899,
      "compareAtPrice": 1199,
      "discount": "-25%",
      "rating": 4.9,
      "reviewsCount": 540,
      "image": "assets/categories/cat_tshirts.jpg",
      "mainImage": "assets/categories/cat_tshirts.jpg",
      "gallery": [
        "assets/categories/cat_tshirts.jpg"
      ],
      "colors": [
        {
          "name": "Rich Mocha",
          "hex": "#542719",
          "color3d": 5515033,
          "inStock": true,
          "active": true
        },
        {
          "name": "Onyx Black",
          "hex": "#141312",
          "color3d": 1315602,
          "inStock": true,
          "active": false
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        },
        {
          "size": "XXL",
          "available": true
        }
      ],
      "shortDesc": "240 GSM heavy combed cotton tee with dropped shoulders and ribbed crew collar. A true modern staple.",
      "features": [
        {
          "icon": "shield",
          "title": "240 GSM",
          "desc": "Dense, non-sheer cotton"
        }
      ],
      "accordion": {
        "description": "Heavyweight boxy tee with ribbed collar and reinforced neck tape.",
        "materials": "100% Combed Cotton.",
        "fitSizing": "Relaxed drop shoulder.",
        "care": "Machine wash cold.",
        "shipping": "Ships in 24h.",
        "returns": "14-day policy."
      },
      "badge": "TRENDING",
      "isNew": true
    },
    {
      "id": "mercerized-pima-crewneck",
      "title": "Mercerized Pima Cotton Crewneck",
      "handle": "mercerized-pima-crewneck",
      "category": "tshirts",
      "subCategory": "crewneck_tshirts",
      "price": 1099,
      "compareAtPrice": 1399,
      "discount": "-21%",
      "rating": 4.8,
      "reviewsCount": 380,
      "image": "assets/categories/cat_tshirts.jpg",
      "mainImage": "assets/categories/cat_tshirts.jpg",
      "gallery": [
        "assets/categories/cat_tshirts.jpg"
      ],
      "colors": [
        {
          "name": "Ivory White",
          "hex": "#FAF8F5",
          "color3d": 16447733,
          "inStock": true,
          "active": true
        },
        {
          "name": "Slate Grey",
          "hex": "#4A4D52",
          "color3d": 4869458,
          "inStock": true,
          "active": false
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Silky mercerized long-staple pima cotton with an understated luster and tailored athletic drape.",
      "features": [
        {
          "icon": "shield",
          "title": "Pima Cotton",
          "desc": "Ultra-soft mercerized yarn"
        }
      ],
      "accordion": {
        "description": "The definitive luxury T-shirt engineered to pair beneath blazers or wear solo with trousers.",
        "materials": "100% Mercerized Pima Cotton.",
        "fitSizing": "Tailored regular cut.",
        "care": "Machine wash cold, lay flat to dry.",
        "shipping": "Free shipping.",
        "returns": "14-day returns."
      },
      "badge": "POPULAR",
      "isNew": true
    },
    {
      "id": "textured-waffle-polo-tee",
      "title": "Textured Micro-Knit Resort Polo",
      "handle": "textured-waffle-polo-tee",
      "category": "tshirts",
      "subCategory": "polo_tshirts",
      "price": 1299,
      "compareAtPrice": 1599,
      "discount": "-18%",
      "rating": 4.9,
      "reviewsCount": 290,
      "image": "assets/categories/cat_tshirts.jpg",
      "mainImage": "assets/categories/cat_tshirts.jpg",
      "gallery": [
        "assets/categories/cat_tshirts.jpg"
      ],
      "colors": [
        {
          "name": "Earthy Olive",
          "hex": "#4C4B37",
          "color3d": 4999991,
          "inStock": true,
          "active": true
        },
        {
          "name": "Midnight Navy",
          "hex": "#1B2A4A",
          "color3d": 1780298,
          "inStock": true,
          "active": false
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Johnny-collar knit polo crafted with micro-waffle breathable texture and ribbed cuffs.",
      "features": [
        {
          "icon": "shield",
          "title": "Knit Texture",
          "desc": "Breathable open-stitch weave"
        }
      ],
      "accordion": {
        "description": "Effortless Riviera aesthetic combined with structured metropolitan tailoring.",
        "materials": "100% Breathable Cotton Knit.",
        "fitSizing": "Modern tapered fit.",
        "care": "Hand wash or gentle cycle.",
        "shipping": "Ships in 24h.",
        "returns": "14-day policy."
      },
      "badge": "NEW DROP",
      "isNew": true
    },
    {
      "id": "tailored-pleated-trousers",
      "title": "Tailored Pleated Trousers",
      "handle": "tailored-pleated-trousers",
      "category": "pants",
      "subCategory": "trousers",
      "price": 2499,
      "compareAtPrice": 2999,
      "discount": "-17%",
      "rating": 4.8,
      "reviewsCount": 310,
      "image": "assets/categories/cat_pants.jpg",
      "mainImage": "assets/categories/cat_pants.jpg",
      "gallery": [
        "assets/categories/cat_pants.jpg"
      ],
      "colors": [
        {
          "name": "Charcoal Grey",
          "hex": "#2B2A29",
          "color3d": 2828841,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "30",
          "available": true
        },
        {
          "size": "32",
          "available": true
        },
        {
          "size": "34",
          "available": true
        },
        {
          "size": "36",
          "available": true
        }
      ],
      "shortDesc": "Double-pleated tailored trousers with side adjusters and a gentle tapered ankle break.",
      "features": [
        {
          "icon": "shield",
          "title": "Italian Drape",
          "desc": "Rich wool-poly stretch blend"
        }
      ],
      "accordion": {
        "description": "Refined sartorial trousers with interior waistband curtain and blind hem finish.",
        "materials": "Wool Blend.",
        "fitSizing": "High rise with tapered leg.",
        "care": "Dry clean only.",
        "shipping": "Free shipping.",
        "returns": "14-day returns."
      },
      "badge": "PREMIUM",
      "isNew": true
    },
    {
      "id": "architectural-stretch-chino",
      "title": "Architectural Stretch Chinos",
      "handle": "architectural-stretch-chino",
      "category": "pants",
      "subCategory": "chinos",
      "price": 1899,
      "compareAtPrice": 2299,
      "discount": "-17%",
      "rating": 4.9,
      "reviewsCount": 470,
      "image": "assets/categories/cat_pants.jpg",
      "mainImage": "assets/categories/cat_pants.jpg",
      "gallery": [
        "assets/categories/cat_pants.jpg"
      ],
      "colors": [
        {
          "name": "Sand Khaki",
          "hex": "#D4C5A9",
          "color3d": 13944233,
          "inStock": true,
          "active": true
        },
        {
          "name": "Olive Earth",
          "hex": "#4C4B37",
          "color3d": 4999991,
          "inStock": true,
          "active": false
        }
      ],
      "sizes": [
        {
          "size": "30",
          "available": true
        },
        {
          "size": "32",
          "available": true
        },
        {
          "size": "34",
          "available": true
        },
        {
          "size": "36",
          "available": true
        }
      ],
      "shortDesc": "Clean flat-front chinos crafted from peach-finish combed cotton twill with subtle mobility stretch.",
      "features": [
        {
          "icon": "shield",
          "title": "Sateen Twill",
          "desc": "Durable & velvety handfeel"
        }
      ],
      "accordion": {
        "description": "Engineered with tailored coin pocket, horn buttons, and reinforced crotch gusset.",
        "materials": "98% Cotton, 2% Elastane.",
        "fitSizing": "Slim straight silhouette.",
        "care": "Machine wash cold.",
        "shipping": "Ships in 24h.",
        "returns": "14-day returns."
      },
      "badge": "BESTSELLER",
      "isNew": true
    },
    {
      "id": "minimalist-wool-drape-pant",
      "title": "Minimalist Wide-Leg Drape Trousers",
      "handle": "minimalist-wool-drape-pant",
      "category": "pants",
      "subCategory": "trousers",
      "price": 2799,
      "compareAtPrice": 3299,
      "discount": "-15%",
      "rating": 5,
      "reviewsCount": 195,
      "image": "assets/categories/cat_pants.jpg",
      "mainImage": "assets/categories/cat_pants.jpg",
      "gallery": [
        "assets/categories/cat_pants.jpg"
      ],
      "colors": [
        {
          "name": "Deep Obsidian",
          "hex": "#141312",
          "color3d": 1315602,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "30",
          "available": true
        },
        {
          "size": "32",
          "available": true
        },
        {
          "size": "34",
          "available": true
        },
        {
          "size": "36",
          "available": true
        }
      ],
      "shortDesc": "Flowing contemporary wide-leg silhouette in tropical weight wool with effortless movement.",
      "features": [
        {
          "icon": "shield",
          "title": "Tropical Wool",
          "desc": "Four-season natural ventilation"
        }
      ],
      "accordion": {
        "description": "High-waisted tailoring with extended tab closure and fluid drape down to the shoe break.",
        "materials": "100% Lightweight Wool.",
        "fitSizing": "Relaxed wide-leg fit.",
        "care": "Specialist dry clean.",
        "shipping": "Complimentary express.",
        "returns": "14-day returns."
      },
      "badge": "ATELIER",
      "isNew": true
    },
    {
      "id": "overshirt-layering-jacket",
      "title": "Utility Overshirt Jacket",
      "handle": "overshirt-layering-jacket",
      "category": "jackets",
      "subCategory": "bomber_jackets",
      "price": 3499,
      "compareAtPrice": 3999,
      "discount": "-12%",
      "rating": 4.9,
      "reviewsCount": 420,
      "image": "assets/categories/cat_jackets.jpg",
      "mainImage": "assets/categories/cat_jackets.jpg",
      "gallery": [
        "assets/categories/cat_jackets.jpg"
      ],
      "colors": [
        {
          "name": "Midnight Black",
          "hex": "#161514",
          "color3d": 1447188,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Dual-pocket safari utility overshirt in heavy brushed cotton twill. Perfect outer layer.",
      "features": [
        {
          "icon": "shield",
          "title": "Heavyweight Twill",
          "desc": "Rugged yet refined texture"
        }
      ],
      "accordion": {
        "description": "A versatile field jacket styled with contemporary minimalism.",
        "materials": "100% Brushed Cotton Twill.",
        "fitSizing": "Regular outerwear fit.",
        "care": "Machine wash cold.",
        "shipping": "Ships in 24h.",
        "returns": "14-day returns."
      },
      "badge": "FEATURED",
      "isNew": true
    },
    {
      "id": "suede-artisan-bomber",
      "title": "Handcrafted Suede Bomber Jacket",
      "handle": "suede-artisan-bomber",
      "category": "jackets",
      "subCategory": "leather_jackets",
      "price": 6499,
      "compareAtPrice": 7999,
      "discount": "-18%",
      "rating": 5,
      "reviewsCount": 180,
      "image": "assets/categories/cat_jackets.jpg",
      "mainImage": "assets/categories/cat_jackets.jpg",
      "gallery": [
        "assets/categories/cat_jackets.jpg"
      ],
      "colors": [
        {
          "name": "Cognac Brown",
          "hex": "#633B22",
          "color3d": 6503202,
          "inStock": true,
          "active": true
        },
        {
          "name": "Espresso",
          "hex": "#2E1F17",
          "color3d": 3022615,
          "inStock": true,
          "active": false
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Supple goatskin suede bomber with tonal ribbed hem and collar, tailored with antique brass two-way zipper.",
      "features": [
        {
          "icon": "shield",
          "title": "Goatskin Suede",
          "desc": "Velvety hand-buffed leather"
        }
      ],
      "accordion": {
        "description": "Unlined sleeves for lightweight mobility and silk-satin body lining for effortless layering.",
        "materials": "100% Genuine Suede, Cupro Lining.",
        "fitSizing": "Classic tailored bomber fit.",
        "care": "Leather specialist clean.",
        "shipping": "White-glove priority delivery.",
        "returns": "14-day policy."
      },
      "badge": "LUXURY",
      "isNew": true
    },
    {
      "id": "minimalist-wool-zip-jacket",
      "title": "Minimalist Wool Melton Harrington",
      "handle": "minimalist-wool-zip-jacket",
      "category": "jackets",
      "subCategory": "bomber_jackets",
      "price": 4299,
      "compareAtPrice": 4999,
      "discount": "-14%",
      "rating": 4.8,
      "reviewsCount": 260,
      "image": "assets/categories/cat_jackets.jpg",
      "mainImage": "assets/categories/cat_jackets.jpg",
      "gallery": [
        "assets/categories/cat_jackets.jpg"
      ],
      "colors": [
        {
          "name": "Heather Charcoal",
          "hex": "#343332",
          "color3d": 3420978,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Clean architectural Harrington jacket in double-faced Italian wool melton with concealed zip closure.",
      "features": [
        {
          "icon": "shield",
          "title": "Double-Faced Wool",
          "desc": "Superior wind resistance & drape"
        }
      ],
      "accordion": {
        "description": "Features welt side pockets, interior cigar pocket, and minimalist storm collar.",
        "materials": "80% Wool, 20% Polyamide.",
        "fitSizing": "Structured athletic cut.",
        "care": "Dry clean only.",
        "shipping": "Ships in 24h.",
        "returns": "14-day returns."
      },
      "badge": "HOT",
      "isNew": true
    },
    {
      "id": "minimalist-fleece-hoodie",
      "title": "Essential Sand Fleece Hoodie",
      "handle": "minimalist-fleece-hoodie",
      "category": "hoodies",
      "subCategory": "pullover_hoodies",
      "price": 1999,
      "compareAtPrice": 2499,
      "discount": "-20%",
      "rating": 4.8,
      "reviewsCount": 680,
      "image": "assets/categories/cat_hoodies.jpg",
      "mainImage": "assets/categories/cat_hoodies.jpg",
      "gallery": [
        "assets/categories/cat_hoodies.jpg"
      ],
      "colors": [
        {
          "name": "Warm Sand",
          "hex": "#E8D8C4",
          "color3d": 15259844,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "400 GSM French terry hoodie in warm sand beige. Double-layered hood without drawstrings for clean silhouette.",
      "features": [
        {
          "icon": "shield",
          "title": "400 GSM",
          "desc": "Ultra-heavy French terry"
        }
      ],
      "accordion": {
        "description": "Uncompromising comfort meets architectural drape.",
        "materials": "100% Organic Cotton Terry.",
        "fitSizing": "Oversized fit.",
        "care": "Gentle wash.",
        "shipping": "Ships in 48h.",
        "returns": "14-day returns."
      },
      "badge": "ESSENTIAL",
      "isNew": true
    },
    {
      "id": "heavyweight-charcoal-zip-hoodie",
      "title": "Heavyweight Charcoal Terry Zip Hoodie",
      "handle": "heavyweight-charcoal-zip-hoodie",
      "category": "hoodies",
      "subCategory": "zip_hoodies",
      "price": 2199,
      "compareAtPrice": 2699,
      "discount": "-18%",
      "rating": 4.9,
      "reviewsCount": 410,
      "image": "assets/categories/cat_hoodies.jpg",
      "mainImage": "assets/categories/cat_hoodies.jpg",
      "gallery": [
        "assets/categories/cat_hoodies.jpg"
      ],
      "colors": [
        {
          "name": "Charcoal Melange",
          "hex": "#2A2A2A",
          "color3d": 2763306,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "480 GSM dense loopback cotton hoodie with full-length polished steel zipper and split kangaroo pocket.",
      "features": [
        {
          "icon": "shield",
          "title": "480 GSM Loopback",
          "desc": "Structured architectural weight"
        }
      ],
      "accordion": {
        "description": "Heavyweight thermal warmth with ribbed side panels for flexible range of motion.",
        "materials": "100% Ring-Spun Cotton.",
        "fitSizing": "True to size tailored fit.",
        "care": "Machine wash cold.",
        "shipping": "Ships in 24h.",
        "returns": "14-day returns."
      },
      "badge": "BESTSELLER",
      "isNew": true
    },
    {
      "id": "vintage-washed-espresso-pullover",
      "title": "Washed Espresso Relaxed Hoodie",
      "handle": "vintage-washed-espresso-pullover",
      "category": "hoodies",
      "subCategory": "pullover_hoodies",
      "price": 1899,
      "compareAtPrice": 2299,
      "discount": "-17%",
      "rating": 4.7,
      "reviewsCount": 320,
      "image": "assets/categories/cat_hoodies.jpg",
      "mainImage": "assets/categories/cat_hoodies.jpg",
      "gallery": [
        "assets/categories/cat_hoodies.jpg"
      ],
      "colors": [
        {
          "name": "Washed Espresso",
          "hex": "#3D2B24",
          "color3d": 4008740,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Pigment-dyed vintage wash cotton fleece with tonal embroidery across the wrist cuff.",
      "features": [
        {
          "icon": "shield",
          "title": "Pigment Dyed",
          "desc": "Unique lived-in color depth"
        }
      ],
      "accordion": {
        "description": "Pre-washed for velvety softness and zero shrinkage.",
        "materials": "100% Combed Cotton Fleece.",
        "fitSizing": "Relaxed slouchy drape.",
        "care": "Wash cold inside out.",
        "shipping": "Ships in 24h.",
        "returns": "14-day policy."
      },
      "badge": "POPULAR",
      "isNew": true
    },
    {
      "id": "wool-blend-tailored-blazer",
      "title": "Signature Espresso Tailored Blazer",
      "handle": "wool-blend-tailored-blazer",
      "category": "blazers",
      "subCategory": "single_breasted",
      "price": 5499,
      "compareAtPrice": 6499,
      "discount": "-15%",
      "rating": 5,
      "reviewsCount": 290,
      "image": "assets/categories/cat_blazers.jpg",
      "mainImage": "assets/categories/cat_blazers.jpg",
      "gallery": [
        "assets/categories/cat_blazers.jpg"
      ],
      "colors": [
        {
          "name": "Espresso Brown",
          "hex": "#3B261D",
          "color3d": 3876381,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "38R",
          "available": true
        },
        {
          "size": "40R",
          "available": true
        },
        {
          "size": "42R",
          "available": true
        },
        {
          "size": "44R",
          "available": true
        }
      ],
      "shortDesc": "Unstructured single-breasted blazer with soft shoulder padding and notch lapels in deep espresso brown.",
      "features": [
        {
          "icon": "shield",
          "title": "Sartorial Cut",
          "desc": "Hand-finished pick stitching"
        }
      ],
      "accordion": {
        "description": "A jacket that drapes naturally across the shoulders with timeless sartorial distinction.",
        "materials": "Wool & Cashmere blend.",
        "fitSizing": "Slim tailored silhouette.",
        "care": "Specialist dry clean.",
        "shipping": "Insured express shipping.",
        "returns": "14-day returns."
      },
      "badge": "SIGNATURE",
      "isNew": true
    },
    {
      "id": "italian-linen-summer-blazer",
      "title": "Unconstructed Italian Linen Blazer",
      "handle": "italian-linen-summer-blazer",
      "category": "blazers",
      "subCategory": "linen_blazers",
      "price": 4899,
      "compareAtPrice": 5699,
      "discount": "-14%",
      "rating": 4.9,
      "reviewsCount": 215,
      "image": "assets/categories/cat_blazers.jpg",
      "mainImage": "assets/categories/cat_blazers.jpg",
      "gallery": [
        "assets/categories/cat_blazers.jpg"
      ],
      "colors": [
        {
          "name": "Natural Flax Ecru",
          "hex": "#EBE3D3",
          "color3d": 15459283,
          "inStock": true,
          "active": true
        },
        {
          "name": "Navy Blue",
          "hex": "#1B2A4A",
          "color3d": 1780298,
          "inStock": true,
          "active": false
        }
      ],
      "sizes": [
        {
          "size": "38R",
          "available": true
        },
        {
          "size": "40R",
          "available": true
        },
        {
          "size": "42R",
          "available": true
        },
        {
          "size": "44R",
          "available": true
        }
      ],
      "shortDesc": "Breathable pure Italian linen jacket with patch pockets, natural unlined interior, and genuine horn buttons.",
      "features": [
        {
          "icon": "shield",
          "title": "Italian Linen",
          "desc": "Pure European flax fibers"
        }
      ],
      "accordion": {
        "description": "Crafted for warm-weather sophistication. The naturally relaxed crinkle exudes effortless poise.",
        "materials": "100% Italian Linen.",
        "fitSizing": "Contemporary tailored fit.",
        "care": "Dry clean.",
        "shipping": "Free express.",
        "returns": "14-day returns."
      },
      "badge": "BESTSELLER",
      "isNew": true
    },
    {
      "id": "double-breasted-midnight-blazer",
      "title": "Midnight Double-Breasted Wool Blazer",
      "handle": "double-breasted-midnight-blazer",
      "category": "blazers",
      "subCategory": "double_breasted",
      "price": 5999,
      "compareAtPrice": 6999,
      "discount": "-14%",
      "rating": 5,
      "reviewsCount": 165,
      "image": "assets/categories/cat_blazers.jpg",
      "mainImage": "assets/categories/cat_blazers.jpg",
      "gallery": [
        "assets/categories/cat_blazers.jpg"
      ],
      "colors": [
        {
          "name": "Midnight Navy",
          "hex": "#161E2E",
          "color3d": 1449518,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "38R",
          "available": true
        },
        {
          "size": "40R",
          "available": true
        },
        {
          "size": "42R",
          "available": true
        },
        {
          "size": "44R",
          "available": true
        }
      ],
      "shortDesc": "Six-on-two button configuration with sweeping peak lapels and dual side vents in high-twist wool.",
      "features": [
        {
          "icon": "shield",
          "title": "Peak Lapels",
          "desc": "Dramatic architectural silhouette"
        }
      ],
      "accordion": {
        "description": "A formal powerhouse designed for gala evenings, board meetings, and celebratory milestones.",
        "materials": "100% Super 130s Merino Wool.",
        "fitSizing": "Structured tailored cut.",
        "care": "Dry clean only.",
        "shipping": "Insured express.",
        "returns": "14-day returns."
      },
      "badge": "LUXURY",
      "isNew": true
    },
    {
      "id": "heritage-linen-kurta",
      "title": "Heritage Ivory Linen Kurta",
      "handle": "heritage-linen-kurta",
      "category": "kurtas",
      "subCategory": "casual_kurtas",
      "price": 2199,
      "compareAtPrice": 2599,
      "discount": "-15%",
      "rating": 4.9,
      "reviewsCount": 380,
      "image": "assets/categories/cat_kurtas.jpg",
      "mainImage": "assets/categories/cat_kurtas.jpg",
      "gallery": [
        "assets/categories/cat_kurtas.jpg"
      ],
      "colors": [
        {
          "name": "Ivory White",
          "hex": "#F5F2EB",
          "color3d": 16118507,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Mandarin collar short kurta in pure breathable flax linen. Refined traditional charm for modern celebrations.",
      "features": [
        {
          "icon": "shield",
          "title": "100% Linen",
          "desc": "Natural cooling flax weave"
        }
      ],
      "accordion": {
        "description": "Modernized kurta silhouette featuring concealed placket and side slit pockets.",
        "materials": "100% Pure Linen.",
        "fitSizing": "Comfort regular fit.",
        "care": "Hand wash or gentle machine wash.",
        "shipping": "Standard delivery.",
        "returns": "14-day returns."
      },
      "badge": "HERITAGE",
      "isNew": true
    },
    {
      "id": "band-collar-indigo-kurta",
      "title": "Deep Indigo Artisanal Slub Kurta",
      "handle": "band-collar-indigo-kurta",
      "category": "kurtas",
      "subCategory": "festive_kurtas",
      "price": 2499,
      "compareAtPrice": 2999,
      "discount": "-17%",
      "rating": 4.8,
      "reviewsCount": 290,
      "image": "assets/categories/cat_kurtas.jpg",
      "mainImage": "assets/categories/cat_kurtas.jpg",
      "gallery": [
        "assets/categories/cat_kurtas.jpg"
      ],
      "colors": [
        {
          "name": "Deep Indigo",
          "hex": "#1A2E40",
          "color3d": 1715776,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Hand-spun slub cotton with subtle woven self-stripes and metallic rim button accents.",
      "features": [
        {
          "icon": "shield",
          "title": "Artisan Weave",
          "desc": "Hand-loomed textured cotton"
        }
      ],
      "accordion": {
        "description": "Rich indigo tones dyed using natural vegetable dyestuffs for vintage patina.",
        "materials": "100% Hand-Loomed Cotton.",
        "fitSizing": "Tailored regular fit.",
        "care": "Cold wash separately.",
        "shipping": "Ships in 24h.",
        "returns": "14-day returns."
      },
      "badge": "FESTIVE",
      "isNew": true
    },
    {
      "id": "contemporary-sand-kurta-shirt",
      "title": "Sand Linen-Cotton Kurta Shirt",
      "handle": "contemporary-sand-kurta-shirt",
      "category": "kurtas",
      "subCategory": "casual_kurtas",
      "price": 1999,
      "compareAtPrice": 2399,
      "discount": "-17%",
      "rating": 4.9,
      "reviewsCount": 310,
      "image": "assets/categories/cat_kurtas.jpg",
      "mainImage": "assets/categories/cat_kurtas.jpg",
      "gallery": [
        "assets/categories/cat_kurtas.jpg"
      ],
      "colors": [
        {
          "name": "Sand Ecru",
          "hex": "#E8D8C4",
          "color3d": 15259844,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "A hybrid silhouette bridging traditional band-collar tunic tailoring with everyday shirt practicality.",
      "features": [
        {
          "icon": "shield",
          "title": "Linen-Cotton",
          "desc": "Wrinkle-resistant luxury blend"
        }
      ],
      "accordion": {
        "description": "Curved hemline designed to be worn untucked over trousers or chinos.",
        "materials": "55% Linen, 45% Cotton.",
        "fitSizing": "Relaxed regular silhouette.",
        "care": "Machine wash cold.",
        "shipping": "Ships in 24h.",
        "returns": "14-day returns."
      },
      "badge": "NEW",
      "isNew": true
    },
    {
      "id": "performance-knit-trackpants",
      "title": "Sleek Black Performance Track Pants",
      "handle": "performance-knit-trackpants",
      "category": "trackpants",
      "subCategory": "slim_fit_trackpants",
      "price": 1499,
      "compareAtPrice": 1899,
      "discount": "-21%",
      "rating": 4.8,
      "reviewsCount": 510,
      "image": "assets/categories/cat_trackpants.jpg",
      "mainImage": "assets/categories/cat_trackpants.jpg",
      "gallery": [
        "assets/categories/cat_trackpants.jpg"
      ],
      "colors": [
        {
          "name": "Matte Black",
          "hex": "#171412",
          "color3d": 1512466,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Athletic tailored track pants with dual side zip pockets and tapered ankle cuffs with white accent piping.",
      "features": [
        {
          "icon": "shield",
          "title": "4-Way Stretch",
          "desc": "Maximum movement & recovery"
        }
      ],
      "accordion": {
        "description": "Engineered for life on the move. Retains its sharp shape workout after workout.",
        "materials": "Poly-Elastane interlock knit.",
        "fitSizing": "Athletic tapered fit.",
        "care": "Machine wash cold.",
        "shipping": "Ships in 24h.",
        "returns": "14-day returns."
      },
      "badge": "BESTSELLER",
      "isNew": true
    },
    {
      "id": "tailored-french-terry-jogger",
      "title": "Tailored French Terry Luxury Jogger",
      "handle": "tailored-french-terry-jogger",
      "category": "trackpants",
      "subCategory": "joggers",
      "price": 1699,
      "compareAtPrice": 2099,
      "discount": "-19%",
      "rating": 4.9,
      "reviewsCount": 390,
      "image": "assets/categories/cat_trackpants.jpg",
      "mainImage": "assets/categories/cat_trackpants.jpg",
      "gallery": [
        "assets/categories/cat_trackpants.jpg"
      ],
      "colors": [
        {
          "name": "Heather Grey",
          "hex": "#525252",
          "color3d": 5395026,
          "inStock": true,
          "active": true
        },
        {
          "name": "Onyx Black",
          "hex": "#141312",
          "color3d": 1315602,
          "inStock": true,
          "active": false
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Substantial 400 GSM loopback cotton lounge pants with pintuck front pleat and metal-tipped drawstring.",
      "features": [
        {
          "icon": "shield",
          "title": "Pintuck Pleat",
          "desc": "Retains razor-sharp leg line"
        }
      ],
      "accordion": {
        "description": "Blurs the line between athletic leisurewear and tailored trousers.",
        "materials": "100% Organic Heavyweight Cotton.",
        "fitSizing": "Tapered ankle cuff.",
        "care": "Machine wash cold.",
        "shipping": "Ships in 24h.",
        "returns": "14-day policy."
      },
      "badge": "POPULAR",
      "isNew": true
    },
    {
      "id": "minimalist-olive-track-trousers",
      "title": "Minimalist Olive Technical Track Trousers",
      "handle": "minimalist-olive-track-trousers",
      "category": "trackpants",
      "subCategory": "slim_fit_trackpants",
      "price": 1799,
      "compareAtPrice": 2199,
      "discount": "-18%",
      "rating": 4.8,
      "reviewsCount": 280,
      "image": "assets/categories/cat_trackpants.jpg",
      "mainImage": "assets/categories/cat_trackpants.jpg",
      "gallery": [
        "assets/categories/cat_trackpants.jpg"
      ],
      "colors": [
        {
          "name": "Olive Drab",
          "hex": "#4C4B37",
          "color3d": 4999991,
          "inStock": true,
          "active": true
        }
      ],
      "sizes": [
        {
          "size": "S",
          "available": true
        },
        {
          "size": "M",
          "available": true
        },
        {
          "size": "L",
          "available": true
        },
        {
          "size": "XL",
          "available": true
        }
      ],
      "shortDesc": "Water-repellent double-weave technical fabric with concealed zip hems and rear magnetic pocket.",
      "features": [
        {
          "icon": "shield",
          "title": "Water-Repellent",
          "desc": "DWR coated technical weave"
        }
      ],
      "accordion": {
        "description": "Sleek utilitarian style engineered for travel, transit, and active lifestyles.",
        "materials": "90% Nylon, 10% Spandex.",
        "fitSizing": "Slim tapered silhouette.",
        "care": "Machine wash cold.",
        "shipping": "Ships in 24h.",
        "returns": "14-day returns."
      },
      "badge": "NEW DROP",
      "isNew": true
    }
  ],
  "admin": {
    "username": "admin",
    "passwordHash": "jeanscorner2026",
    "name": "Store Administrator",
    "email": "admin@jeanscorner.com",
    "role": "Super Admin"
  },
  "banners": [
    {
      "id": "banner_diwali",
      "title": "Grand Diwali Festive Sale",
      "occasion": "Diwali",
      "desktopImage": "assets/banners/banner_sale.jpg",
      "mobileImage": "assets/banners/banner_sale.jpg",
      "subtitle": "Festive Splendor & Pure Silk",
      "promotionalText": "Light up your festivities with handcrafted couture",
      "discountText": "Flat 40% Off",
      "buttonLabel": "SHOP DIWALI SALE",
      "buttonDestination": "#/collection/sale",
      "startDate": "2026-10-15",
      "endDate": "2026-11-15",
      "status": "active"
    },
    {
      "id": "banner_eid",
      "title": "Royal Eid Luxury Collection",
      "occasion": "Eid",
      "desktopImage": "assets/banners/banner_kurtas.jpg",
      "mobileImage": "assets/banners/banner_kurtas.jpg",
      "subtitle": "Timeless Elegance & Rich Embroideries",
      "promotionalText": "Celebratory kurtas and tailored festive jackets",
      "discountText": "Up to 30% Off",
      "buttonLabel": "EXPLORE EID DROP",
      "buttonDestination": "#/collection/kurtas",
      "startDate": "2026-03-20",
      "endDate": "2026-04-15",
      "status": "active"
    },
    {
      "id": "banner_winter",
      "title": "Winter Tailoring & Outerwear",
      "occasion": "Winter Collection",
      "desktopImage": "assets/banners/banner_jackets.jpg",
      "mobileImage": "assets/banners/banner_jackets.jpg",
      "subtitle": "Architectural Overcoats & Layering",
      "promotionalText": "Heavyweight cashmere, structured wool, and down jackets",
      "discountText": "New Season Preview",
      "buttonLabel": "SHOP WINTER DROP",
      "buttonDestination": "#/collection/jackets",
      "startDate": "2026-11-01",
      "endDate": "2027-02-28",
      "status": "active"
    }
  ],
  "orders": [
    {
      "id": "#JC-67344",
      "date": "23 Nov 2026",
      "createdAt": "2026-11-23T07:32:54.500Z",
      "customerName": "Alexander Vance",
      "phone": "+91 97306 54810",
      "customerPhone": "+91 97306 54810",
      "email": "alexander.vance@jeanscorner.com",
      "customerEmail": "alexander.vance@jeanscorner.com",
      "shippingAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "customerAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "city": "Solapur",
      "postalCode": "413001",
      "items": [
        {
          "id": "prod_1795418392142",
          "title": "aaaaa",
          "price": 6000,
          "size": "M",
          "color": "Olive",
          "quantity": 1,
          "image": "assets/uploads/upload_1795418346671_Gemini_Generated_Image_bujvjbujvjbujvjb_png.png"
        }
      ],
      "paymentMethod": "cod",
      "paymentStatus": "Cash on Delivery",
      "fulfillmentStatus": "Placed",
      "status": "placed",
      "subtotal": 6000,
      "deliveryFee": 0,
      "total": 6000,
      "notes": ""
    },
    {
      "id": "#JC-79570",
      "date": "23 Nov 2026",
      "createdAt": "2026-11-23T07:26:38.839Z",
      "customerName": "umar shaikh Vance",
      "phone": "+91 97306 54810",
      "customerPhone": "+91 97306 54810",
      "email": "alexander.vance@jeanscorner.com",
      "customerEmail": "alexander.vance@jeanscorner.com",
      "shippingAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "customerAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "city": "Solapur",
      "postalCode": "413001",
      "items": [
        {
          "id": "prod_1795418392142",
          "title": "aaaaa",
          "price": 6000,
          "size": "M",
          "color": "Olive",
          "quantity": 1,
          "image": "assets/uploads/upload_1795418346671_Gemini_Generated_Image_bujvjbujvjbujvjb_png.png"
        }
      ],
      "paymentMethod": "cod",
      "paymentStatus": "Cash on Delivery",
      "fulfillmentStatus": "Placed",
      "status": "placed",
      "subtotal": 6000,
      "deliveryFee": 0,
      "total": 6000,
      "notes": ""
    },
    {
      "id": "#JC-46824",
      "date": "23 Nov 2026",
      "createdAt": "2026-11-23T07:26:12.591Z",
      "customerName": "Alexander Vance",
      "phone": "+91 97306 54810",
      "customerPhone": "+91 97306 54810",
      "email": "alexander.vance@jeanscorner.com",
      "customerEmail": "alexander.vance@jeanscorner.com",
      "shippingAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "customerAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "city": "Solapur",
      "postalCode": "413001",
      "items": [
        {
          "id": "prod_1795418392142",
          "title": "aaaaa",
          "price": 6000,
          "size": "M",
          "color": "Olive",
          "quantity": 1,
          "image": "assets/uploads/upload_1795418346671_Gemini_Generated_Image_bujvjbujvjbujvjb_png.png"
        }
      ],
      "paymentMethod": "cod",
      "paymentStatus": "Cash on Delivery",
      "fulfillmentStatus": "Placed",
      "status": "placed",
      "subtotal": 6000,
      "deliveryFee": 0,
      "total": 6000,
      "notes": ""
    },
    {
      "id": "#JC-28848",
      "date": "23 Nov 2026",
      "createdAt": "2026-11-23T07:20:43.685Z",
      "customerName": "Alexander Vance",
      "phone": "+91 97306 54810",
      "customerPhone": "+91 97306 54810",
      "email": "alexander.vance@jeanscorner.com",
      "customerEmail": "alexander.vance@jeanscorner.com",
      "shippingAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "customerAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "city": "Solapur",
      "postalCode": "413001",
      "items": [
        {
          "id": "prod_1795418392142",
          "title": "aaaaa",
          "price": 6000,
          "size": "M",
          "color": "Olive",
          "quantity": 1,
          "image": "assets/uploads/upload_1795418346671_Gemini_Generated_Image_bujvjbujvjbujvjb_png.png"
        }
      ],
      "paymentMethod": "cod",
      "paymentStatus": "Cash on Delivery",
      "fulfillmentStatus": "Placed",
      "status": "placed",
      "subtotal": 6000,
      "deliveryFee": 0,
      "total": 6000,
      "notes": ""
    },
    {
      "id": "#JC-53965",
      "date": "23 Nov 2026",
      "createdAt": "2026-11-23T07:17:59.118Z",
      "customerName": "Alexander Vance",
      "phone": "+91 97306 54810",
      "customerPhone": "+91 97306 54810",
      "email": "alexander.vance@jeanscorner.com",
      "customerEmail": "alexander.vance@jeanscorner.com",
      "shippingAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "customerAddress": "742 Evergreen Avenue, Atelier Suite 400",
      "city": "Solapur",
      "postalCode": "413001",
      "items": [
        {
          "id": "heavyweight-relaxed-tee",
          "title": "Heavyweight Relaxed T-Shirt",
          "price": 899,
          "size": "S",
          "color": "Rich Mocha",
          "quantity": 1,
          "image": "assets/categories/cat_tshirts.jpg"
        }
      ],
      "paymentMethod": "cod",
      "paymentStatus": "Cash on Delivery",
      "fulfillmentStatus": "Placed",
      "status": "placed",
      "subtotal": 899,
      "deliveryFee": 99,
      "total": 998,
      "notes": ""
    },
    {
      "id": "#JC-21126",
      "date": "23 Nov 2026",
      "createdAt": "2026-11-23T07:15:01.656Z",
      "customerName": "Test Customer Solapur",
      "phone": "9730654810",
      "customerPhone": "9730654810",
      "email": "test@jeanscorner.com",
      "customerEmail": "test@jeanscorner.com",
      "shippingAddress": "42 Textile Market, Navi Peth",
      "customerAddress": "42 Textile Market, Navi Peth",
      "city": "Solapur",
      "postalCode": "413001",
      "items": [
        {
          "id": "jc-001",
          "title": "Atelier Selvedge Denim Jacket",
          "price": 1890,
          "size": "L",
          "quantity": 1
        }
      ],
      "paymentMethod": "whatsapp",
      "paymentStatus": "WhatsApp Order",
      "fulfillmentStatus": "Placed",
      "status": "placed",
      "subtotal": 1890,
      "deliveryFee": 0,
      "total": 1890,
      "notes": ""
    },
    {
      "id": "#JC-67235",
      "date": "23 Nov 2026",
      "createdAt": "2026-11-23T07:13:37.444Z",
      "customerName": "Valued Client",
      "customerPhone": "9730654810",
      "customerEmail": "",
      "customerAddress": ", Solapur -",
      "items": [
        {
          "id": "jc-001",
          "title": "Atelier Selvedge Denim Jacket",
          "price": 1890,
          "size": "L",
          "quantity": 1
        }
      ],
      "paymentMethod": "whatsapp",
      "paymentStatus": "WhatsApp Order",
      "fulfillmentStatus": "Placed",
      "status": "placed",
      "subtotal": 1890,
      "deliveryFee": 0,
      "total": 1890,
      "notes": ""
    },
    {
      "id": "JC-84920",
      "customerName": "Alexander Vance",
      "customerEmail": "alexander.vance@jeanscorner.com",
      "phone": "+1 (555) 392-1084",
      "date": "2026-11-20 14:32",
      "items": [
        {
          "title": "Tailored Poplin Shirt",
          "quantity": 2,
          "price": 95,
          "size": "L",
          "color": "White"
        },
        {
          "title": "Fine Merino Wool Blazer",
          "quantity": 1,
          "price": 340,
          "size": "40R",
          "color": "Midnight Navy"
        }
      ],
      "total": 530,
      "paymentMethod": "Credit Card",
      "paymentStatus": "Paid",
      "fulfillmentStatus": "Dispatched",
      "trackingNumber": "DHL-9842107421"
    },
    {
      "id": "JC-84921",
      "customerName": "Marcus Sterling",
      "customerEmail": "marcus.s@luxuryatelier.com",
      "phone": "+1 (555) 781-9920",
      "date": "2026-11-21 09:15",
      "items": [
        {
          "title": "Classic Oxford Button-Down",
          "quantity": 1,
          "price": 85,
          "size": "M",
          "color": "Light Blue"
        }
      ],
      "total": 85,
      "paymentMethod": "Apple Pay",
      "paymentStatus": "Paid",
      "fulfillmentStatus": "Processing",
      "trackingNumber": "PENDING"
    },
    {
      "id": "JC-84922",
      "customerName": "David K. Ross",
      "customerEmail": "d.ross@mayfairclub.co.uk",
      "phone": "+44 20 7946 0912",
      "date": "2026-11-21 16:40",
      "items": [
        {
          "title": "Textured Casual Overshirt",
          "quantity": 1,
          "price": 125,
          "size": "XL",
          "color": "Deep Olive"
        },
        {
          "title": "Pleated Linen Trouser",
          "quantity": 1,
          "price": 110,
          "size": "34",
          "color": "Warm Taupe"
        }
      ],
      "total": 235,
      "paymentMethod": "Credit Card",
      "paymentStatus": "Paid",
      "fulfillmentStatus": "Delivered",
      "trackingNumber": "DHL-8874109201"
    }
  ],
  "customers": [
    {
      "id": "cust_01",
      "name": "Alexander Vance",
      "email": "alexander.vance@jeanscorner.com",
      "phone": "+1 (555) 392-1084",
      "city": "New York, USA",
      "orderCount": 4,
      "totalSpent": 1420,
      "registeredDate": "2026-08-14"
    },
    {
      "id": "cust_02",
      "name": "Marcus Sterling",
      "email": "marcus.s@luxuryatelier.com",
      "phone": "+1 (555) 781-9920",
      "city": "Chicago, USA",
      "orderCount": 2,
      "totalSpent": 480,
      "registeredDate": "2026-09-02"
    },
    {
      "id": "cust_03",
      "name": "David K. Ross",
      "email": "d.ross@mayfairclub.co.uk",
      "phone": "+44 20 7946 0912",
      "city": "London, UK",
      "orderCount": 3,
      "totalSpent": 890,
      "registeredDate": "2026-09-28"
    }
  ],
  "activityLogs": [
    {
      "id": "log_1795419174500",
      "type": "order_created",
      "message": "New order #JC-67344 placed by Alexander Vance (Cash on Delivery) for ₹6000",
      "timestamp": "2026-11-23T07:32:54.500Z"
    },
    {
      "type": "product",
      "title": "Product updated: aaaaa",
      "time": "Just now",
      "icon": "shirt"
    },
    {
      "id": "log_1795418798840",
      "type": "order_created",
      "message": "New order #JC-79570 placed by umar shaikh Vance (Cash on Delivery) for ₹6000",
      "timestamp": "2026-11-23T07:26:38.840Z"
    },
    {
      "id": "log_1795418772591",
      "type": "order_created",
      "message": "New order #JC-46824 placed by Alexander Vance (Cash on Delivery) for ₹6000",
      "timestamp": "2026-11-23T07:26:12.591Z"
    },
    {
      "id": "log_1795418443686",
      "type": "order_created",
      "message": "New order #JC-28848 placed by Alexander Vance (Cash on Delivery) for ₹6000",
      "timestamp": "2026-11-23T07:20:43.686Z"
    },
    {
      "type": "product",
      "title": "Product updated: aaaaa",
      "time": "Just now",
      "icon": "shirt"
    },
    {
      "type": "product",
      "title": "New product added: aaaaa",
      "time": "Just now",
      "icon": "shirt"
    },
    {
      "id": "log_1795418279120",
      "type": "order_created",
      "message": "New order #JC-53965 placed by Alexander Vance (Cash on Delivery) for ₹998",
      "timestamp": "2026-11-23T07:17:59.120Z"
    },
    {
      "id": "log_1795418101656",
      "type": "order_created",
      "message": "New order #JC-21126 placed by Test Customer Solapur (WhatsApp Order) for ₹1890",
      "timestamp": "2026-11-23T07:15:01.656Z"
    },
    {
      "id": "log_1795418017447",
      "type": "order_created",
      "message": "New order #JC-67235 placed by Valued Client (WhatsApp Order) for ₹1890",
      "timestamp": "2026-11-23T07:13:37.447Z"
    },
    {
      "type": "product",
      "title": "Product deleted: Imperial Raw Silk Kurta",
      "time": "Just now",
      "icon": "trash"
    },
    {
      "type": "product",
      "title": "New product added: Imperial Raw Silk Kurta",
      "time": "Just now",
      "icon": "shirt"
    },
    {
      "type": "product",
      "title": "New product added: Signature Cashmere Overcoat",
      "time": "Just now",
      "icon": "shirt"
    },
    {
      "type": "product",
      "title": "New product added: Classic Oxford Shirt",
      "time": "12 mins ago",
      "icon": "shirt"
    },
    {
      "type": "banner",
      "title": "Banner updated: Diwali Festive Campaign",
      "time": "45 mins ago",
      "icon": "image"
    },
    {
      "type": "order",
      "title": "Order received #JC-84922 from David K. Ross",
      "time": "2 hours ago",
      "icon": "cart"
    },
    {
      "type": "stock",
      "title": "Low stock alert: Tailored Linen Blazer (3 left)",
      "time": "4 hours ago",
      "icon": "alert"
    }
  ]
};

if (typeof window !== 'undefined') {
  window.GENSCORNAR_DATA = GENSCORNAR_DATA;
}
