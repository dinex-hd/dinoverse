import mongoose, { Schema, InferSchemaType, Model, Types } from 'mongoose';

const HabitSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    goal: { type: Types.ObjectId, ref: 'Goal' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

HabitSchema.index({ active: 1, order: 1 });

export type HabitDocument = InferSchemaType<typeof HabitSchema> & { _id: string };

export const Habit: Model<HabitDocument> =
  (mongoose.models.Habit as Model<HabitDocument>) || mongoose.model<HabitDocument>('Habit', HabitSchema);


