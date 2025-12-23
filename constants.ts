
import { Product, Category, Discount, Coupon } from './types';

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Truffle Burger', price: 18.50, category: 'Mains', description: 'Wagyu beef with truffle aioli', image: 'https://picsum.photos/id/163/300/200' },
  { id: '2', name: 'Margherita Pizza', price: 14.00, category: 'Mains', description: 'Fresh basil and mozzarella', image: 'https://picsum.photos/id/102/300/200' },
  { id: '3', name: 'Caesar Salad', price: 12.50, category: 'Sides', description: 'Crispy romaine with parmesan', image: 'https://picsum.photos/id/10/300/200' },
  { id: '4', name: 'Garlic Fries', price: 6.50, category: 'Sides', description: 'Double fried with roasted garlic', image: 'https://picsum.photos/id/42/300/200' },
  { id: '5', name: 'Vanilla Bean Gelato', price: 7.00, category: 'Desserts', description: 'Tahitian vanilla bean', image: 'https://picsum.photos/id/312/300/200' },
  { id: '6', name: 'Iced Matcha Latte', price: 5.50, category: 'Drinks', description: 'Ceremonial grade matcha', image: 'https://picsum.photos/id/111/300/200' },
  { id: '7', name: 'Fresh Lemonade', price: 4.50, category: 'Drinks', description: 'Hand-pressed organic lemons', image: 'https://picsum.photos/id/12/300/200' },
  { id: '8', name: 'Spicy Ramen', price: 16.00, category: 'Mains', description: 'House-made broth with pork belly', image: 'https://picsum.photos/id/225/300/200' },
  { id: '9', name: 'Tiramisu', price: 9.50, category: 'Desserts', description: 'Espresso-soaked ladyfingers', image: 'https://picsum.photos/id/429/300/200' },
  { id: '10', name: 'Craft Beer', price: 8.00, category: 'Drinks', description: 'Local IPA brewery selection', image: 'https://picsum.photos/id/158/300/200' },
];

export const CATEGORIES: Category[] = ['All', 'Mains', 'Sides', 'Drinks', 'Desserts'];

export const DISCOUNTS: Discount[] = [
  { id: 'd1', name: 'Staff Discount', type: 'percentage', value: 15 },
  { id: 'd2', name: 'Happy Hour', type: 'fixed', value: 5 },
  { id: 'd3', name: 'Loyalty Reward', type: 'fixed', value: 10 },
];

export const COUPONS: Coupon[] = [
  { code: 'SAVE10', name: 'Seasonal Sale', type: 'percentage', value: 10 },
  { code: 'LUMIPOS', name: 'Beta Tester Gift', type: 'fixed', value: 7 },
  { code: 'WELCOME5', name: 'First Order', type: 'fixed', value: 5 },
];
