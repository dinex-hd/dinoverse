import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const SettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'general' }, // general, branding, contact, social
  },
  { timestamps: true }
);

export type SettingsDocument = InferSchemaType<typeof SettingsSchema> & { _id: string };

export const Settings: Model<SettingsDocument> =
  (mongoose.models.Settings as Model<SettingsDocument>) ||
  mongoose.model<SettingsDocument>('Settings', SettingsSchema);

