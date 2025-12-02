import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    image: { type: String, default: '' },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    author: {
      name: { type: String, default: 'Dinoverse' },
      avatar: { type: String, default: '' },
    },
    publishedAt: { type: Date, default: Date.now },
    readTime: { type: String, default: '5 min read' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type BlogDocument = InferSchemaType<typeof BlogSchema> & { _id: string };

export const Blog: Model<BlogDocument> =
  (mongoose.models.Blog as Model<BlogDocument>) ||
  mongoose.model<BlogDocument>('Blog', BlogSchema);

