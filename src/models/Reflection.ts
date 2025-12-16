import mongoose, { Schema, InferSchemaType, Model, Types } from 'mongoose';

const ReflectionSchema = new Schema(
  {
    date: { type: Date, required: true },
    summary: { type: String, default: '' },
    wins: { type: [String], default: [] },
    misses: { type: [String], default: [] },
    planNextWeek: { type: String, default: '' },
    brokenRules: [{ type: Types.ObjectId, ref: 'Rule' }],
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

ReflectionSchema.index({ date: -1 });

export type ReflectionDocument = InferSchemaType<typeof ReflectionSchema> & { _id: string };

export const Reflection: Model<ReflectionDocument> =
  (mongoose.models.Reflection as Model<ReflectionDocument>) ||
  mongoose.model<ReflectionDocument>('Reflection', ReflectionSchema);


