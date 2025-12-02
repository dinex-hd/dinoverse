import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const TestimonialSchema = new Schema(
  {
    quote: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, default: '' },
    avatar: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type TestimonialDocument = InferSchemaType<typeof TestimonialSchema> & { _id: string };

export const Testimonial: Model<TestimonialDocument> =
  (mongoose.models.Testimonial as Model<TestimonialDocument>) ||
  mongoose.model<TestimonialDocument>('Testimonial', TestimonialSchema);

