
import React from 'react';
import { Order } from '../types';

interface InvoiceProps {
  order: Order;
}

const Invoice: React.FC<InvoiceProps> = ({ order }) => {
  return (
    <div id="print-area" className="p-8 max-w-sm mx-auto bg-white font-mono text-xs">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold uppercase tracking-widest">LumiPOS</h1>
        <p>123 Gourmet Street, Food City</p>
        <p>Tel: +1 (555) 123-4567</p>
        <p className="mt-2 text-slate-400">--------------------------------</p>
        <p className="mt-1">ORDER ID: {order.id.slice(0, 8).toUpperCase()}</p>
        <p>{new Date(order.timestamp).toLocaleString()}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between font-bold mb-2">
          <span>ITEM</span>
          <div className="flex gap-4">
            <span>QTY</span>
            <span>PRICE</span>
          </div>
        </div>
        <p className="text-slate-400 mb-2">--------------------------------</p>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between mb-1">
            <span className="truncate max-w-[150px]">{item.name}</span>
            <div className="flex gap-4">
              <span>{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-dashed border-slate-300 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span>-${order.discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%):</span>
          <span>${order.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-sm mt-2">
          <span>TOTAL:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 text-center text-slate-500">
        <p>Payment: {order.paymentMethod.toUpperCase()}</p>
        <p className="mt-4 italic">Thank you for dining with us!</p>
        <p className="mt-1">Please come again.</p>
        <p className="mt-4 text-[10px]">www.lumipos.com</p>
      </div>
    </div>
  );
};

export default Invoice;
