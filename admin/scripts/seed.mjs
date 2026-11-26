// Seeds MongoDB with sample blog posts and job vacancies.
// Run with: npm run seed   (reads MONGODB_URI from .env.local)
// WARNING: clears the `posts`, `jobs` and `facilities` collections before inserting.
// (Images already in Cloudflare R2 are not deleted.)
// Messages are left untouched.
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Create admin/.env.local first (see .env.example).");
  process.exit(1);
}

const COMPANY_EMAIL = "info@st-spacegh.com";
const now = new Date();
const daysFromNow = (days) => {
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  date.setUTCDate(date.getUTCDate() + days);
  return date;
};

const posts = [
  {
    title: "5 Signs Your Office Air Conditioning Needs Servicing",
    slug: "5-signs-your-office-air-conditioning-needs-servicing",
    category: "Tips & Guides",
    tags: ["hvac", "air conditioning", "maintenance"],
    excerpt:
      "In Ghana's heat, a struggling air conditioner affects comfort, productivity and your electricity bill. Here are five warning signs that your office AC units need professional attention.",
    publishedAt: daysFromNow(-21),
    content: `In a climate like ours, air conditioning is not a luxury. It keeps staff productive, protects sensitive equipment and makes a strong first impression on clients. Yet most AC problems build up quietly until a unit fails on the hottest day of the year. Watching for these five signs helps you act early, when repairs are quicker and cheaper.

## 1. The air is not as cold as it used to be

If rooms take longer to cool, or the unit runs constantly without reaching the set temperature, something is wrong. Common causes include clogged filters, dirty condenser coils or low refrigerant. Left alone, the compressor works harder and wears out sooner.

## 2. Your electricity bills are climbing

A sudden rise in power costs with no change in usage often points to an inefficient AC system. Dust on coils and blocked airflow force units to consume more energy for the same cooling. Regular cleaning and servicing can bring consumption back down.

## 3. Water leaks or excessive moisture

Water dripping from indoor units, damp patches on walls or a musty smell usually means a blocked drain line or a frozen evaporator coil. Besides the mess, standing water encourages mould and can damage ceilings, furniture and electronics.

## 4. Strange noises or smells

Rattling, buzzing, grinding or squealing sounds suggest loose parts, worn fan motors or failing bearings. A burning smell can point to electrical problems and should be treated as urgent. Switch the unit off and call a qualified technician.

## 5. It has been more than three months since the last service

For most offices in Accra and Kumasi we recommend servicing split and cassette units **every three months**, and more often in dusty locations or rooms with heavy use. Routine servicing typically includes:

- Cleaning or replacing filters
- Cleaning indoor and outdoor coils
- Checking refrigerant levels and pressures
- Clearing drain lines
- Inspecting electrical connections and controls

## Stay ahead of breakdowns

The most cost-effective AC strategy is a planned preventive maintenance schedule rather than emergency call-outs. A structured plan extends equipment life, keeps energy costs under control and avoids disruption to your business.

ST-SPACE provides scheduled HVAC servicing and fast corrective repairs for offices, schools, hospitals, hotels and residential estates. [Contact us](/contact) to arrange an inspection of your air-conditioning units.`,
  },
  {
    title: "Why Preventive Maintenance Saves Businesses Money",
    slug: "why-preventive-maintenance-saves-businesses-money",
    category: "Industry Insights",
    tags: ["preventive maintenance", "facility management", "cost savings"],
    excerpt:
      "Fixing things only when they break feels cheaper, until you count downtime, emergency call-outs and shortened equipment life. Here is why a planned maintenance programme pays for itself.",
    publishedAt: daysFromNow(-12),
    content: `Many organisations still run their buildings on a "fix it when it breaks" basis. It feels economical because there is no regular maintenance bill. In practice, reactive maintenance is usually the most expensive way to look after a property.

## The hidden cost of breakdowns

When a generator, water pump or air-conditioning system fails without warning, the repair invoice is only part of the cost. Businesses also pay for:

- **Downtime:** staff who cannot work, customers who cannot be served, and deadlines that slip.
- **Emergency rates:** urgent call-outs, express parts and overtime labour cost more.
- **Secondary damage:** a burst pipe or leaking unit can ruin ceilings, flooring, stock and equipment.
- **Shorter asset life:** equipment that runs without care wears out years earlier than it should.

## What preventive maintenance looks like

Preventive maintenance replaces guesswork with a schedule. Each asset, from HVAC units and electrical panels to plumbing, pumps and generators, is inspected and serviced at set intervals based on manufacturer guidance and how heavily it is used. Small issues such as a worn belt, a loose connection or a slow leak are found and fixed before they become failures.

A good programme also keeps records. An up-to-date **asset register** shows what you own, its condition and its service history, so you can plan replacements and budgets instead of being surprised by them.

## The business case

Planned maintenance turns large, unpredictable costs into smaller, predictable ones. It also brings benefits that are harder to measure but just as important:

1. Safer premises for staff, tenants and visitors
2. Lower energy consumption from well-tuned equipment
3. Better compliance with safety and insurance requirements
4. Higher property value and a better impression on clients

## Getting started

You do not need to overhaul everything at once. Start with the assets that would hurt most if they failed, usually power, cooling and water, and build the schedule from there.

ST-SPACE designs and delivers preventive maintenance programmes for commercial and residential properties across Accra and Kumasi. [Talk to our team](/contact) about a maintenance plan that fits your facility and budget.`,
  },
  {
    title: "How Often Should You Fumigate Your Premises?",
    slug: "how-often-should-you-fumigate-your-premises",
    category: "Tips & Guides",
    tags: ["fumigation", "pest control", "hygiene"],
    excerpt:
      "Pests spread disease, damage property and harm your reputation. Here is a practical guide to fumigation frequency for homes, offices, food businesses and warehouses in Ghana.",
    publishedAt: daysFromNow(-4),
    content: `Cockroaches, rodents, mosquitoes and termites thrive in warm, humid conditions, which makes pest control an ongoing need for most properties in Ghana. The right fumigation schedule depends on the type of premises, how it is used and its history of infestation.

## General guidelines

These intervals are a sensible starting point. A professional inspection will help fine-tune them for your property.

- **Homes and residential estates:** every 3 to 6 months, with additional treatment during and after the rainy season when mosquitoes and insects increase.
- **Offices and schools:** every 3 months, focusing on kitchens, washrooms, storerooms and waste areas.
- **Restaurants, hotels and food businesses:** monthly. Food handling areas attract pests quickly, and hygiene standards leave little room for error.
- **Hospitals and clinics:** monthly or more often, using methods that are suitable for sensitive environments.
- **Warehouses and industrial sites:** every 1 to 3 months, depending on the goods stored. Food, grain and packaging materials need closer attention.

## Signs you need treatment now

Do not wait for the next scheduled visit if you notice:

1. Droppings, gnaw marks or nesting materials
2. Cockroaches seen during the day, which often signals a large infestation
3. Mud tubes on walls or hollow-sounding wood, both signs of termites
4. An increase in mosquitoes around stagnant water
5. Unusual smells in storerooms or ceilings

## Fumigation works best with prevention

Treatment is most effective when combined with good housekeeping. Seal gaps around pipes and doors, store food in closed containers, empty bins regularly, and clear stagnant water from gutters, drains and containers. Regular cleaning of kitchens and storage areas removes the food sources pests depend on.

## Safety first

Fumigation should always be carried out by trained personnel using approved products and proper protective equipment. A professional service will advise on how long to stay out of treated areas and how to prepare the space beforehand.

ST-SPACE offers general fumigation, termite, rodent, mosquito and insect control, and disinfection services for homes and businesses. [Request a quote](/contact) to schedule an inspection.`,
  },
  {
    title: "Planning Your Office Fit-Out: A Checklist (Draft)",
    slug: "planning-your-office-fit-out-a-checklist",
    category: "Company Updates",
    tags: ["fit-out", "projects"],
    excerpt: "A draft checklist for businesses planning an office fit-out or renovation.",
    status: "draft",
    publishedAt: null,
    content: `This is a draft post. It should **not** appear on the public website until it is published.

## Outline

- Define the scope and budget
- Agree timelines with the landlord
- Plan electrical, data and HVAC requirements
- Coordinate the move-in`,
  },
].map((post) => ({
  coverImage: "",
  author: "ST-SPACE Team",
  status: "published",
  seoTitle: "",
  seoDescription: "",
  createdAt: post.publishedAt ?? now,
  updatedAt: post.publishedAt ?? now,
  ...post,
}));

const jobBase = {
  applicationEmail: COMPANY_EMAIL,
  applicationWhatsapp: "+233205935800",
  applicationInstructions:
    "Send your CV and a short cover letter by email with the job title in the subject line, or message us on WhatsApp. Only shortlisted candidates will be contacted.",
  status: "open",
};

const jobs = [
  {
    ...jobBase,
    title: "Facilities Technician (HVAC)",
    slug: "facilities-technician-hvac",
    department: "Technical",
    location: "Accra",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    salary: "Negotiable",
    summary:
      "Install, service and repair air-conditioning and ventilation systems across client sites in Accra as part of our technical maintenance team.",
    description:
      "We are looking for a skilled and reliable **HVAC technician** to join our growing technical team in Accra. You will carry out planned preventive maintenance and respond to breakdowns on split, cassette and ducted air-conditioning systems at offices, estates and commercial buildings.\n\nThis is a hands-on, client-facing role suited to someone who takes pride in quality work and clear reporting.",
    responsibilities: [
      "Carry out scheduled servicing of split, cassette and ducted AC units",
      "Diagnose and repair faults on HVAC systems, including refrigerant and electrical issues",
      "Complete job cards and service reports accurately after every visit",
      "Advise clients on equipment condition and recommend replacements where needed",
      "Follow health and safety procedures and keep tools and equipment in good order",
    ],
    requirements: [
      "Technical certificate, NVTI or HND in Refrigeration & Air-Conditioning or a related field",
      "At least 2 years of hands-on HVAC maintenance experience",
      "Good understanding of basic electrical systems",
      "Willingness to work flexible hours and respond to call-outs",
      "Good communication skills and a professional attitude",
    ],
    benefits: ["Competitive salary", "SSNIT contributions", "Work tools and PPE provided", "Training and career development"],
    deadline: daysFromNow(45),
    publishedAt: daysFromNow(-5),
  },
  {
    ...jobBase,
    title: "Cleaning Supervisor",
    slug: "cleaning-supervisor",
    department: "Cleaning",
    location: "Kumasi",
    employmentType: "Full-time",
    experienceLevel: "Mid",
    salary: "",
    summary:
      "Lead and coordinate cleaning teams across client sites in Kumasi, making sure every space meets ST-SPACE quality standards.",
    description:
      "As **Cleaning Supervisor** you will manage day-to-day cleaning and janitorial operations for our clients in Kumasi. You will schedule staff, inspect work, manage supplies and act as the first point of contact for client feedback.",
    responsibilities: [
      "Supervise and schedule cleaning staff across multiple sites",
      "Inspect cleaned areas daily against agreed checklists",
      "Train new cleaners on methods, chemicals and safety procedures",
      "Manage cleaning supplies and equipment, and report stock needs",
      "Handle client feedback promptly and professionally",
    ],
    requirements: [
      "Minimum of SHS / WASSCE certificate",
      "At least 3 years of experience in commercial cleaning, with 1 year in a supervisory role",
      "Strong organisational and people-management skills",
      "Knowledge of safe chemical handling",
      "Must be based in or near Kumasi",
    ],
    benefits: ["SSNIT contributions", "Uniform provided", "Opportunities for promotion"],
    deadline: daysFromNow(30),
    publishedAt: daysFromNow(-3),
  },
  {
    ...jobBase,
    title: "Fumigation Officer",
    slug: "fumigation-officer",
    department: "Pest Control",
    location: "Accra & Kumasi",
    employmentType: "Contract",
    experienceLevel: "Entry",
    salary: "GHS 2,500 – 3,500 / month",
    summary:
      "Carry out safe and effective fumigation, pest control and disinfection treatments for residential and commercial clients.",
    description:
      "We are recruiting **Fumigation Officers** to deliver pest control services for clients in Accra and Kumasi. Full training on our procedures and safety standards will be provided.",
    responsibilities: [
      "Carry out fumigation, termite, rodent and insect control treatments",
      "Prepare and apply approved chemicals safely and accurately",
      "Inspect premises and advise clients on prevention measures",
      "Keep accurate treatment records",
      "Maintain spraying equipment and personal protective equipment",
    ],
    requirements: [
      "Minimum of SHS / WASSCE certificate",
      "Previous pest control experience is an advantage but not required",
      "Physically fit and comfortable working outdoors and at heights",
      "Willingness to travel between Accra and Kumasi when required",
    ],
    benefits: ["Full training provided", "PPE provided", "Transport allowance for site visits"],
    deadline: daysFromNow(60),
    publishedAt: daysFromNow(-1),
  },
  {
    ...jobBase,
    title: "Administrative Assistant",
    slug: "administrative-assistant",
    department: "Administration",
    location: "Accra",
    employmentType: "Full-time",
    experienceLevel: "Entry",
    salary: "",
    summary: "Support the Accra office with scheduling, records, client communication and general administration.",
    description: "This position has been filled. Thank you to everyone who applied.",
    responsibilities: ["Manage schedules and correspondence", "Maintain client and job records", "Support the operations team"],
    requirements: ["Diploma or degree in a relevant field", "Good computer skills", "Excellent communication"],
    benefits: [],
    status: "closed",
    deadline: daysFromNow(-10),
    publishedAt: daysFromNow(-40),
  },
].map((job) => ({ ...job, createdAt: job.publishedAt, updatedAt: job.publishedAt }));

// Clearly labelled samples so the Facilities section can be previewed. Replace them with real
// facilities (and photos) from the admin dashboard; do not publish these to the live site.
const facilities = [
  {
    name: "Sample Listing – Office Complex, Airport City",
    slug: "sample-office-complex-airport-city",
    type: "Office",
    location: "Airport City, Accra",
    summary: "Sample listing: modern multi-storey office space with managed maintenance, cleaning and security.",
    description:
      "This is a **sample listing** to show how facilities appear on the website. Replace it with a real facility and upload photos from the admin dashboard.",
    features: ["24/7 security", "Backup generator", "Central air conditioning", "Ample parking"],
    price: 15000,
    pricePeriod: "per month",
    featured: true,
  },
  {
    name: "Sample Listing – Residential Estate, East Legon",
    slug: "sample-residential-estate-east-legon",
    type: "Residential",
    location: "East Legon, Accra",
    summary: "Sample listing: gated residential estate with grounds maintenance, fumigation and facility support.",
    description: "This is a **sample listing**. Replace it with a real facility from the admin dashboard.",
    features: ["Gated community", "Landscaped grounds", "Borehole water supply"],
    price: null,
    pricePeriod: "",
    featured: false,
  },
  {
    name: "Sample Listing – Warehouse, Kumasi",
    slug: "sample-warehouse-kumasi",
    type: "Industrial / Warehouse",
    location: "Asokore Mampong, Kumasi",
    summary: "Sample listing: secure storage facility with pest control and preventive maintenance.",
    description: "This is a **sample listing**. Replace it with a real facility from the admin dashboard.",
    features: ["Loading bay", "Regular fumigation", "Perimeter fencing"],
    price: 8500,
    pricePeriod: "per month",
    featured: false,
  },
].map((facility, index) => ({
  ...facility,
  images: [],
  status: "published",
  publishedAt: daysFromNow(-(index + 1)),
  createdAt: daysFromNow(-(index + 1)),
  updatedAt: daysFromNow(-(index + 1)),
}));

try {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  console.warn("⚠  Clearing the `posts`, `jobs` and `facilities` collections...");
  for (const name of ["posts", "jobs", "facilities"]) await db.collection(name).deleteMany({});

  await db.collection("posts").insertMany(posts);
  await db.collection("jobs").insertMany(jobs);
  await db.collection("facilities").insertMany(facilities);

  await db.collection("posts").createIndex({ slug: 1 }, { unique: true });
  await db.collection("jobs").createIndex({ slug: 1 }, { unique: true });
  await db.collection("facilities").createIndex({ slug: 1 }, { unique: true });

  console.log(`✔  Inserted ${posts.length} posts (${posts.filter((p) => p.status === "published").length} published, 1 draft)`);
  console.log(`✔  Inserted ${jobs.length} jobs (${jobs.filter((j) => j.status === "open").length} open, 1 closed)`);
  console.log(`✔  Inserted ${facilities.length} sample facilities (replace them with real ones in the admin)`);
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
