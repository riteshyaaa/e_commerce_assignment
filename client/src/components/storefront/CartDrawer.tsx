import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../common/Button';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    freeShippingRemaining,
    total,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-900" />
              <h3 className="font-display font-bold text-base text-zinc-900">
                Your Shopping Bag ({itemCount})
              </h3>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-zinc-900 text-white p-4 text-xs">
            <div className="flex items-center justify-between mb-2">
              {freeShippingRemaining > 0 ? (
                <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                  Add <span className="text-white font-bold">{formatCurrency(freeShippingRemaining)}</span> for Free Express Shipping
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  You unlocked Complimentary Express Delivery!
                </span>
              )}
              <span className="text-[10px] text-zinc-400 font-semibold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  freeShippingRemaining === 0 ? 'bg-emerald-400' : 'bg-accent-500'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-zinc-900 mb-1">Your bag is empty</h4>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Discover our curated collection of minimalist essentials, backpacks, and audio gear.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    closeCart();
                    navigate('/products');
                  }}
                >
                  Explore Catalog
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-xs font-bold text-zinc-900 hover:text-accent-600 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {item.product.category?.name || 'Essential'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-zinc-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <div className="text-xs font-bold text-zinc-900">
                          {formatCurrency(item.product.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-zinc-400">
                            {formatCurrency(item.product.price)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-zinc-50/70 flex flex-col gap-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-semibold uppercase">Free</span>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Estimated Total</span>
                  <span className="text-base">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                >
                  View Bag
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleCheckoutClick}
                >
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
