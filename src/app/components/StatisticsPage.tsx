import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useInventory } from '../context/InventoryContext';
import { Package, AlertTriangle, TrendingDown, Archive } from 'lucide-react-native';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { theme } from '../../theme';

const screenWidth = Dimensions.get('window').width;

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

  // Format category data for Gifted Charts BarChart
  const barData = categoryData.map((cat, idx) => ({
    value: cat.quantity,
    label: cat.name.length > 7 ? cat.name.substring(0, 6) + '..' : cat.name,
    frontColor: idx % 2 === 0 ? theme.colors.primary : theme.colors.info,
    topLabelComponent: () => (
      <Text style={styles.barTopLabel}>{cat.quantity}</Text>
    ),
  }));

  // Stock status distribution
  const inStockCount = items.filter(item => item.quantity > item.minStock).length;

  const pieData = [
    { value: inStockCount, color: theme.colors.success, text: `${inStockCount}`, label: 'In Stock' },
    { value: lowStockCount, color: theme.colors.warning, text: `${lowStockCount}`, label: 'Low Stock' },
    { value: outOfStockCount, color: theme.colors.destructive, text: `${outOfStockCount}`, label: 'Out of Stock' },
  ].filter(item => item.value > 0);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <Text style={styles.headerSubtitle}>Real-time Inventory Insights</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={styles.statTop}>
            <View style={styles.iconCirclePrimary}>
              <Package size={22} color={theme.colors.primary} />
            </View>
            <Text style={styles.statNumPrimary}>{totalItems}</Text>
          </View>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statTop}>
            <View style={styles.iconCircleInfo}>
              <Archive size={22} color={theme.colors.info} />
            </View>
            <Text style={styles.statNumInfo}>{totalStock}</Text>
          </View>
          <Text style={styles.statLabel}>Total Stock</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statTop}>
            <View style={styles.iconCircleWarning}>
              <AlertTriangle size={22} color={theme.colors.warning} />
            </View>
            <Text style={styles.statNumWarning}>{lowStockCount}</Text>
          </View>
          <Text style={styles.statLabel}>Low Stock Alert</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statTop}>
            <View style={styles.iconCircleDanger}>
              <TrendingDown size={22} color={theme.colors.destructive} />
            </View>
            <Text style={styles.statNumDanger}>{outOfStockCount}</Text>
          </View>
          <Text style={styles.statLabel}>Out of Stock</Text>
        </View>
      </View>

      {/* Category Stock Distribution (BarChart) */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Stok per Kategori</Text>
        <Text style={styles.chartSubtitle}>Distribusi kuantitas berdasarkan kategori</Text>

        {barData.length === 0 ? (
          <Text style={styles.emptyChartText}>Belum ada data barang</Text>
        ) : (
          <View style={styles.chartWrapper}>
            <BarChart
              data={barData}
              barWidth={28}
              spacing={20}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={1}
              yAxisThickness={1}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              noOfSections={4}
              width={screenWidth - 80}
            />
          </View>
        )}
      </View>

      {/* Stock Health Distribution (PieChart) */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Status Kesehatan Stok</Text>
        <Text style={styles.chartSubtitle}>Proporsi ketersediaan barang di gudang</Text>

        {pieData.length === 0 ? (
          <Text style={styles.emptyChartText}>Belum ada data barang</Text>
        ) : (
          <View style={styles.pieContainer}>
            <PieChart
              data={pieData}
              donut
              sectionAutoFocus
              radius={75}
              innerRadius={45}
              innerCircleColor={theme.colors.card}
              centerLabelComponent={() => (
                <View style={styles.pieCenter}>
                  <Text style={styles.pieCenterNumber}>{totalItems}</Text>
                  <Text style={styles.pieCenterLabel}>Items</Text>
                </View>
              )}
            />

            {/* Legend */}
            <View style={styles.legendContainer}>
              {pieData.map((item, idx) => (
                <View key={idx} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>
                    {item.label} ({item.value})
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radii.xl,
    padding: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.foreground,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSm,
    color: theme.colors.mutedForeground,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: (screenWidth - 44) / 2,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    elevation: 1,
  },
  statTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  iconCirclePrimary: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleInfo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.infoSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleWarning: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleDanger: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: theme.colors.destructiveSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumPrimary: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  statNumInfo: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.info,
  },
  statNumWarning: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.warning,
  },
  statNumDanger: {
    fontSize: theme.typography.font2xl,
    fontWeight: '800',
    color: theme.colors.destructive,
  },
  statLabel: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
  },
  chartCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.xl,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chartTitle: {
    fontSize: theme.typography.fontLg,
    fontWeight: '700',
    color: theme.colors.foreground,
  },
  chartSubtitle: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.mutedForeground,
    marginTop: 2,
    marginBottom: 16,
  },
  chartWrapper: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  barTopLabel: {
    fontSize: 10,
    color: theme.colors.mutedForeground,
    marginBottom: 4,
  },
  axisText: {
    fontSize: 10,
    color: theme.colors.mutedForeground,
  },
  pieContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  pieCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterNumber: {
    fontSize: theme.typography.fontLg,
    fontWeight: '800',
    color: theme.colors.foreground,
  },
  pieCenterLabel: {
    fontSize: 10,
    color: theme.colors.mutedForeground,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    marginTop: 18,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: theme.typography.fontXs,
    color: theme.colors.foreground,
  },
  emptyChartText: {
    fontSize: theme.typography.fontSm,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    paddingVertical: 24,
  },
});