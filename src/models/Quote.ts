import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const QuoteSchema = new Schema(
  {
    text: { type: String, required: true, trim: true },
    author: { type: String, default: '' },
    tag: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

QuoteSchema.index({ active: 1, createdAt: -1 });

export type QuoteDocument = InferSchemaType<typeof QuoteSchema> & { _id: string };

export const Quote: Model<QuoteDocument> =
  (mongoose.models.Quote as Model<QuoteDocument>) || mongoose.model<QuoteDocument>('Quote', QuoteSchema);


