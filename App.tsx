
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Invoice from './components/Invoice';
import { Product, Category, CartItem, Order, Discount, Coupon } from './types';
import { PRODUCTS, DISCOUNTS, COUPONS } from './constants';
import { generateSmartDeal, suggestUpsell } from './services/geminiService';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedBenefit, setAppliedBenefit] = useState<Discount | Coupon | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [isGeneratingDeal, setIsGeneratingDeal] = useState(false);
  const [smartDeal, setSmartDeal] = useState<any>(null);
  const [upsellHint, setUpsellHint] = useState<string>("");

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountValue = useMemo(() => {
    if (!appliedBenefit) return 0;
    if (appliedBenefit.type === 'percentage') {
      return (subtotal * appliedBenefit.value) / 100;
    }
    return Math.min(appliedBenefit.value, subtotal);
  }, [subtotal, appliedBenefit]);

  const tax = (subtotal - discountValue) * 0.08;
  const total = subtotal - discountValue + tax;

  useEffect(() => {
    if (cartItems.length > 0) {
      const fetchUpsell = async () => {
        try {
          const hint = await suggestUpsell(cartItems.map(i => i.name));
          setUpsellHint(hint);
        } catch (e) {
          console.error("Upsell failed", e);
        }
      };
      const timer = setTimeout(fetchUpsell, 2000);
      return () => clearTimeout(timer);
    } else {
      setUpsellHint("");
    }
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = Math.max(0, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(i => i.quantity > 0);
    });
  };

  const handleApplyDiscount = (discount: Discount) => {
    setAppliedBenefit(discount);
    setShowDiscountModal(false);
  };

  const handleApplyCoupon = () => {
    const found = COUPONS.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    if (found) {
      setAppliedBenefit(found);
      setCouponInput("");
      setCouponError("");
      setShowCouponModal(false);
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleCompleteOrder = (method: 'cash' | 'card') => {
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cartItems],
      subtotal,
      discount: discountValue,
      tax,
      total,
      paymentMethod: method,
      timestamp: Date.now()
    };
    setOrderHistory(prev => [order, ...prev]);
    setCurrentOrder(order);
    setShowCheckoutModal(false);
    setShowInvoice(true);
  };

  const resetOrder = () => {
    setCartItems([]);
    setAppliedBenefit(null);
    setCurrentOrder(null);
    setShowInvoice(false);
    setUpsellHint("");
  };

  const handleGenerateDeal = async () => {
    setIsGeneratingDeal(true);
    try {
      const deal = await generateSmartDeal(PRODUCTS);
      setSmartDeal(deal);
    } catch (error) {
      console.error("Failed to generate deal", error);
    } finally {
      setIsGeneratingDeal(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {activeCategory} <span className="text-indigo-600">Menu</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
              Available Items ({filteredProducts.length})
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2 gap-3 border border-slate-200">
              <i className="fa-solid fa-magnifying-glass text-slate-400"></i>
              <input
                type="text"
                placeholder="Search items..."
                className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400 w-48"
              />
            </div>
            
            <button 
              onClick={handleGenerateDeal}
              disabled={isGeneratingDeal}
              className="px-4 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm border border-indigo-100 hover:bg-indigo-100 transition-all flex items-center gap-2"
            >
              {isGeneratingDeal ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              )}
              AI Deal
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {smartDeal && (
            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-indigo-100 animate-in fade-in zoom-in duration-500">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-yellow-400 text-yellow-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Limited Time</span>
                    <h2 className="text-2xl font-black italic">{smartDeal.dealName}</h2>
                  </div>
                  <p className="text-indigo-100 text-sm max-w-xl">{smartDeal.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-3xl font-black">${smartDeal.discountedPrice.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => setSmartDeal(null)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {upsellHint && (
            <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl text-amber-800 animate-bounce-short">
              <i className="fa-solid fa-lightbulb text-amber-500"></i>
              <p className="text-xs font-bold uppercase tracking-wide">Pro Tip: {upsellHint}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </main>

      <Cart
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={(id) => handleUpdateQuantity(id, -cartItems.find(i => i.id === id)!.quantity)}
        onClear={() => setCartItems([])}
        onCheckout={() => setShowCheckoutModal(true)}
        subtotal={subtotal}
        tax={tax}
        total={total}
        appliedDiscount={appliedBenefit}
        onOpenDiscounts={() => setShowDiscountModal(true)}
        onOpenCoupons={() => setShowCouponModal(true)}
        onRemoveDiscount={() => setAppliedBenefit(null)}
      />

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Select Discount</h3>
              <button onClick={() => setShowDiscountModal(false)} className="text-slate-400">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-4 space-y-2">
              {DISCOUNTS.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleApplyDiscount(d)}
                  className="w-full p-4 rounded-xl border border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="font-bold text-slate-800">{d.name}</p>
                    <p className="text-xs text-slate-500">Apply to current order</p>
                  </div>
                  <span className="font-black text-indigo-600">
                    {d.type === 'percentage' ? `${d.value}%` : `$${d.value}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Enter Coupon Code</h3>
              <button onClick={() => setShowCouponModal(false)} className="text-slate-400">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE10"
                  className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-indigo-600 outline-none text-center text-xl font-black tracking-widest uppercase placeholder:text-slate-300 transition-colors"
                />
                {couponError && <p className="text-red-500 text-xs mt-2 text-center font-bold">{couponError}</p>}
              </div>
              <button
                onClick={handleApplyCoupon}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Apply Coupon
              </button>
              <div className="text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Available for Demo: SAVE10, LUMIPOS</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800">Choose Payment</h3>
                <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-slate-600">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-slate-500 text-center mb-1 uppercase tracking-widest">Amount to Pay</p>
                <p className="text-4xl font-black text-slate-900 text-center">${total.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleCompleteOrder('cash')}
                  className="flex flex-col items-center gap-4 p-8 border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-money-bill-wave text-3xl"></i>
                  </div>
                  <span className="font-bold text-slate-700">Cash</span>
                </button>
                <button
                  onClick={() => handleCompleteOrder('card')}
                  className="flex flex-col items-center gap-4 p-8 border-2 border-slate-100 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-credit-card text-3xl"></i>
                  </div>
                  <span className="font-bold text-slate-700">Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoice && currentOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in slide-in-from-bottom-12 duration-500">
            <div className="p-6 flex items-center justify-between border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Order Successful</h3>
              <button onClick={resetOrder} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
              <Invoice order={currentOrder} />
            </div>

            <div className="p-6 bg-slate-50 space-y-3">
              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all"
              >
                <i className="fa-solid fa-print"></i> Print Receipt
              </button>
              <button
                onClick={resetOrder}
                className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                New Order
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
