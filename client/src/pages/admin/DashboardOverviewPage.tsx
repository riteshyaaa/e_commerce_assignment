import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Layers,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  ArrowUpRight,
  Plus,
  ExternalLink,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  FileText,
  IndianRupee,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from 'recharts';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../lib/utils';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';

const STOCK_PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Emerald, Amber, Red

export const DashboardOverviewPage: React.FC = () => {
  const { admin } = useAuth();

  const {
    data: analytics,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['admin-dashboard-analytics'],
    queryFn: api.dashboard.getAnalytics,
    refetchInterval: 30000, // Background refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-8 h-80 rounded-2xl" />
          <Skeleton className="lg:col-span-4 h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="p-8 rounded-3xl bg-red-950/30 border border-red-900/50 text-center max-w-md mx-auto my-12">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-display font-bold text-lg text-white mb-1">Failed to Load Telemetry</h3>
        <p className="text-xs text-zinc-400 mb-4">
          Could not communicate with the real-time analytics aggregation service.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  const { stats, productsByCategory, inventoryDistribution, priceDistribution, lowStockAlerts, recentProducts } = analytics;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Page Header with Admin Welcome & Live Telemetry Ping */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Executive Dashboard
            </h1>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Welcome back, <strong className="text-zinc-200 font-bold">{admin?.name || 'Administrator'}</strong>. Real-time catalogue telemetry & operational metrics.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            loading={isFetching}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />}
            className="border-zinc-800 text-zinc-300 hover:text-white"
          >
            Refresh
          </Button>

          <Link to="/admin/products?action=new">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="font-bold bg-white text-zinc-950 hover:bg-zinc-200 shadow-md"
            >
              New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Six Primary KPI Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Products */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Total Products
            </span>
            <div className="p-2 rounded-xl bg-zinc-800/80 text-zinc-300">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-2xl text-white">
              {stats.totalProducts}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">{stats.activeProducts} active</span>
              <span>•</span>
              <span>{stats.draftProducts} drafts</span>
            </div>
          </div>
        </div>

        {/* Total Inventory Valuation */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Inventory Value
            </span>
            <div className="p-2 rounded-xl bg-accent-500/10 text-accent-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-2xl text-white truncate" title={formatCurrency(stats.totalInventoryValue)}>
              {formatCurrency(stats.totalInventoryValue)}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              Asset valuation $\Sigma(P \times S)$
            </div>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Active Ratio
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-2xl text-white">
              {stats.totalProducts > 0
                ? `${Math.round((stats.activeProducts / stats.totalProducts) * 100)}%`
                : '0%'}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              Live in public storefront
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Low Stock Alert
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-2xl text-amber-400">
              {stats.lowStockProducts}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              Threshold: $\le 5$ units remaining
            </div>
          </div>
        </div>

        {/* Out of Stock Items */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
              Out of Stock
            </span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-2xl text-red-400">
              {stats.outOfStockProducts}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              Requires urgent replenishment
            </div>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Categories
            </span>
            <div className="p-2 rounded-xl bg-zinc-800/80 text-zinc-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-display font-black text-2xl text-white">
              {stats.totalCategories}
            </div>
            <div className="text-[10px] text-zinc-400 mt-1">
              Curated product taxonomies
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recharts Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Volume & Valuation Bar Chart */}
        <div className="lg:col-span-8 bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Products Distribution by Category
              </h3>
              <p className="text-xs text-zinc-400">
                Item volume and catalog breadth across taxonomies
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">Live Breakdown</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productsByCategory}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '1rem',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                  }}
                  cursor={{ fill: '#27272a', opacity: 0.5 }}
                />
                <Bar
                  dataKey="productCount"
                  name="Products"
                  fill="#ffffff"
                  radius={[6, 6, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Status Donut Chart */}
        <div className="lg:col-span-4 bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="mb-2">
            <h3 className="font-display font-bold text-base text-white">Stock Health Status</h3>
            <p className="text-xs text-zinc-400">Inventory risk segmentation</p>
          </div>

          <div className="h-60 w-full relative text-white">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {inventoryDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STOCK_PIE_COLORS[index % STOCK_PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-[11px] text-zinc-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex justify-between ">
            <span className='text-white'>Healthy Stock Ratio</span>
            <span className="text-emerald-400 font-bold">
              {inventoryDistribution[0]?.percentage || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Price Tier Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Price Range Breakdown */}
        <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Price Bracket Segmentation
              </h3>
              <p className="text-xs text-zinc-400">Catalog positioning across price tiers</p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priceDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="range" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderColor: '#27272a',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  cursor={{ fill: '#27272a', opacity: 0.5 }}
                />
                <Bar
                  dataKey="count"
                  name="Items"
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Shortcut Hub */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-white mb-1">Command Shortcuts</h3>
            <p className="text-xs text-zinc-400 mb-4">Fast actions & platform navigation</p>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/admin/products"
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <Package className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                <div>
                  <div className="text-xs font-bold text-white">Product Catalog</div>
                  <div className="text-[10px] text-zinc-500">Edit, filter & manage items</div>
                </div>
              </Link>

              <Link
                to="/admin/categories"
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <Layers className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                <div>
                  <div className="text-xs font-bold text-white">Categories</div>
                  <div className="text-[10px] text-zinc-500">Organize taxonomies</div>
                </div>
              </Link>

              <Link
                to="/"
                target="_blank"
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    Storefront <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                  </div>
                  <div className="text-[10px] text-zinc-500">Public customer view</div>
                </div>
              </Link>

              <a
                href="http://localhost:5000/docs"
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all flex flex-col justify-between gap-3 group"
              >
                <FileText className="w-5 h-5 text-accent-400 group-hover:text-accent-300 transition-colors" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    Swagger Docs <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                  </div>
                  <div className="text-[10px] text-zinc-500">Interactive REST endpoints</div>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Server Architecture</span>
            <span className="font-mono text-zinc-400">Node / Express / Prisma / PG</span>
          </div>
        </div>
      </div>

      {/* 5. Actionable Data Tables: Low Stock Alerts & Recent Additions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Urgent Low Stock Alerts Table */}
        <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white">
                  Stock Replenishment Alerts
                </h3>
                {lowStockAlerts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    {lowStockAlerts.length} Action Needed
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">Products with $\le 5$ units in current warehouse</p>
            </div>
            <Link
              to="/admin/products?status=LOW_STOCK"
              className="text-xs text-accent-400 hover:underline font-bold"
            >
              View All
            </Link>
          </div>

          {lowStockAlerts.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs flex flex-col items-center gap-2 my-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <span>All inventory units are at healthy stock thresholds.</span>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3 text-right">Price</th>
                    <th className="pb-3 text-center">Remaining Stock</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {lowStockAlerts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-9 h-9 rounded-xl object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate max-w-[180px]">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {prod.category?.name || 'Category'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-zinc-400 font-mono text-[11px]">{prod.sku}</td>
                      <td className="py-3 text-right font-bold text-white">
                        {formatCurrency(prod.price)}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prod.stock === 0
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {prod.stock === 0 ? 'Out of Stock' : `${prod.stock} units`}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/admin/products?edit=${prod.id}`}
                          className="text-[11px] font-bold text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg transition-colors inline-block"
                        >
                          Restock
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Product Additions */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-white">Recent Additions</h3>
              <p className="text-xs text-zinc-400">Newly seeded catalog products</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs text-accent-400 hover:underline font-bold"
            >
              All Products
            </Link>
          </div>

          <div className="space-y-3 divide-y divide-zinc-800/60">
            {recentProducts.map((prod) => (
              <div key={prod.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-10 h-10 rounded-xl object-cover bg-zinc-950 border border-zinc-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-white block truncate">
                      {prod.name}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {prod.category?.name} • {formatCurrency(prod.price)}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    prod.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : prod.status === 'DRAFT'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {prod.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
