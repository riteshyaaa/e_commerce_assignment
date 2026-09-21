import { PrismaClient, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Starting database seeding for NOVA Modern Essentials...');

  // Clean existing tables in correct order
  console.log('[SEED] Cleaning existing database records...');
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.admin.deleteMany();

  // 1. Seed Admin
  console.log('[SEED] Seeding Admin accounts...');
  const passwordHash = await bcrypt.hash('AdminPassword123!', 10);
  const admin = await prisma.admin.create({
    data: {
      name: 'NOVA Administrator',
      email: 'admin@nova-store.com',
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`[SEED] Created admin user: ${admin.email}`);

  // 2. Seed Categories
  console.log('[SEED] Seeding Categories...');
  const categoriesData = [
    {
      name: 'Audio',
      slug: 'audio',
      description: 'Precision acoustics, wireless freedom, and studio-grade sound engineering.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    },
    {
      name: 'Wearables & Watches',
      slug: 'wearables-and-watches',
      description: 'Minimalist timepieces and smart essentials engineered for effortless sophistication.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    },
    {
      name: 'Bags & Travel',
      slug: 'bags-and-travel',
      description: 'Weatherproof technical packs, leather weekenders, and EDC organizers.',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    },
    {
      name: 'Footwear',
      slug: 'footwear',
      description: 'Ergonomic minimalist sneakers crafted from sustainable Italian leather.',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    },
    {
      name: 'Smart Accessories',
      slug: 'smart-accessories',
      description: 'CNC-machined aluminum chargers, magnetic docks, and desk gear.',
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop',
    },
    {
      name: 'Lifestyle & Everyday',
      slug: 'lifestyle-and-everyday',
      description: 'Titanium pens, vacuum-insulated thermals, and leather accessories.',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop',
    },
  ];

  const createdCategories = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    createdCategories.set(cat.slug, created.id);
  }
  console.log(`[SEED] Created ${createdCategories.size} categories.`);

  // 3. Seed Products (30 high quality realistic products)
  console.log('[SEED] Seeding Products...');

  const productsData = [
    // AUDIO
    {
      name: 'NOVA Pulse Wireless Headphones',
      slug: 'nova-pulse-wireless-headphones',
      description: 'Engineered for pure acoustics. The NOVA Pulse features hybrid active noise cancellation (ANC), custom 40mm titanium drivers, ultra-soft memory foam earcups, and up to 45 hours of high-resolution playback on a single charge.',
      price: 8499,
      compareAtPrice: 11999,
      stock: 28,
      sku: 'NOV-AUD-001',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: true,
      rating: 4.9,
      reviewCount: 38,
      categorySlug: 'audio',
      images: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop',
      ],
    },
    {
      name: 'NOVA Air Pro Earbuds',
      slug: 'nova-air-pro-earbuds',
      description: 'Ultra-lightweight true wireless earbuds with spatial audio tracking, dual beamforming microphones, IPX7 water resistance, and an anodized aluminum wireless charging case.',
      price: 4999,
      compareAtPrice: 6999,
      stock: 3, // LOW STOCK
      sku: 'NOV-AUD-002',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: true,
      rating: 4.8,
      reviewCount: 42,
      categorySlug: 'audio',
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=1000&auto=format&fit=crop',
      ],
    },
    {
      name: 'NOVA Studio Desk Speaker',
      slug: 'nova-studio-desk-speaker',
      description: 'Minimalist desktop acoustic speaker with walnut wood finish, 60W room-filling acoustic output, lossless Bluetooth 5.3, and optical inputs.',
      price: 12999,
      compareAtPrice: 15499,
      stock: 14,
      sku: 'NOV-AUD-003',
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.7,
      reviewCount: 19,
      categorySlug: 'audio',
      images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA SoundBar Slim',
      slug: 'nova-soundbar-slim',
      description: 'Ultra-low profile soundbar designed for seamless under-monitor placement. Features Dolby Atmos pass-through and integrated dual subwoofers.',
      price: 9499,
      compareAtPrice: 12999,
      stock: 0, // OUT OF STOCK
      sku: 'NOV-AUD-004',
      imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.OUT_OF_STOCK,
      featured: false,
      rating: 4.6,
      reviewCount: 11,
      categorySlug: 'audio',
      images: ['https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Clarity Podcast Mic',
      slug: 'nova-clarity-podcast-mic',
      description: 'Broadcast-grade cardioid condenser microphone with internal shockmount and zero-latency headphone monitoring.',
      price: 6499,
      compareAtPrice: 7999,
      stock: 19,
      sku: 'NOV-AUD-005',
      imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.8,
      reviewCount: 29,
      categorySlug: 'audio',
      images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop'],
    },

    // WEARABLES & WATCHES
    {
      name: 'NOVA Chrono Minimalist Watch',
      slug: 'nova-chrono-minimalist-watch',
      description: 'A masterpiece of Scandinavian minimalism. Crafted from 316L medical-grade stainless steel with sapphire crystal glass, Japanese quartz movement, and interchangeable top-grain leather strap.',
      price: 9999,
      compareAtPrice: 13500,
      stock: 22,
      sku: 'NOV-WAT-001',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: true,
      rating: 5.0,
      reviewCount: 56,
      categorySlug: 'wearables-and-watches',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop',
      ],
    },
    {
      name: 'NOVA Horizon Black Edition Watch',
      slug: 'nova-horizon-black-edition-watch',
      description: 'Matte black PVD coating with sunray dial, minimalist date window, and water resistance up to 50 meters.',
      price: 11499,
      compareAtPrice: 14999,
      stock: 2, // LOW STOCK
      sku: 'NOV-WAT-002',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: true,
      rating: 4.9,
      reviewCount: 31,
      categorySlug: 'wearables-and-watches',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
      ],
    },
    {
      name: 'NOVA Smart Band Titanium',
      slug: 'nova-smart-band-titanium',
      description: 'Discreet health tracker without a glowing screen. Tracks heart rate variability, sleep stages, stress levels, and temperature with 7-day battery life.',
      price: 6999,
      compareAtPrice: 8999,
      stock: 35,
      sku: 'NOV-WAT-003',
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.7,
      reviewCount: 22,
      categorySlug: 'wearables-and-watches',
      images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Classic Leather Strap (Tan)',
      slug: 'nova-classic-leather-strap-tan',
      description: 'Hand-stitched Italian vegetable-tanned leather strap with quick-release spring bars. Compatible with all 20mm and 22mm watch lugs.',
      price: 1899,
      compareAtPrice: 2499,
      stock: 45,
      sku: 'NOV-WAT-004',
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.6,
      reviewCount: 17,
      categorySlug: 'wearables-and-watches',
      images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Lunar Automatic Timepiece',
      slug: 'nova-lunar-automatic-timepiece',
      description: 'Self-winding Japanese automatic movement with exhibition caseback, moonphase complication, and curved sapphire glass.',
      price: 18999,
      compareAtPrice: 24000,
      stock: 0, // OUT OF STOCK
      sku: 'NOV-WAT-005',
      imageUrl: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.OUT_OF_STOCK,
      featured: false,
      rating: 4.9,
      reviewCount: 15,
      categorySlug: 'wearables-and-watches',
      images: ['https://images.unsplash.com/photo-1533139502658-0198f920d8e8?q=80&w=1000&auto=format&fit=crop'],
    },

    // BAGS & TRAVEL
    {
      name: 'NOVA Commuter Tech Backpack 22L',
      slug: 'nova-commuter-tech-backpack-22l',
      description: 'Engineered from waterproof 840D Cordura ballistic nylon. Features a dedicated suspended 16" MacBook compartment, magnetic Fidlock buckles, hidden passport pocket, and luggage pass-through.',
      price: 7999,
      compareAtPrice: 10999,
      stock: 18,
      sku: 'NOV-BAG-001',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: true,
      rating: 4.9,
      reviewCount: 64,
      categorySlug: 'bags-and-travel',
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop',
      ],
    },
    {
      name: 'NOVA Weekender Duffel 40L',
      slug: 'nova-weekender-duffel-40l',
      description: 'The ultimate travel companion. Expandable main compartment, isolated ventilated shoe pocket, water-resistant zippers, and detachable padded shoulder strap.',
      price: 8999,
      compareAtPrice: 11999,
      stock: 4, // LOW STOCK
      sku: 'NOV-BAG-002',
      imageUrl: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: true,
      rating: 4.8,
      reviewCount: 37,
      categorySlug: 'bags-and-travel',
      images: ['https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Minimal Crossbody Sling',
      slug: 'nova-minimal-crossbody-sling',
      description: 'Compact 4L everyday carry sling with quick-release magnetic strap, weather-sealed zippers, and internal fleece-lined tablet pocket.',
      price: 3499,
      compareAtPrice: 4499,
      stock: 26,
      sku: 'NOV-BAG-003',
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.7,
      reviewCount: 28,
      categorySlug: 'bags-and-travel',
      images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Tech Organizer Pouch',
      slug: 'nova-tech-organizer-pouch',
      description: 'Origami-style expandable pockets organize cables, chargers, dongles, power banks, and hard drives in a sleek water-repellent shell.',
      price: 2199,
      compareAtPrice: 2899,
      stock: 50,
      sku: 'NOV-BAG-004',
      imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.9,
      reviewCount: 45,
      categorySlug: 'bags-and-travel',
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Leather Passport Wallet',
      slug: 'nova-leather-passport-wallet',
      description: 'RFID-blocking full-grain leather travel wallet. Fits 2 passports, 6 cards, boarding passes, and includes a micro travel pen.',
      price: 2499,
      compareAtPrice: 3299,
      stock: 1, // LOW STOCK
      sku: 'NOV-BAG-005',
      imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.8,
      reviewCount: 19,
      categorySlug: 'bags-and-travel',
      images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000&auto=format&fit=crop'],
    },

    // FOOTWEAR
    {
      name: 'NOVA Clean Leather Court Sneaker',
      slug: 'nova-clean-leather-court-sneaker',
      description: 'Handcrafted in Portugal using full-grain Italian Nappa leather. Cushioned Margom rubber sole with memory-foam antibacterial insoles.',
      price: 6999,
      compareAtPrice: 9499,
      stock: 31,
      sku: 'NOV-FTW-001',
      imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: true,
      rating: 4.9,
      reviewCount: 48,
      categorySlug: 'footwear',
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
      ],
    },
    {
      name: 'NOVA Knit Runner Pro',
      slug: 'nova-knit-runner-pro',
      description: 'Breathable recycled knit upper with high-rebound supercritical foam midsole for cloud-like all-day cushioning.',
      price: 5499,
      compareAtPrice: 7299,
      stock: 24,
      sku: 'NOV-FTW-002',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.7,
      reviewCount: 33,
      categorySlug: 'footwear',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Chelsea Boot (Charcoal Suede)',
      slug: 'nova-chelsea-boot-charcoal-suede',
      description: 'Water-resistant Italian suede with Goodyear-welted rubber lug sole and elastic side gussets for effortless slip-on comfort.',
      price: 10999,
      compareAtPrice: 13999,
      stock: 5, // LOW STOCK
      sku: 'NOV-FTW-003',
      imageUrl: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.9,
      reviewCount: 21,
      categorySlug: 'footwear',
      images: ['https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Everyday Minimal Mule',
      slug: 'nova-everyday-minimal-mule',
      description: 'Modern indoor-outdoor mule featuring sculpted cork footbed and soft nubuck upper.',
      price: 4299,
      compareAtPrice: 5499,
      stock: 0, // OUT OF STOCK
      sku: 'NOV-FTW-004',
      imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.OUT_OF_STOCK,
      featured: false,
      rating: 4.5,
      reviewCount: 14,
      categorySlug: 'footwear',
      images: ['https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1000&auto=format&fit=crop'],
    },

    // SMART ACCESSORIES
    {
      name: 'NOVA MagDock 3-in-1 Aluminum Stand',
      slug: 'nova-magdock-3-in-1-aluminum-stand',
      description: 'Machined from solid aerospace-grade aluminum. Simultaneously fast-charges iPhone (15W MagSafe), Apple Watch, and AirPods with weighted anti-slip base.',
      price: 5999,
      compareAtPrice: 7999,
      stock: 38,
      sku: 'NOV-ACC-001',
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: true,
      rating: 4.9,
      reviewCount: 72,
      categorySlug: 'smart-accessories',
      images: [
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop',
      ],
    },
    {
      name: 'NOVA Precision Anodized Stylus',
      slug: 'nova-precision-anodized-stylus',
      description: 'Ultra-responsive digital stylus with tilt sensitivity, magnetic wireless charging, and palm rejection for digital creators.',
      price: 3799,
      compareAtPrice: 4999,
      stock: 17,
      sku: 'NOV-ACC-002',
      imageUrl: 'https://images.unsplash.com/photo-1585336261026-77884d3b6a95?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.7,
      reviewCount: 24,
      categorySlug: 'smart-accessories',
      images: ['https://images.unsplash.com/photo-1585336261026-77884d3b6a95?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Slim Power Bank 10,000mAh',
      slug: 'nova-slim-power-bank-10000mah',
      description: 'Ultra-thin 9mm profile with 30W Power Delivery USB-C input/output and textured matte finish.',
      price: 2999,
      compareAtPrice: 3999,
      stock: 3, // LOW STOCK
      sku: 'NOV-ACC-003',
      imageUrl: 'https://images.unsplash.com/photo-1609592424308-f4639e7df112?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.8,
      reviewCount: 39,
      categorySlug: 'smart-accessories',
      images: ['https://images.unsplash.com/photo-1609592424308-f4639e7df112?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Smart Key Organizer (Titanium)',
      slug: 'nova-smart-key-organizer-titanium',
      description: 'Eliminates noisy key jingle. Holds up to 8 keys with integrated bottle opener and Bluetooth tracking module.',
      price: 1999,
      compareAtPrice: 2699,
      stock: 42,
      sku: 'NOV-ACC-004',
      imageUrl: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.6,
      reviewCount: 18,
      categorySlug: 'smart-accessories',
      images: ['https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1000&auto=format&fit=crop'],
    },

    // LIFESTYLE & EVERYDAY
    {
      name: 'NOVA Thermal Tumbler 600ml',
      slug: 'nova-thermal-tumbler-600ml',
      description: 'Double-wall vacuum insulation with ceramic interior lining that preserves pure taste. Keeps drinks cold for 24h or hot for 12h with leakproof magnetic lid.',
      price: 2499,
      compareAtPrice: 3199,
      stock: 60,
      sku: 'NOV-LIF-001',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: true,
      rating: 4.9,
      reviewCount: 85,
      categorySlug: 'lifestyle-and-everyday',
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop',
      ],
    },
    {
      name: 'NOVA Minimal Desk Mat (Vegan Leather)',
      slug: 'nova-minimal-desk-mat-vegan-leather',
      description: 'Dual-sided water-resistant desk pad with micro-textured surface for high-precision mouse tracking and edge-to-edge stitching.',
      price: 1899,
      compareAtPrice: 2499,
      stock: 33,
      sku: 'NOV-LIF-002',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.8,
      reviewCount: 41,
      categorySlug: 'lifestyle-and-everyday',
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Titanium Bolt-Action Pen',
      slug: 'nova-titanium-bolt-action-pen',
      description: 'Precision machined from Grade 5 titanium. Features smooth mechanical bolt-action deployment and accepts Schmidt easyFLOW 9000 refills.',
      price: 3999,
      compareAtPrice: 5299,
      stock: 12,
      sku: 'NOV-LIF-003',
      imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 5.0,
      reviewCount: 27,
      categorySlug: 'lifestyle-and-everyday',
      images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Scented Soy Candle (Cedar & Amber)',
      slug: 'nova-scented-soy-candle-cedar-amber',
      description: 'Hand-poured 100% soy wax with natural wood wick in a matte ceramic jar. Notes of dark cedarwood, warm amber, and smoked vanilla.',
      price: 1499,
      compareAtPrice: 1999,
      stock: 4, // LOW STOCK
      sku: 'NOV-LIF-004',
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ACTIVE,
      featured: false,
      rating: 4.7,
      reviewCount: 32,
      categorySlug: 'lifestyle-and-everyday',
      images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Concept Carbon Fiber Briefcase',
      slug: 'nova-concept-carbon-fiber-briefcase',
      description: 'Experimental aerodynamic briefcase constructed with real carbon fiber weave and titanium hardware.',
      price: 32999,
      compareAtPrice: 42000,
      stock: 8,
      sku: 'NOV-PRO-001',
      imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.DRAFT, // DRAFT STATUS EXAMPLE
      featured: false,
      rating: 5.0,
      reviewCount: 2,
      categorySlug: 'bags-and-travel',
      images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop'],
    },
    {
      name: 'NOVA Vintage Leather Journal (Archived Edition)',
      slug: 'nova-vintage-leather-journal-archived',
      description: 'Archived collector edition with hand-bound cotton rag paper.',
      price: 2999,
      compareAtPrice: 3999,
      stock: 0,
      sku: 'NOV-ARC-001',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
      status: ProductStatus.ARCHIVED, // ARCHIVED STATUS EXAMPLE
      featured: false,
      rating: 4.6,
      reviewCount: 8,
      categorySlug: 'lifestyle-and-everyday',
      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop'],
    },
  ];

  for (const prod of productsData) {
    const categoryId = createdCategories.get(prod.categorySlug);
    if (!categoryId) continue;

    const { categorySlug, images, ...productFields } = prod;

    await prisma.product.create({
      data: {
        ...productFields,
        categoryId,
        images: {
          create: images.map((url, idx) => ({
            url,
            sortOrder: idx,
          })),
        },
      },
    });
  }

  console.log(`[SEED] Successfully seeded ${productsData.length} products!`);
  console.log('[SEED] Database seeding complete! 🎉');
}

main()
  .catch((e) => {
    console.error('[SEED ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
