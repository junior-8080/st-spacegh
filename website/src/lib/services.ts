import { Building2, Bug, ClipboardList, Wrench, type LucideIcon } from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  icon: LucideIcon;
  short: string;
  intro: string;
  long: string[];
  included: string[];
  imageLabel: string;
  metaDescription: string;
};

export const services: Service[] = [
  {
    slug: "facility-management",
    title: "Facility Management",
    icon: Wrench,
    short: "Efficient operations, preventive maintenance and a safe, well-managed environment.",
    intro: "Day-to-day operations and maintenance that keep your building running smoothly, safely and efficiently.",
    long: [
      "Your building works hard every day. Our facility management service keeps it performing at its best through a structured mix of planned preventive maintenance and fast, reliable corrective repairs. We look after the systems your people depend on, from air conditioning and electrical installations to plumbing, so small issues are resolved before they become costly breakdowns.",
      "Alongside technical maintenance, our trained teams deliver professional cleaning, janitorial and grounds maintenance services that keep your premises presentable and hygienic. Every site has an agreed scope, schedule and point of contact, so you always know what is being done and when.",
      "Whether you manage a corporate office, a school, a hospital or a residential estate, we tailor the service to the way your facility is used and give you one accountable partner for the whole building.",
    ],
    included: [
      "Preventive and corrective maintenance",
      "HVAC / air-conditioning servicing",
      "Electrical maintenance",
      "Plumbing services",
      "Cleaning and janitorial services",
      "Landscaping and grounds maintenance",
    ],
    imageLabel: "Technicians servicing an air-conditioning unit",
    metaDescription:
      "Preventive maintenance, HVAC servicing, electrical, plumbing, cleaning and grounds maintenance for offices, schools, hospitals and estates in Accra and Kumasi.",
  },
  {
    slug: "asset-property-management",
    title: "Asset & Property Management",
    icon: Building2,
    short: "Protecting your investments and maximizing asset value through strategic management.",
    intro: "Strategic management that protects your property investment and keeps its value growing.",
    long: [
      "Property is one of the most valuable assets an organisation or investor holds. Our asset and property management service protects that investment with regular inspections, careful record-keeping and a clear plan for every major asset in your building.",
      "We act as your representative on site: coordinating with tenants, managing service providers and making sure lease obligations and maintenance responsibilities are met. Detailed asset registers and lifecycle planning help you budget for repairs and replacements ahead of time instead of reacting to failures.",
      "Regular, transparent reporting keeps owners and management informed about property condition, costs and priorities, so you can make confident decisions about your portfolio.",
    ],
    included: [
      "Property inspections and condition reports",
      "Tenant and lease coordination",
      "Asset registers and lifecycle planning",
      "Vendor and contractor management",
      "Regular management reporting",
    ],
    imageLabel: "Modern glass office building",
    metaDescription:
      "Property inspections, tenant and lease coordination, asset registers, lifecycle planning and vendor management for property owners in Ghana.",
  },
  {
    slug: "project-support-services",
    title: "Project & Support Services",
    icon: ClipboardList,
    short: "Specialized support for your projects and operational needs, from planning to execution.",
    intro: "Hands-on support for fit-outs, renovations, relocations and the extra capacity your operations need.",
    long: [
      "Projects such as office fit-outs, renovations and relocations can disrupt daily business if they are not well planned. Our project and support team helps you plan the work, coordinate contractors and supervise delivery so the job is completed on time and to standard.",
      "When your operations need extra hands, we provide trained manpower for short-term and ongoing assignments. From planning a move-in to coordinating a move-out and handover, we take care of the details so your team can stay focused on its core work.",
      "Every project starts with a clear scope, timeline and point of contact, and finishes with a proper handover.",
    ],
    included: [
      "Fit-out and renovation support",
      "Project planning and supervision",
      "Manpower support",
      "Move-in / move-out coordination",
      "Contractor coordination and handover",
    ],
    imageLabel: "Project team reviewing plans on site",
    metaDescription:
      "Fit-out and renovation support, project planning and supervision, manpower support and move-in/move-out coordination in Accra and Kumasi.",
  },
  {
    slug: "fumigation",
    title: "Fumigation",
    icon: Bug,
    short: "Effective pest control for healthier, cleaner and safer spaces.",
    intro: "Safe, effective pest control and disinfection that protects your people, property and reputation.",
    long: [
      "Pests spread disease, damage property and can seriously harm a business's reputation. Our fumigation service uses approved products and proven methods to eliminate infestations and keep them from coming back.",
      "Our trained officers begin with an inspection to identify the type and extent of the problem, then recommend a treatment and prevention plan suited to your premises, from homes and offices to restaurants, hospitals and warehouses. We follow strict safety procedures and advise you on how to prepare treated areas.",
      "For ongoing protection, we offer scheduled treatments that fit your environment and hygiene requirements.",
    ],
    included: [
      "General fumigation",
      "Termite control",
      "Rodent control",
      "Mosquito and insect control",
      "Disinfection services",
    ],
    imageLabel: "Fumigation officer in protective equipment",
    metaDescription:
      "Professional fumigation, termite, rodent, mosquito and insect control and disinfection for homes and businesses in Accra and Kumasi.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/** Options for the contact form's "service of interest" select. */
export const SERVICE_OPTIONS = [...services.map((service) => service.title), "Other"];
