import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mockOrder, setMockOrder] = useState<any>(null);

  const executeTrack = (id: string) => {
    if (!id.trim()) return;
    const cleanId = id.toUpperCase().startsWith('NOV-') ? id.toUpperCase() : `NOV-${id.toUpperCase()}`;

    setLoading(true);
    setTimeout(() => {
      setSearched(true);
      setLoading(false);
      setMockOrder({
        orderNumber: cleanId,
        status: 'In Transit',
        carrier: 'Bluedart Express',
        awb: 'BD8492049182IN',
        estimatedDelivery: 'Tomorrow, by 8:00 PM',
        origin: 'NOVA Bengaluru Central Fulfillment Center',
        destination: 'Mumbai Delivery Hub (West)',
        steps: [
          { title: 'Order Placed & Payment Verified', date: 'Sept 20, 2026 - 10:14 AM', completed: true },
          { title: 'Picked & Packed at Central Warehouse', date: 'Sept 20, 2026 - 02:45 PM', completed: true },
          { title: 'Handed over to Express Courier', date: 'Sept 20, 2026 - 07:30 PM', completed: true },
          { title: 'In Transit to Regional Delivery Hub', date: 'Sept 21, 2026 - 06:15 AM', completed: true, current: true },
          { title: 'Out for Courier Delivery', date: 'Estimated Sept 22, 2026 - Morning', completed: false },
          { title: 'Delivered & Signature Obtained', date: 'Pending arrival', completed: false },
        ],
      });
    }, 400);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrack(orderNumber);
  };

  // Auto-search if query param exists (e.g. from checkout redirect: /track-order?orderId=NOV-123456)
  useEffect(() => {
    const queryOrderId = searchParams.get('orderId') || searchParams.get('orderNumber') || searchParams.get('id');
    if (queryOrderId) {
      setOrderNumber(queryOrderId);
      executeTrack(queryOrderId);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-zinc-900 dark:text-white font-medium">Track Order</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-white tracking-tight">
            Track Your Package
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Real-time live milestone tracking for all NOVA store orders. Enter your Order ID (e.g. NOV-849201) or AWB tracking number.
          </p>
        </div>

        {/* Tracking Lookup Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Order ID or Tracking No. <span className="text-accent-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. NOV-849201 or BD8492049182"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 font-mono"
                  />
                  <Package className="absolute right-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Email or Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                />
              </div>
            </div>

            {/* Quick Demo Samples */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-500">
              <span>Quick demo samples:</span>
              <button
                type="button"
                onClick={() => {
                  setOrderNumber('NOV-849201');
                  executeTrack('NOV-849201');
                }}
                className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-mono text-zinc-800 dark:text-zinc-200 text-[11px] transition-colors"
              >
                NOV-849201
              </button>
              <button
                type="button"
                onClick={() => {
                  setOrderNumber('NOV-592831');
                  executeTrack('NOV-592831');
                }}
                className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-mono text-zinc-800 dark:text-zinc-200 text-[11px] transition-colors"
              >
                NOV-592831
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading || !orderNumber.trim()}
                className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-semibold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Locating Shipment...' : 'Locate Shipment'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Tracking Results */}
        {searched && mockOrder && (
          <div className="mt-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <Truck className="w-3.5 h-3.5" /> {mockOrder.status}
                </span>
                <h3 className="text-xl font-display font-bold text-zinc-900 dark:text-white mt-2">
                  Shipment {mockOrder.orderNumber}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Express Carrier: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{mockOrder.carrier}</span> (AWB: {mockOrder.awb})
                </p>
              </div>

              <div className="text-left sm:text-right bg-zinc-50 dark:bg-zinc-800/40 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="text-xs text-zinc-500">Estimated Delivery</div>
                <div className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
                  {mockOrder.estimatedDelivery}
                </div>
              </div>
            </div>

            {/* Origin & Hub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-zinc-500">Origin Facility</div>
                  <div className="text-zinc-900 dark:text-white font-medium mt-0.5">{mockOrder.origin}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-zinc-500">Destination Facility</div>
                  <div className="text-zinc-900 dark:text-white font-medium mt-0.5">{mockOrder.destination}</div>
                </div>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-6">
                Shipment Milestones
              </h4>
              <div className="space-y-6">
                {mockOrder.steps.map((step: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-0.5">
                      {step.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-zinc-300 dark:text-zinc-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className={`text-sm font-medium ${step.completed ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600'}`}>
                          {step.title}
                          {step.current && (
                            <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-accent-100 text-accent-800 dark:bg-accent-950 dark:text-accent-400 rounded-full">
                              Current Status
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-zinc-400">{step.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assistance strip */}
        <div className="mt-8 bg-zinc-100 dark:bg-zinc-900/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Need help with your delivery?</h4>
            <p className="text-xs text-zinc-500 mt-1">
              Our customer concierge team is available 24/7 for address updates and dispatch coordination.
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs font-semibold text-accent-500 hover:text-accent-600 flex items-center gap-1 shrink-0"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
