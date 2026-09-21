import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Check,
  ShieldCheck,
  Tag,
  ArrowLeft,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export const CartPage: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    freeShippingRemaining,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { success, error, info } = useToast();
  const navigate = useNavigate();

  // Coupon code state
  const [couponInput, setCouponInput] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Checkout modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');

  // Checkout form fields
  const [customerInfo, setCustomerInfo] = useState({
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Skyline Residency, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'NOVA10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedCoupon('NOVA10');
      success(`Coupon NOVA10 applied! You saved ${formatCurrency(discount)}`, 'Discount Applied');
      setCouponInput('');
    } else if (code === 'WELCOME500') {
      const discount = 500;
      setDiscountAmount(discount);
      setAppliedCoupon('WELCOME500');
      success(`Coupon WELCOME500 applied! You saved ${formatCurrency(discount)}`, 'Discount Applied');
      setCouponInput('');
    } else {
      error('Invalid promo code. Try using code "NOVA10" for 10% off.', 'Invalid Coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    info('Promo coupon removed.', 'Coupon Removed');
  };

  const finalPayableTotal = Math.max(0, total - discountAmount);

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `NOV-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setCheckoutStep('success');
    clearCart();
    success(`Order #${generatedId} confirmed successfully!`, 'Order Placed');
  };

  return (
    <div className="min-h-screen py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-zinc-900 tracking-tight">
          Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          {itemCount === 0
            ? 'Your shopping bag is currently empty.'
            : `Review your ${itemCount} ${itemCount === 1 ? 'selected essential' : 'selected essentials'} before checkout.`}
        </p>
      </div>

      {items.length === 0 ? (
        /* Empty Bag View */
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 shadow-sm max-w-2xl mx-auto my-8">
          <div className="w-20 h-20 rounded-3xl bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-display font-bold text-2xl text-zinc-900 mb-2">Your Bag is Empty</h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto mb-8 leading-relaxed">
            Discover our curated ecosystem of minimalist acoustic gear, bags, watches, and accessories.
          </p>
          <Link to="/products">
            <Button
              variant="primary"
              size="lg"
              className="font-bold shadow-lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Catalog
            </Button>
          </Link>
        </div>
      ) : (
        /* Active Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Free shipping banner */}
            <div className="p-4 rounded-2xl bg-zinc-900 text-white shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                {freeShippingRemaining > 0 ? (
                  <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                    <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                    Add{' '}
                    <strong className="text-white font-bold">
                      {formatCurrency(freeShippingRemaining)}
                    </strong>{' '}
                    more for Free Express Shipping
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    You unlocked Complimentary Express Delivery!
                  </span>
                )}
                <span className="text-[10px] text-zinc-400 font-bold">{freeShippingProgress}%</span>
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

            {/* Items Table Card */}
            <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm divide-y divide-zinc-100">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Product Info */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-accent-600">
                        {item.product.category?.name || 'Essential'}
                      </span>
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="font-display font-bold text-sm text-zinc-900 hover:text-accent-600 transition-colors block truncate"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {formatCurrency(item.product.price)} each
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">
                        In Stock: {item.product.stock} available
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Subtotal Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                    {/* Quantity Controller */}
                    <div className="flex items-center border border-zinc-300 rounded-xl overflow-hidden bg-white shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-zinc-900 select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total */}
                    <div className="text-right min-w-[5rem]">
                      <div className="font-display font-bold text-sm text-zinc-900">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Catalog Link */}
            <div className="flex items-center justify-between">
              <Link
                to="/products"
                className="text-xs font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
              <button
                onClick={clearCart}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Clear Entire Bag
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary Sidecard */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
            <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm flex flex-col gap-5">
              <h3 className="font-display font-bold text-lg text-zinc-900 pb-3 border-b border-zinc-100">
                Order Summary
              </h3>

              {/* Line item breakdowns */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase tracking-wider text-[11px]">
                        FREE
                      </span>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Coupon ({appliedCoupon})
                    </span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-zinc-200 flex justify-between items-baseline text-zinc-900">
                  <span className="font-bold text-sm">Estimated Total</span>
                  <span className="font-display font-black text-xl">
                    {formatCurrency(finalPayableTotal)}
                  </span>
                </div>
              </div>

              {/* Promo Coupon Form */}
              <div className="pt-2">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>{appliedCoupon} (Applied)</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-bold text-emerald-900 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. NOVA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 uppercase"
                    />
                    <Button type="submit" variant="outline" size="sm" className="font-bold text-xs">
                      Apply
                    </Button>
                  </form>
                )}
              </div>

              {/* Checkout Action Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-xl shadow-zinc-950/10"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setCheckoutStep('form');
                  setCheckoutModalOpen(true);
                }}
              >
                Proceed to Checkout
              </Button>

              {/* Security badges */}
              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-bit Encrypted Checkout • Risk-Free</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mock Checkout Modal */}
      <Modal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title={checkoutStep === 'form' ? 'Express Checkout' : 'Order Confirmed'}
        size="lg"
      >
        {checkoutStep === 'form' ? (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Delivery Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-zinc-700" />
                <span>1. Shipping Destination</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                />
                <Input
                  label="PIN Code"
                  required
                  value={customerInfo.pincode}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, pincode: e.target.value })}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Street Address"
                    required
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  />
                </div>
                <Input
                  label="City"
                  required
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                />
                <Input
                  label="State"
                  required
                  value={customerInfo.state}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, state: e.target.value })}
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-zinc-700" />
                <span>2. Payment Option</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                      : 'border-zinc-200 hover:border-zinc-300 text-zinc-800'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <div>
                    <div className="text-xs font-bold">UPI / QR</div>
                    <div className="text-[10px] opacity-70">GPay, PhonePe</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                      : 'border-zinc-200 hover:border-zinc-300 text-zinc-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <div>
                    <div className="text-xs font-bold">Card</div>
                    <div className="text-[10px] opacity-70">Visa, MC, RuPay</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-md'
                      : 'border-zinc-200 hover:border-zinc-300 text-zinc-800'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <div>
                    <div className="text-xs font-bold">COD</div>
                    <div className="text-[10px] opacity-70">Cash / Doorstep</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Total summary & submit button */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-500">Payable Amount</span>
                <div className="font-display font-black text-xl text-zinc-900">
                  {formatCurrency(finalPayableTotal)}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setCheckoutModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="font-bold shadow-lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Complete Order
                </Button>
              </div>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="font-display font-black text-2xl text-zinc-900">
              Thank You for Your Order!
            </h3>

            <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto">
              Your simulated order has been placed. We have sent a confirmation email to{' '}
              <strong className="text-zinc-800">{customerInfo.email}</strong>.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 inline-block text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Order Identifier
              </div>
              <div className="font-mono font-bold text-lg text-zinc-900 mt-0.5">{orderId}</div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                className="font-bold shadow-md"
                leftIcon={<Truck className="w-4 h-4" />}
                onClick={() => {
                  setCheckoutModalOpen(false);
                  navigate(`/track-order?orderId=${encodeURIComponent(orderId)}`);
                }}
              >
                Track This Order
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setCheckoutModalOpen(false);
                  navigate('/products');
                }}
              >
                Continue Exploring
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
