import mongoose, { Schema, InferSchemaType, Model, Types } from 'mongoose';

const HabitLogSchema = new Schema(
  {
    habit: { type: Types.ObjectId, ref: 'Habit', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['done', 'skipped', 'missed'], default: 'done' },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

HabitLogSchema.index({ habit: 1, date: 1 }, { unique: true });

export type HabitLogDocument = InferSchemaType<typeof HabitLogSchema> & { _id: string };

export const HabitLog: Model<HabitLogDocument> =
  (mongoose.models.HabitLog as Model<HabitLogDocument>) ||
  mongoose.model<HabitLogDocument>('HabitLog', HabitLogSchema);


