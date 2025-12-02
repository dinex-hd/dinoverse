import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    longDescription: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    image: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    format: { type: String, default: '' }, // Video Course, Template, etc.
    downloadable: { type: Boolean, default: true },
    updates: { type: String, default: '' }, // Lifetime, 1 Year, etc.
    bestseller: { type: Boolean, default: false },
    new: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ProductDocument = InferSchemaType<typeof ProductSchema> & { _id: string };

export const Product: Model<ProductDocument> =
  (mongoose.models.Product as Model<ProductDocument>) ||
  mongoose.model<ProductDocument>('Product', ProductSchema);

