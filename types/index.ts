export type Role = "USER" | "ADMIN";
export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type ProductCategory = "Computers" | "Accessories" | "Refurbished";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  brand: string;
  images: string[];
  stock: number;
  specs: Record<string, string>;
  condition?: "New" | "Like New" | "Good";
  warranty: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  createdAt: Date;
}

export interface ICartItem {
  productId: IProduct | string;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  updatedAt: Date;
}

export interface IOrderAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IOrderItem {
  productId: string;
  title: string;
  image: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id: string;
  userId: string | IUser;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  address: IOrderAddress;
  createdAt: Date;
}
