import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    section: { type: String, enum: ['homepage', 'packages', 'both', 'none'], default: 'none' },
    priceETB: { type: Number, required: true, min: 0 },
    features: { type: [String], default: [] },
    badge: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ServiceDocument = InferSchemaType<typeof ServiceSchema> & { _id: string };

export const Service: Model<ServiceDocument> =
  (mongoose.models.Service as Model<ServiceDocument>) ||
  mongoose.model<ServiceDocument>('Service', ServiceSchema);


