import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const FeatureSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, default: 'SparklesIcon' },
    order: { type: Number, default: 0 },
    emphasis: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type FeatureDocument = InferSchemaType<typeof FeatureSchema> & { _id: string };

export const Feature: Model<FeatureDocument> =
  (mongoose.models.Feature as Model<FeatureDocument>) ||
  mongoose.model<FeatureDocument>('Feature', FeatureSchema);


