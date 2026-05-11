import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  sku: { type: String, unique: true, required: true },
  brand: { type: String, required: true },
  brandSlug: { type: String, required: true },
  category: {
    type: String,
    enum: ['laptops', 'desktops', 'networking', 'cctv', 'accessories'],
    required: true
  },
  subcategory: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  inbox: [{ type: String }],
  images: [{ type: String }],
  has360: { type: Boolean, default: false },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  specs: { type: Map, of: Schema.Types.Mixed },
  variants: [{
    label: String,
    sku: String,
    price: Number,
    mrp: Number,
    stock: Number,
    attributes: { type: Map, of: String }
  }],
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  dealEndsAt: { type: Date },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  weight: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for fast searching and filtering
ProductSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, subcategory: 1, price: 1 });
ProductSchema.index({ slug: 1 });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
