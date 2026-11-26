export const site = {
  name: "ST-SPACE",
  fullName: "ST-SPACE Facilities Management Services",
  tagline: "We Manage Spaces. You Focus on Success.",
  description:
    "At ST-SPACE, we deliver comprehensive and innovative facilities management solutions that ensure your property, assets, and people are safe, efficient, and productive.",
  slogans: [
    "Your Space. Our Priority.",
    "One Partner. All Solutions. Exceptional Results.",
    "Professional. Reliable. Efficient. Always.",
    "Let us take care of your space so you can focus on what matters.",
  ],
  contact: {
    phone: "0244370672", // display; tel link: +233244370672
    whatsapp: "+233205935800", // wa.me/233205935800
    email: "info@st-spacegh.com",
  },
  locations: [
    { city: "Accra", address: "Beacham Street, Dansoman" },
    { city: "Kumasi", address: "Asokore Mampong" },
  ],
  hours: "24/7 support available",
};

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const links = {
  tel: "tel:+233244370672",
  phoneDisplay: "024 437 0672",
  whatsappDisplay: "020 593 5800",
  whatsapp: "https://wa.me/233205935800",
  whatsappEnquiry: "https://wa.me/233205935800?text=Hello%20ST-SPACE%2C%20I%27d%20like%20to%20enquire%20about...",
  email: `mailto:${site.contact.email}`,
};

export function whatsappLink(text: string): string {
  return `${links.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/facilities", label: "Facilities" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
