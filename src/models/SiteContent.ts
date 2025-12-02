import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

// Hero Section Content
const HeroContentSchema = new Schema(
  {
    badge: { type: String, default: 'Full‑stack development • Creative design' },
    heading: { type: String, default: 'Web & Mobile Apps. Brand‑Ready Design.' },
    description: { type: String, default: 'At Dinoverse, clients get production‑ready web and mobile applications plus standout graphics — logos, thumbnails, book covers and everything in between.' },
    stats: {
      projects: { type: String, default: '50+' },
      rating: { type: String, default: '4.9★' },
      community: { type: String, default: '10k+' },
    },
  },
  { _id: false }
);

// WhyChoose Point Schema
const WhyChoosePointSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }, // icon name like 'RocketLaunchIcon'
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

// Process Step Schema
const ProcessStepSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

// CTA Section Schema
const CTAContentSchema = new Schema(
  {
    heading: { type: String, default: 'Ready to get started?' },
    description: { type: String, default: 'Join the Dinoverse community and start building your digital presence today.' },
    primaryButton: {
      text: { type: String, default: 'Get in Touch' },
      href: { type: String, default: '/contact' },
    },
    secondaryButton: {
      text: { type: String, default: 'Read our blog' },
      href: { type: String, default: '/blog' },
    },
  },
  { _id: false }
);

// RecentWork Section Schema
const RecentWorkContentSchema = new Schema(
  {
    heading: { type: String, default: 'Recent Work' },
    description: { type: String, default: 'Selected projects across web, mobile and design.' },
    projectIds: { type: [String], default: [] }, // Array of Portfolio IDs to display
    maxProjects: { type: Number, default: 4 },
  },
  { _id: false }
);

// ContactMini Section Schema
const ContactMiniContentSchema = new Schema(
  {
    email: { type: String, default: 'dinaolsisay18@gmail.com' },
    responseTime: { type: String, default: '<24 hours' },
    availability: { type: String, default: 'Taking projects' },
    heading: { type: String, default: 'Have a project in mind?' },
    description: { type: String, default: 'Tell me about it — I\'ll reply within 24 hours.' },
  },
  { _id: false }
);

// Services page (services listing) content schema
const ServicesPageContentSchema = new Schema(
  {
    badge: { type: String, default: 'Professional Services Portfolio' },
    heading: { type: String, default: 'Service Portfolio' },
    subheading: { type: String, default: 'Where design meets development' },
    tagline: {
      type: String,
      default: 'Where Design Meets Development — Crafting Ideas into Digital Reality.',
    },
    stats: {
      projects: { type: String, default: '50+' },
      rating: { type: String, default: '4.9★' },
      satisfaction: { type: String, default: '100%' },
    },
  },
  { _id: false },
);

const SiteContentSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // 'hero', 'whyChoose', 'processTimeline', 'cta', 'recentWork', 'contactMini', 'servicesPage'
    hero: HeroContentSchema,
    whyChoose: {
      heading: { type: String, default: 'Why choose Dinoverse' },
      description: { type: String, default: 'Focused on outcomes: robust engineering, beautiful design, and measurable impact.' },
      points: [WhyChoosePointSchema],
    },
    processTimeline: {
      heading: { type: String, default: 'Process' },
      description: { type: String, default: 'Transparent, efficient, and collaborative from idea to launch.' },
      steps: [ProcessStepSchema],
    },
    cta: CTAContentSchema,
    recentWork: RecentWorkContentSchema,
    contactMini: ContactMiniContentSchema,
    servicesPage: ServicesPageContentSchema,
  },
  { timestamps: true }
);

export type SiteContentDocument = InferSchemaType<typeof SiteContentSchema> & { _id: string };

export const SiteContent: Model<SiteContentDocument> =
  (mongoose.models.SiteContent as Model<SiteContentDocument>) ||
  mongoose.model<SiteContentDocument>('SiteContent', SiteContentSchema);

