import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const ContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    service: { type: String, required: false, trim: true },
    status: { type: String, enum: ['new', 'read', 'archived'], default: 'new' },
  },
  { timestamps: true }
);

export type ContactDocument = InferSchemaType<typeof ContactSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Contact: Model<ContactDocument> =
  (mongoose.models.Contact as Model<ContactDocument>) ||
  mongoose.model<ContactDocument>('Contact', ContactSchema);


