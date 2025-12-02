import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const PortfolioSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, default: '' },
    image: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    technologies: { type: [String], default: [] },
    status: { type: String, enum: ['Completed', 'In Progress', 'Planning'], default: 'Completed' },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type PortfolioDocument = InferSchemaType<typeof PortfolioSchema> & { _id: string };

export const Portfolio: Model<PortfolioDocument> =
  (mongoose.models.Portfolio as Model<PortfolioDocument>) ||
  mongoose.model<PortfolioDocument>('Portfolio', PortfolioSchema);

