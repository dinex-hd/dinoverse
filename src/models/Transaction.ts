import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const TransactionSchema = new Schema(
  {
    date: { type: Date, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true, trim: true },
    source: { type: String, default: '', trim: true },
    amount: { type: Number, required: true },
    note: { type: String, default: '' },
    tags: { type: [String], default: [] },
    isInvestmentInSelf: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TransactionSchema.index({ date: -1 });
TransactionSchema.index({ type: 1, date: -1 });

export type TransactionDocument = InferSchemaType<typeof TransactionSchema> & { _id: string };

export const Transaction: Model<TransactionDocument> =
  (mongoose.models.Transaction as Model<TransactionDocument>) ||
  mongoose.model<TransactionDocument>('Transaction', TransactionSchema);


