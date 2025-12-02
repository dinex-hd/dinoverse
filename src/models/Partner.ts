import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const PartnerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    emoji: { type: String, default: '' },
    logo: { type: String, default: '' }, // URL or emoji
    url: { type: String, default: '' },
    accent: { type: String, default: '' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type PartnerDocument = InferSchemaType<typeof PartnerSchema> & { _id: string };

export const Partner: Model<PartnerDocument> =
  (mongoose.models.Partner as Model<PartnerDocument>) ||
  mongoose.model<PartnerDocument>('Partner', PartnerSchema);

