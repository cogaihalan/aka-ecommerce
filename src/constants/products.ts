import {
  Product,
  Category,
  Brand,
  ProductPricing,
  Inventory,
  ShippingInfo,
  MediaFile,
  SEO,
} from "@/types/product";

/**
 * Development Product Constants
 *
 * This file contains sample product data for development and testing purposes.
 * Use these constants to easily test different product scenarios without external API calls.
 */

// Sample Categories
export const SAMPLE_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    shortDescription: "Latest electronic devices",
    level: 1,
    path: "1",
    seo: {
      title: "Electronics - Latest Electronic Devices",
      description: "Shop the latest electronic devices and gadgets",
      keywords: ["electronics", "gadgets", "devices"],
    },
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: 2,
    name: "Smartphones",
    slug: "smartphones",
    description: "Latest smartphones and mobile devices",
    shortDescription: "Smartphones",
    level: 2,
    path: "1/2",
    parentId: 1,
    seo: {
      title: "Smartphones - Latest Mobile Devices",
      description: "Shop the latest smartphones and mobile devices",
      keywords: ["smartphones", "mobile", "phones"],
    },
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: 3,
    name: "Laptops",
    slug: "laptops",
    description: "Laptops and portable computers",
    shortDescription: "Laptops",
    level: 2,
    path: "1/3",
    parentId: 1,
    seo: {
      title: "Laptops - Portable Computers",
      description: "Shop laptops and portable computers",
      keywords: ["laptops", "computers", "portable"],
    },
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: 4,
    name: "Fashion",
    slug: "fashion",
    description: "Clothing and fashion accessories",
    shortDescription: "Fashion items",
    level: 1,
    path: "4",
    seo: {
      title: "Fashion - Clothing and Accessories",
      description: "Shop the latest fashion trends",
      keywords: ["fashion", "clothing", "accessories"],
    },
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: 5,
    name: "Home & Garden",
    slug: "home-garden",
    description: "Home improvement and garden supplies",
    shortDescription: "Home & Garden",
    level: 1,
    path: "5",
    seo: {
      title: "Home & Garden - Home Improvement",
      description: "Shop home improvement and garden supplies",
      keywords: ["home", "garden", "improvement"],
    },
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
];

// Sample Brands
export const SAMPLE_BRANDS: Brand[] = [
  {
    id: 1,
    name: "Apple",
    slug: "apple",
    description: "Apple Inc. is an American multinational technology company",
    shortDescription: "Apple technology products",
    logo: {
      id: 1,
      url: "https://api.slingacademy.com/public/sample-photos/10.jpeg",
      alt: "Apple Logo",
      order: 1,
      isPrimary: true,
      type: "image",
      mimeType: "image/png",
      fileSize: 1024,
    },
    website: "https://apple.com",
    country: "USA",
    foundedYear: 1976,
    seo: {
      title: "Apple - Official Store",
      description: "Shop Apple products and accessories",
      keywords: ["apple", "iphone", "macbook", "ipad"],
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: 2,
    name: "Samsung",
    slug: "samsung",
    description:
      "Samsung Electronics is a South Korean multinational electronics company",
    shortDescription: "Samsung electronics",
    logo: {
      id: 2,
      url: "https://api.slingacademy.com/public/sample-photos/11.jpeg",
      alt: "Samsung Logo",
      order: 1,
      isPrimary: true,
      type: "image",
      mimeType: "image/png",
      fileSize: 1024,
    },
    website: "https://samsung.com",
    country: "South Korea",
    foundedYear: 1969,
    seo: {
      title: "Samsung - Official Store",
      description: "Shop Samsung products and accessories",
      keywords: ["samsung", "galaxy", "tv", "appliances"],
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: 3,
    name: "Nike",
    slug: "nike",
    description:
      "Nike is an American multinational corporation that designs, develops, and markets footwear, apparel, equipment, and accessories",
    shortDescription: "Nike athletic wear",
    logo: {
      id: 3,
      url: "https://api.slingacademy.com/public/sample-photos/12.jpeg",
      alt: "Nike Logo",
      order: 1,
      isPrimary: true,
      type: "image",
      mimeType: "image/png",
      fileSize: 1024,
    },
    website: "https://nike.com",
    country: "USA",
    foundedYear: 1964,
    seo: {
      title: "Nike - Official Store",
      description: "Shop Nike shoes, apparel and accessories",
      keywords: ["nike", "shoes", "athletic", "sports"],
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
];

// Helper function to create media files
const createMediaFile = (
  id: number,
  url: string,
  alt: string,
  order: number = 1
): MediaFile => ({
  id,
  url,
  alt,
  order,
  isPrimary: order === 1,
  type: "image",
  mimeType: "image/jpeg",
  fileSize: 1024 * 1024,
  dimensions: { width: 800, height: 600 },
});

// Helper function to create pricing
const createPricing = (
  basePrice: number,
  compareAtPrice?: number
): ProductPricing => ({
  basePrice,
  compareAtPrice,
  currency: "USD",
  taxClass: "standard",
  taxRate: 0.08,
});

// Helper function to create inventory
const createInventory = (quantity: number): Inventory => ({
  quantity,
  reserved: 0,
  available: quantity,
  trackQuantity: true,
  allowBackorder: false,
  allowPreorder: false,
  minQuantity: 1,
  lowStockThreshold: 10,
  stockStatus: quantity > 0 ? "in_stock" : "out_of_stock",
  lastUpdated: new Date().toISOString(),
});

// Helper function to create shipping info
const createShippingInfo = (weight?: number): ShippingInfo => ({
  weight,
  weightUnit: "kg",
  freeShipping: weight ? weight < 5 : false,
  estimatedDeliveryDays: { min: 3, max: 7 },
});

// Helper function to create SEO
const createSEO = (
  title: string,
  description: string,
  keywords: string[] = []
): SEO => ({
  title,
  description,
  keywords,
});

// Featured Products
export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    slug: "iphone-15-pro",
    description:
      "The most advanced iPhone with titanium design and A17 Pro chip",
    shortDescription: "Latest iPhone with titanium design",
    sku: "IPH15PRO-256",
    barcode: "123456789012",
    categories: [SAMPLE_CATEGORIES[1]], // Smartphones
    primaryCategory: SAMPLE_CATEGORIES[1],
    brand: SAMPLE_BRANDS[0], // Apple
    tags: ["smartphone", "apple", "titanium", "pro"],
    images: [
      createMediaFile(
        1,
        "https://api.slingacademy.com/public/sample-photos/1.jpeg",
        "iPhone 15 Pro Front",
        1
      ),
      createMediaFile(
        2,
        "https://api.slingacademy.com/public/sample-photos/2.jpeg",
        "iPhone 15 Pro Back",
        2
      ),
    ],
    variants: [],
    hasVariants: false,
    variantAttributes: [],
    pricing: createPricing(999, 1099),
    inventory: createInventory(50),
    shipping: createShippingInfo(0.2),
    attributes: [],
    customAttributes: {
      color: "Natural Titanium",
      storage: "256GB",
      display: "6.1-inch Super Retina XDR",
    },
    relatedProducts: [],
    reviews: [],
    ratings: [],
    averageRating: 4.8,
    totalReviews: 1247,
    seo: createSEO(
      "iPhone 15 Pro - Latest Apple Smartphone",
      "Buy the latest iPhone 15 Pro with titanium design and A17 Pro chip"
    ),
    featured: true,
    status: "active",
    visibility: "catalog_search",
    publishedAt: "2024-09-15T00:00:00Z",
    productType: "simple",
    metadata: {},
    createdBy: 1,
    updatedBy: 1,
    version: 1,
    createdAt: "2024-09-15T00:00:00Z",
    updatedAt: "2024-09-15T00:00:00Z",
    isActive: true,
  },
  {
    id: 2,
    name: "MacBook Pro 16-inch",
    slug: "macbook-pro-16-inch",
    description:
      "Powerful laptop with M3 Pro chip and stunning Liquid Retina XDR display",
    shortDescription: "16-inch MacBook Pro with M3 Pro",
    sku: "MBP16-M3PRO-512",
    barcode: "123456789013",
    categories: [SAMPLE_CATEGORIES[2]], // Laptops
    primaryCategory: SAMPLE_CATEGORIES[2],
    brand: SAMPLE_BRANDS[0], // Apple
    tags: ["laptop", "macbook", "pro", "m3"],
    images: [
      createMediaFile(
        3,
        "https://api.slingacademy.com/public/sample-photos/3.jpeg",
        "MacBook Pro 16-inch",
        1
      ),
      createMediaFile(
        4,
        "https://api.slingacademy.com/public/sample-photos/4.jpeg",
        "MacBook Pro 16-inch Side",
        2
      ),
    ],
    variants: [],
    hasVariants: false,
    variantAttributes: [],
    pricing: createPricing(2499, 2699),
    inventory: createInventory(25),
    shipping: createShippingInfo(2.1),
    attributes: [],
    customAttributes: {
      processor: "M3 Pro",
      storage: "512GB SSD",
      memory: "18GB Unified Memory",
      display: "16.2-inch Liquid Retina XDR",
    },
    relatedProducts: [],
    reviews: [],
    ratings: [],
    averageRating: 4.9,
    totalReviews: 892,
    seo: createSEO(
      "MacBook Pro 16-inch - M3 Pro Chip",
      "Buy the latest MacBook Pro with M3 Pro chip and 16-inch display"
    ),
    featured: true,
    status: "active",
    visibility: "catalog_search",
    publishedAt: "2024-10-30T00:00:00Z",
    productType: "simple",
    metadata: {},
    createdBy: 1,
    updatedBy: 1,
    version: 1,
    createdAt: "2024-10-30T00:00:00Z",
    updatedAt: "2024-10-30T00:00:00Z",
    isActive: true,
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    description:
      "Premium Android smartphone with S Pen and advanced camera system",
    shortDescription: "Galaxy S24 Ultra with S Pen",
    sku: "GALAXY-S24-ULTRA-256",
    barcode: "123456789014",
    categories: [SAMPLE_CATEGORIES[1]], // Smartphones
    primaryCategory: SAMPLE_CATEGORIES[1],
    brand: SAMPLE_BRANDS[1], // Samsung
    tags: ["smartphone", "samsung", "galaxy", "s-pen"],
    images: [
      createMediaFile(
        5,
        "https://api.slingacademy.com/public/sample-photos/5.jpeg",
        "Galaxy S24 Ultra",
        1
      ),
      createMediaFile(
        6,
        "https://api.slingacademy.com/public/sample-photos/6.jpeg",
        "Galaxy S24 Ultra Back",
        2
      ),
    ],
    variants: [],
    hasVariants: false,
    variantAttributes: [],
    pricing: createPricing(1199, 1299),
    inventory: createInventory(75),
    shipping: createShippingInfo(0.23),
    attributes: [],
    customAttributes: {
      color: "Titanium Black",
      storage: "256GB",
      display: "6.8-inch Dynamic AMOLED 2X",
      sPen: true,
    },
    relatedProducts: [],
    reviews: [],
    ratings: [],
    averageRating: 4.7,
    totalReviews: 2156,
    seo: createSEO(
      "Samsung Galaxy S24 Ultra - S Pen Included",
      "Buy the latest Galaxy S24 Ultra with S Pen and advanced camera"
    ),
    featured: true,
    status: "active",
    visibility: "catalog_search",
    publishedAt: "2024-01-17T00:00:00Z",
    productType: "simple",
    metadata: {},
    createdBy: 1,
    updatedBy: 1,
    version: 1,
    createdAt: "2024-01-17T00:00:00Z",
    updatedAt: "2024-01-17T00:00:00Z",
    isActive: true,
  },
];

// Regular Products
export const REGULAR_PRODUCTS: Product[] = [
  {
    id: 4,
    name: "AirPods Pro (2nd generation)",
    slug: "airpods-pro-2nd-generation",
    description:
      "Wireless earbuds with active noise cancellation and spatial audio",
    shortDescription: "AirPods Pro with noise cancellation",
    sku: "AIRPODS-PRO-2ND",
    barcode: "123456789015",
    categories: [SAMPLE_CATEGORIES[0]], // Electronics
    primaryCategory: SAMPLE_CATEGORIES[0],
    brand: SAMPLE_BRANDS[0], // Apple
    tags: ["earbuds", "wireless", "noise-cancellation", "apple"],
    images: [
      createMediaFile(
        7,
        "https://api.slingacademy.com/public/sample-photos/7.jpeg",
        "AirPods Pro",
        1
      ),
    ],
    variants: [],
    hasVariants: false,
    variantAttributes: [],
    pricing: createPricing(249, 299),
    inventory: createInventory(200),
    shipping: createShippingInfo(0.05),
    attributes: [],
    customAttributes: {
      connectivity: "Bluetooth 5.3",
      batteryLife: "6 hours (with ANC)",
      charging: "USB-C",
    },
    relatedProducts: [],
    reviews: [],
    ratings: [],
    averageRating: 4.6,
    totalReviews: 3421,
    seo: createSEO(
      "AirPods Pro 2nd Generation - Noise Cancellation",
      "Buy AirPods Pro with active noise cancellation and spatial audio"
    ),
    featured: false,
    status: "active",
    visibility: "catalog_search",
    publishedAt: "2024-09-22T00:00:00Z",
    productType: "simple",
    metadata: {},
    createdBy: 1,
    updatedBy: 1,
    version: 1,
    createdAt: "2024-09-22T00:00:00Z",
    updatedAt: "2024-09-22T00:00:00Z",
    isActive: true,
  },
  {
    id: 5,
    name: "Nike Air Max 270",
    slug: "nike-air-max-270",
    description: "Comfortable running shoes with Max Air cushioning",
    shortDescription: "Nike Air Max 270 running shoes",
    sku: "NIKE-AM270-BLK-10",
    barcode: "123456789016",
    categories: [SAMPLE_CATEGORIES[3]], // Fashion
    primaryCategory: SAMPLE_CATEGORIES[3],
    brand: SAMPLE_BRANDS[2], // Nike
    tags: ["shoes", "running", "nike", "air-max"],
    images: [
      createMediaFile(
        8,
        "https://api.slingacademy.com/public/sample-photos/8.jpeg",
        "Nike Air Max 270",
        1
      ),
    ],
    variants: [],
    hasVariants: true,
    variantAttributes: ["size", "color"],
    pricing: createPricing(150, 180),
    inventory: createInventory(100),
    shipping: createShippingInfo(0.8),
    attributes: [],
    customAttributes: {
      size: "10",
      color: "Black/White",
      material: "Mesh and synthetic",
    },
    relatedProducts: [],
    reviews: [],
    ratings: [],
    averageRating: 4.4,
    totalReviews: 1876,
    seo: createSEO(
      "Nike Air Max 270 - Running Shoes",
      "Buy Nike Air Max 270 with Max Air cushioning for comfort"
    ),
    featured: false,
    status: "active",
    visibility: "catalog_search",
    publishedAt: "2024-03-15T00:00:00Z",
    productType: "configurable",
    metadata: {},
    createdBy: 1,
    updatedBy: 1,
    version: 1,
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-03-15T00:00:00Z",
    isActive: true,
  },
  {
    id: 6,
    name: "Samsung 55-inch 4K Smart TV",
    slug: "samsung-55-inch-4k-smart-tv",
    description: "55-inch 4K UHD Smart TV with Quantum Dot technology",
    shortDescription: "55-inch 4K Smart TV",
    sku: "SAMSUNG-TV-55-4K",
    barcode: "123456789017",
    categories: [SAMPLE_CATEGORIES[0]], // Electronics
    primaryCategory: SAMPLE_CATEGORIES[0],
    brand: SAMPLE_BRANDS[1], // Samsung
    tags: ["tv", "4k", "smart", "samsung"],
    images: [
      createMediaFile(
        9,
        "https://api.slingacademy.com/public/sample-photos/9.jpeg",
        "Samsung 55-inch TV",
        1
      ),
    ],
    variants: [],
    hasVariants: false,
    variantAttributes: [],
    pricing: createPricing(899, 1099),
    inventory: createInventory(30),
    shipping: createShippingInfo(15.5),
    attributes: [],
    customAttributes: {
      screenSize: "55 inches",
      resolution: "4K UHD (3840 x 2160)",
      smartFeatures: "Tizen OS",
      connectivity: "WiFi, Bluetooth, HDMI, USB",
    },
    relatedProducts: [],
    reviews: [],
    ratings: [],
    averageRating: 4.5,
    totalReviews: 923,
    seo: createSEO(
      "Samsung 55-inch 4K Smart TV",
      "Buy Samsung 55-inch 4K Smart TV with Quantum Dot technology"
    ),
    featured: false,
    status: "active",
    visibility: "catalog_search",
    publishedAt: "2024-02-10T00:00:00Z",
    productType: "simple",
    metadata: {},
    createdBy: 1,
    updatedBy: 1,
    version: 1,
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-10T00:00:00Z",
    isActive: true,
  },
];

// Test Products for specific scenarios
export const TEST_PRODUCTS: Product[] = [
  {
    id: 7,
    name: "Test Product - Out of Stock",
    slug: "test-product-out-of-stock",
    description: "This is a test product that is out of stock",
    shortDescription: "Test product - out of stock",
    sku: "TEST-OOS-001",
    barcode: "123456789018",
    categories: [SAMPLE_CATEGORIES[0]], // Electronics
    primaryCategory: SAMPLE_CATEGORIES[0],
    tags: ["test", "out-of-stock"],
    images: [
      createMediaFile(
        10,
        "https://api.slingacademy.com/public/sample-photos/10.jpeg",
        "Test Product",
        1
      ),
    ],
    variants: [],
    hasVariants: false,
    variantAttributes: [],
    pricing: createPricing(99),
    inventory: createInventory(0), // Out of stock
    shipping: createShippingInfo(0.5),
    attributes: [],
    customAttributes: {},
    relatedProducts: [],
    reviews: [],
    ratings: [],
    averageRating: 0,
    totalReviews: 0,
    seo: createSEO(
      "Test Product - Out of Stock",
      "Test product for out of stock scenarios"
    ),
    featured: false,
    status: "active",
    visibility: "catalog_search",
    publishedAt: "2024-01-01T00:00:00Z",
    productType: "simple",
    metadata: {},
    createdBy: 1,
    updatedBy: 1,
    version: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: 8,
    name: "Test Product - Inactive",
    slug: "test-product-inactive",
    description: "This is a test product that is inactive",
    shortDescription: "Test product - inactive",
    sku: "TEST-INACTIVE-001",
    barcode: "123456789019",
    categories: [SAMPLE_CATEGORIES[0]], // Electronics
    primaryCategory: SAMPLE_CATEGORIES[0],
    tags: ["test", "inactive"],
    images: [
      createMediaFile(
        11,
        "https://api.slingacademy.com/public/sample-photos/11.jpeg",
        "Test Product Inactive",
        1
      ),
    ],
    variants: [],
    hasVariants: false,
    variantAttributes: [],
    pricing: createPricing(199),
    inventory: createInventory(50),
    shipping: createShippingInfo(1.0),
    attributes: [],
    customAttributes: {},
    relatedProducts: [],
    reviews: [],
    ratings: [],
    averageRating: 0,
    totalReviews: 0,
    seo: createSEO(
      "Test Product - Inactive",
      "Test product for inactive scenarios"
    ),
    featured: false,
    status: "inactive",
    visibility: "not_visible",
    publishedAt: "2024-01-01T00:00:00Z",
    productType: "simple",
    metadata: {},
    createdBy: 1,
    updatedBy: 1,
    version: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    isActive: false,
  },
];

// All products combined
export const ALL_DEV_PRODUCTS: Product[] = [
  ...FEATURED_PRODUCTS,
  ...REGULAR_PRODUCTS,
  ...TEST_PRODUCTS,
];

// Product lists for easy access
export const FEATURED_PRODUCT_IDS = FEATURED_PRODUCTS.map(
  (product) => product.id
);
export const REGULAR_PRODUCT_IDS = REGULAR_PRODUCTS.map(
  (product) => product.id
);
export const TEST_PRODUCT_IDS = TEST_PRODUCTS.map((product) => product.id);
export const ALL_PRODUCT_IDS = ALL_DEV_PRODUCTS.map((product) => product.id);

// Helper functions
export const getProductById = (id: number): Product | undefined => {
  return ALL_DEV_PRODUCTS.find((product) => product.id === id);
};

export const getProductsByCategory = (categoryId: number): Product[] => {
  return ALL_DEV_PRODUCTS.filter((product) =>
    product.categories.some((cat) => cat.id === categoryId)
  );
};

export const getProductsByBrand = (brandId: number): Product[] => {
  return ALL_DEV_PRODUCTS.filter((product) => product.brand?.id === brandId);
};

export const getFeaturedProducts = (): Product[] => {
  return ALL_DEV_PRODUCTS.filter((product) => product.featured);
};

export const getActiveProducts = (): Product[] => {
  return ALL_DEV_PRODUCTS.filter(
    (product) => product.isActive && product.status === "active"
  );
};

export const getInactiveProducts = (): Product[] => {
  return ALL_DEV_PRODUCTS.filter(
    (product) => !product.isActive || product.status !== "active"
  );
};

export const getInStockProducts = (): Product[] => {
  return ALL_DEV_PRODUCTS.filter(
    (product) => product.inventory.stockStatus === "in_stock"
  );
};

export const getOutOfStockProducts = (): Product[] => {
  return ALL_DEV_PRODUCTS.filter(
    (product) => product.inventory.stockStatus === "out_of_stock"
  );
};

export const getRandomProduct = (): Product => {
  const randomIndex = Math.floor(Math.random() * ALL_DEV_PRODUCTS.length);
  return ALL_DEV_PRODUCTS[randomIndex];
};

export const getRandomProducts = (count: number): Product[] => {
  const shuffled = [...ALL_DEV_PRODUCTS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return ALL_DEV_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getProductsByPriceRange = (
  minPrice: number,
  maxPrice: number
): Product[] => {
  return ALL_DEV_PRODUCTS.filter(
    (product) =>
      product.pricing.basePrice >= minPrice &&
      product.pricing.basePrice <= maxPrice
  );
};

// Quick access to specific products
export const DEV_PRODUCT_CONSTANTS = {
  FEATURED: {
    IPHONE: FEATURED_PRODUCTS[0],
    MACBOOK: FEATURED_PRODUCTS[1],
    GALAXY: FEATURED_PRODUCTS[2],
  },
  REGULAR: {
    AIRPODS: REGULAR_PRODUCTS[0],
    NIKE_SHOES: REGULAR_PRODUCTS[1],
    SAMSUNG_TV: REGULAR_PRODUCTS[2],
  },
  TEST: {
    OUT_OF_STOCK: TEST_PRODUCTS[0],
    INACTIVE: TEST_PRODUCTS[1],
  },
} as const;

// Category and brand helpers
export const getCategoryById = (id: number): Category | undefined => {
  return SAMPLE_CATEGORIES.find((category) => category.id === id);
};

export const getBrandById = (id: number): Brand | undefined => {
  return SAMPLE_BRANDS.find((brand) => brand.id === id);
};

// Product validation helpers
export const isValidProductId = (id: number): boolean => {
  return ALL_PRODUCT_IDS.includes(id);
};

export const isFeaturedProduct = (id: number): boolean => {
  return FEATURED_PRODUCT_IDS.includes(id);
};

export const isActiveProduct = (id: number): boolean => {
  const product = getProductById(id);
  return product ? product.isActive && product.status === "active" : false;
};

export const isInStockProduct = (id: number): boolean => {
  const product = getProductById(id);
  return product ? product.inventory.stockStatus === "in_stock" : false;
};

