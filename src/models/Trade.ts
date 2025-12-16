import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const TradeSchema = new Schema(
  {
    date: { type: Date, required: true },
    instrument: { type: String, required: true, trim: true },
    direction: { type: String, enum: ['long', 'short'], required: true },
    session: { type: String, default: '' },
    entry: { type: Number, required: true },
    stop: { type: Number, required: true },
    takeProfit: { type: Number },
    size: { type: Number, required: true },
    riskPerTrade: { type: Number },
    resultR: { type: Number },
    resultPct: { type: Number },
    pnl: { type: Number },
    setupTag: { type: String, default: '' },
    beforeNote: { type: String, default: '' },
    afterNote: { type: String, default: '' },
    ruleChecks: {
      followedPlan: { type: Boolean, default: false },
      respectedDailyLoss: { type: Boolean, default: false },
      validSession: { type: Boolean, default: false },
      emotional: { type: Boolean, default: false },
    },
    screenshots: { type: [String], default: [] },
    status: { type: String, enum: ['open', 'closed', 'breakeven'], default: 'closed' },
  },
  { timestamps: true }
);

TradeSchema.index({ date: -1 });
TradeSchema.index({ instrument: 1, date: -1 });

export type TradeDocument = InferSchemaType<typeof TradeSchema> & { _id: string };

export const Trade: Model<TradeDocument> =
  (mongoose.models.Trade as Model<TradeDocument>) || mongoose.model<TradeDocument>('Trade', TradeSchema);


