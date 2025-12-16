import mongoose, { Schema, InferSchemaType, Model, Types } from 'mongoose';

const GoalSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    due: { type: Date },
    status: { type: String, enum: ['active', 'paused', 'done'], default: 'active' },
    focusArea: { type: String, enum: ['trading', 'business', 'health', 'personal'], default: 'trading' },
    habits: [{ type: Types.ObjectId, ref: 'Habit' }],
  },
  { timestamps: true }
);

GoalSchema.index({ status: 1, due: 1 });

export type GoalDocument = InferSchemaType<typeof GoalSchema> & { _id: string };

export const Goal: Model<GoalDocument> =
  (mongoose.models.Goal as Model<GoalDocument>) || mongoose.model<GoalDocument>('Goal', GoalSchema);


