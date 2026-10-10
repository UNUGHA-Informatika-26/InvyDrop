import { useInventory } from '../context/InventoryContext';
import { Package, AlertTriangle, TrendingDown, Archive } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export function StatisticsPage() {
  const { items } = useInventory();

  const totalItems = items.length;
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = items.filter(item => item.quantity <= item.minStock).length;
  const outOfStockCount = items.filter(item => item.quantity === 0).length;

  // Category distribution
  const categoryData = items.reduce((acc, item) => {
    const existing = acc.find(c => c.name === item.category);
    if (existing) {
      existing.count += 1;
      existing.quantity += item.quantity;
    } else {
      acc.push({
        name: item.category,
        count: 1,
        quantity: item.quantity,
      });
    }
    return acc;
  }, [] as { name: string; count: number; quantity: number }[]);

  // Stock status distribution
  const stockStatusData = [
    { name: 'In Stock', value: items.filter(item => item.quantity > item.minStock).length },
    { name: 'Low Stock', value: lowStockCount },
    { name: 'Out of Stock', value: outOfStockCount },
  ].filter(item => item.value > 0);

  const COLORS = ['var(--chart-2)', 'var(--chart-4)', 'var(--destructive)'];

  return (
    <div className="min-h-full bg-background p-5 pb-6">
      {/* Header */}
      <div className="bg-primary-soft rounded-2xl p-6 mb-6">
        <h1 className="text-2xl mb-1 text-foreground">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time Inventory Insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card rounded-2xl p-5 border border-primary-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl text-primary">{totalItems}</div>
          </div>
          <p className="text-sm text-muted-foreground">Total Items</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-info-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-info-soft rounded-xl flex items-center justify-center">
              <Archive className="w-6 h-6 text-info" />
            </div>
            <div className="text-3xl text-info">{totalStock}</div>
          </div>
          <p className="text-sm text-muted-foreground">Total Stock</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-warning-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-warning-soft rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div className="text-3xl text-warning">{lowStockCount}</div>
          </div>
          <p className="text-sm text-muted-foreground">Low Stock</p>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-destructive-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-destructive-soft rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-3xl text-destructive">{outOfStockCount}</div>
          </div>
          <p className="text-sm text-muted-foreground">Out of Stock</p>
        </div>
      </div>

      {/* Charts */}
      {items.length > 0 ? (
        <>
          {/* Category Distribution */}
          {categoryData.length > 0 && (
            <div className="bg-card rounded-2xl p-5 mb-6">
              <h2 className="text-lg mb-4">Items by Category</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Stock Status Distribution */}
          {stockStatusData.length > 0 && (
            <div className="bg-card rounded-2xl p-5 mb-6">
              <h2 className="text-lg mb-4">Stock Status Distribution</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stockStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="var(--chart-1)"
                    dataKey="value"
                  >
                    {stockStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-card rounded-2xl p-6">
            <h2 className="text-lg mb-4">Transaction Activity</h2>
            <p className="text-sm text-muted-foreground text-center py-8">
              Track stock movements and transactions in real-time
            </p>
          </div>
        </>
      ) : (
        <div className="bg-card rounded-2xl p-10 text-center">
          <Package className="w-20 h-20 text-muted mx-auto mb-4" />
          <p className="text-muted-foreground text-base">No data available</p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            Add items to your inventory to see analytics
          </p>
        </div>
      )}
    </div>
  );
}