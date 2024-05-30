import { PopulatedDoc, Document } from 'mongoose';

declare interface IMenuItem extends Document {
    name: string;
    description: string;
    category: string;
    ingredients: string[];
    tags?: ('vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'low-carb')[];
    price: number;
    cookingTime: number;
    coverImage: string;
    images: string[];
    status?: 'best-selling' | 'featured' | "chef's special" | 'new';
    reviews?: PopulatedDoc<IReview & Document>[];
    discount?: number;
    avgRating: number;
    isAvailable: boolean;
}
