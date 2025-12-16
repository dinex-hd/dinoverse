import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const RuleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'trading', trim: true },
    description: { type: String, default: '' },
    reason: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

RuleSchema.index({ active: 1, order: 1 });

export type RuleDocument = InferSchemaType<typeof RuleSchema> & { _id: string };

export const Rule: Model<RuleDocument> =
  (mongoose.models.Rule as Model<RuleDocument>) || mongoose.model<RuleDocument>('Rule', RuleSchema);


