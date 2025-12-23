
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  return (
    <button
      onClick={() => onAdd(product)}
      className="bg-white border border-slate-100 rounded-2xl p-3 text-left hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-100 transition-all group relative overflow-hidden flex flex-col h-full"
    >
      <div className="aspect-video w-full rounded-xl overflow-hidden mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-800 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-2">{product.description}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
        <span className="font-bold text-indigo-600">${product.price.toFixed(2)}</span>
        <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <i className="fa-solid fa-plus text-xs"></i>
        </div>
      </div>
    </button>
  );
};

export default ProductCard;
