import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { services } from "@/lib/services";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.fullName} | Accra & Kumasi`,
    template: "%s | ST-SPACE Facilities Management",
  },
  description: site.description,
  applicationName: site.fullName,
  keywords: [
    "facilities management Ghana",
    "facility management Accra",
    "property management Kumasi",
    "HVAC servicing Accra",
    "fumigation Ghana",
    "cleaning services Accra",
  ],
  openGraph: {
    type: "website",
    siteName: site.fullName,
    locale: "en_GH",
    title: site.fullName,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: site.fullName, description: site.description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#0A0A0A" };

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}/#organization`,
  name: site.fullName,
  description: site.description,
  url: siteUrl,
  logo: `${siteUrl}/images/logo-mark.svg`,
  telephone: "+233244370672",
  email: site.contact.email,
  openingHours: "Mo-Su 00:00-23:59",
  areaServed: ["Accra", "Kumasi", "Ghana"],
  address: site.locations.map((location) => ({
    "@type": "PostalAddress",
    streetAddress: location.address,
    addressLocality: location.city,
    addressCountry: "GH",
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <a
          href="#main"
          className="sr-only z-[60] rounded bg-brand-gold px-4 py-2 font-semibold text-brand-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header services={services.map(({ slug, title, short }) => ({ slug, title, short }))} />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
        <JsonLd data={localBusiness} />
      </body>
    </html>
  );
}
