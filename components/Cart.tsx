
import React from 'react';
import { CartItem, Discount, Coupon } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
  subtotal: number;
  tax: number;
  total: number;
  appliedDiscount: Discount | Coupon | null;
  onOpenDiscounts: () => void;
  onOpenCoupons: () => void;
  onRemoveDiscount: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onClear,
  onCheckout,
  subtotal,
  tax,
  total,
  appliedDiscount,
  onOpenDiscounts,
  onOpenCoupons,
  onRemoveDiscount
}) => {
  return (
    <div className="w-full lg:w-[400px] bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-10">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Current Order</h2>
        <button onClick={onClear} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
              <i className="fa-solid fa-shopping-basket text-4xl"></i>
            </div>
            <p className="text-slate-400 font-medium">Your basket is empty</p>
            <p className="text-xs text-slate-300 mt-1">Start adding delicious meals</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-700">{item.name}</h4>
                <p className="text-xs font-semibold text-indigo-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-minus text-[10px]"></i>
                </button>
                <span className="w-4 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md transition-colors text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
        {!appliedDiscount ? (
          <div className="flex gap-2">
            <button
              onClick={onOpenDiscounts}
              className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-percent"></i> Discount
            </button>
            <button
              onClick={onOpenCoupons}
              className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <i className="fa-solid fa-ticket"></i> Coupon
            </button>
          </div>
        ) : (
          <div className="bg-indigo-600 rounded-xl p-3 flex items-center justify-between text-white animate-in zoom-in duration-200">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-tags text-sm opacity-75"></i>
              <div>
                <p className="text-[10px] font-medium opacity-75 leading-none uppercase tracking-tighter">Applied Benefit</p>
                <p className="text-xs font-bold">{appliedDiscount.name}</p>
              </div>
            </div>
            <button 
              onClick={onRemoveDiscount}
              className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        )}

        <div className="space-y-2 border-b border-slate-200 pb-4 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>{appliedDiscount.name}</span>
              <span>
                - {appliedDiscount.type === 'percentage' 
                  ? `${appliedDiscount.value}%` 
                  : `$${appliedDiscount.value.toFixed(2)}`}
              </span>
            </div>
          )}
          <div className="flex justify-between text-slate-500">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-lg font-bold text-slate-800">Total</span>
          <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
        </div>

        <button
          disabled={items.length === 0}
          onClick={onCheckout}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default Cart;
