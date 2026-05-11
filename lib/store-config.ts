export const storeConfig = {
  storeName: "NEXUS CORE",
  supportEmail: "support@nexuscore.com",
  phone: "1-800-NEXUS-CORE",
  
  hero: [
    {
      headline: "PRECISION ENGINEERED.",
      subheadline: "Where uncompromising performance meets absolute design.",
      ctaText: "EXPLORE LAPTOPS",
      ctaLink: "/products?category=laptops",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Minimalist black tech"
    },
    {
      headline: "ENTERPRISE NETWORKING.",
      subheadline: "Seamless connectivity for the modern infrastructure.",
      ctaText: "UPGRADE NETWORK",
      ctaLink: "/products?category=networking",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Network switches"
    }
  ],

  trustBar: [
    { icon: "Shield", title: "GENUINE PRODUCTS", description: "100% authentic hardware" },
    { icon: "Truck", title: "FREE DELIVERY", description: "On orders above ₹999" },
    { icon: "RefreshCw", title: "EASY RETURNS", description: "7-day hassle-free returns" },
    { icon: "Headphones", title: "EXPERT SUPPORT", description: "24/7 technical assistance" }
  ],

  categories: [
    { 
      id: "laptops", 
      name: "LAPTOPS", 
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", 
      link: "/products?category=laptops",
      subcategories: ["Gaming Laptops", "Business Laptops", "Ultrabooks", "Workstation Laptops", "Student Laptops"],
      filters: [
        { id: "brand", label: "Brand", type: "checkbox" },
        { id: "processor", label: "Processor", type: "checkbox", options: ["Intel i3", "Intel i5", "Intel i7", "Intel i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9"] },
        { id: "ram", label: "RAM", type: "checkbox", options: ["4GB", "8GB", "16GB", "32GB", "64GB"] },
        { id: "storage", label: "Storage", type: "checkbox", options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD", "HDD"] },
        { id: "displaySize", label: "Display Size", type: "checkbox", options: ["11\"", "13\"", "14\"", "15.6\"", "17.3\""] },
        { id: "gpu", label: "GPU", type: "checkbox", options: ["Integrated", "GTX Series", "RTX Series", "AMD Radeon"] },
        { id: "os", label: "OS", type: "checkbox", options: ["Windows 11", "macOS", "Linux", "FreeDOS"] }
      ]
    },
    { 
      id: "desktops", 
      name: "DESKTOPS & WORKSTATIONS", 
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80", 
      link: "/products?category=desktops",
      subcategories: ["Pre-built Gaming PCs", "Office Desktops", "All-in-One PCs", "Mini PCs", "Servers"],
      filters: [
        { id: "brand", label: "Brand", type: "checkbox" },
        { id: "processor", label: "Processor", type: "checkbox" },
        { id: "ram", label: "RAM", type: "checkbox" },
        { id: "formFactor", label: "Form Factor", type: "checkbox", options: ["Tower", "SFF", "AIO", "Mini"] }
      ]
    },
    { 
      id: "networking", 
      name: "NETWORKING", 
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80", 
      link: "/products?category=networking",
      subcategories: ["Wi-Fi Routers", "Managed Switches", "Unmanaged Switches", "Access Points", "Network Adapters", "Patch Panels", "Firewalls & UTM"],
      filters: [
        { id: "brand", label: "Brand", type: "checkbox", options: ["TP-Link", "Netgear", "Ubiquiti", "Cisco", "D-Link"] },
        { id: "standard", label: "Standard", type: "checkbox", options: ["WiFi 5", "WiFi 6", "WiFi 6E", "WiFi 7"] },
        { id: "speed", label: "Speed", type: "checkbox", options: ["100Mbps", "1Gbps", "2.5Gbps", "10Gbps"] },
        { id: "ports", label: "Ports", type: "checkbox", options: ["4", "8", "16", "24", "48"] },
        { id: "poe", label: "PoE Support", type: "checkbox", options: ["Yes", "No"] }
      ]
    },
    { 
      id: "cctv", 
      name: "CCTV & SURVEILLANCE", 
      image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80", 
      link: "/products?category=cctv",
      subcategories: ["IP Cameras", "Analog Cameras", "DVR Systems", "NVR Systems", "Complete Kits", "PTZ Cameras", "Doorbells"],
      filters: [
        { id: "brand", label: "Brand", type: "checkbox" },
        { id: "resolution", label: "Resolution", type: "checkbox", options: ["720p", "1080p", "2MP", "4MP", "8MP", "4K"] },
        { id: "cameraType", label: "Camera Type", type: "checkbox", options: ["Bullet", "Dome", "PTZ", "Fisheye"] },
        { id: "weatherproof", label: "Weatherproof", type: "checkbox", options: ["IP66", "IP67"] },
        { id: "channels", label: "Channels", type: "checkbox", options: ["4", "8", "16", "32"] }
      ]
    },
    { 
      id: "accessories", 
      name: "ACCESSORIES", 
      image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=800&q=80", 
      link: "/products?category=accessories",
      subcategories: ["Monitors", "Keyboards & Mice", "Headsets", "Webcams", "UPS & Power", "External Storage", "Cables & Adapters", "Cooling & Fans"],
      filters: [
        { id: "brand", label: "Brand", type: "checkbox" },
        { id: "compatibility", label: "Compatibility", type: "checkbox", options: ["Windows", "Mac", "Universal"] }
      ]
    }
  ],

  paginationType: 'numbered', // 'loadmore' or 'numbered'
  productsPerPage: 24,

  featuredBrands: [
    { name: "Asus", logo: "/brands/asus.png", slug: "asus" },
    { name: "Dell", logo: "/brands/dell.png", slug: "dell" },
    { name: "HP", logo: "/brands/hp.png", slug: "hp" },
    { name: "TP-Link", logo: "/brands/tplink.png", slug: "tp-link" },
    { name: "Hikvision", logo: "/brands/hikvision.png", slug: "hikvision" },
    { name: "Logitech", logo: "/brands/logitech.png", slug: "logitech" },
  ],

  footer: {
    text: "© 2026 Nexus Core. Precision engineered in the dark.",
    address: "Cyber City, Gurgaon, Haryana, India - 122002",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Returns", href: "/returns" }
    ],
    socials: [
      { platform: "Instagram", url: "#" },
      { platform: "YouTube", url: "#" },
      { platform: "WhatsApp", url: "https://wa.me/919876543210" }
    ]
  }
};
