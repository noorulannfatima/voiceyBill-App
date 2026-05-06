import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme/colors';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { useTypedSelector } from '../store/hooks';
import { useGetSummaryAnalyticsQuery } from '../features/analytics/analyticsAPI';
import { useGetAllTransactionsQuery } from '../features/transaction/transactionAPI';
import { format } from 'date-fns';

export default function DashboardScreen({ navigation }: any) {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];
  const { user } = useTypedSelector((state) => state.auth);
  
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch dashboard data
  const { data: summaryData, isLoading, refetch } = useGetSummaryAnalyticsQuery({});
  const { data: transactionsData, refetch: refetchTransactions } = useGetAllTransactionsQuery({ 
    pageNumber: 1, 
    pageSize: 5 
  });

  const summary = summaryData?.data;
  const recentTransactions = transactionsData?.transations || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refetchTransactions()]);
    setRefreshing(false);
  };

  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      {/* Header with dark background */}
      <DashboardHeader 
        userName={user?.name || 'User'}
        onAddTransaction={() => navigation.navigate('AddTransaction')}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={themeColors.primary}
          />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <SummaryCard
                title="Available Balance"
                value={summary?.availableBalance || 0}
                percentageChange={summary?.percentageChange?.balance}
                isLoading={isLoading}
                cardType="balance"
              />
            </View>
            <View style={styles.statCard}>
              <SummaryCard
                title="Total Income"
                value={summary?.totalIncome || 0}
                percentageChange={summary?.percentageChange?.income}
                isLoading={isLoading}
                cardType="income"
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <SummaryCard
                title="Total Expenses"
                value={summary?.totalExpenses || 0}
                percentageChange={summary?.percentageChange?.expenses}
                isLoading={isLoading}
                cardType="expenses"
              />
            </View>
            <View style={styles.statCard}>
              <SummaryCard
                title="Savings Rate"
                value={summary?.savingRate?.percentage || 0}
                isPercentageValue
                isLoading={isLoading}
                cardType="savings"
              />
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Transactions')}
              activeOpacity={0.7}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <Card>
            {recentTransactions.length === 0 ? (
              <CardContent>
                <Text style={styles.emptyText}>No transactions yet</Text>
              </CardContent>
            ) : (
              recentTransactions.map((transaction: any, index: number) => (
                <TouchableOpacity
                  key={transaction._id}
                  style={[
                    styles.transactionRow,
                    index === recentTransactions.length - 1 && styles.lastRow,
                  ]}
                  onPress={() => navigation.navigate('TransactionDetail', { id: transaction._id })}
                  activeOpacity={0.7}
                >
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.categoryBadge,
                      { backgroundColor: transaction.type === 'INCOME' ? '#10b98120' : '#ef444420' }
                    ]}>
                      <Text style={[
                        styles.categoryText,
                        { color: transaction.type === 'INCOME' ? '#10b981' : '#ef4444' }
                      ]}>
                        {transaction.category}
                      </Text>
                    </View>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionDate}>
                      {format(new Date(transaction.date), 'MMM dd, yyyy')}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.type === 'INCOME' ? styles.incomeAmount : styles.expenseAmount,
                    ]}
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}₨{transaction.amount.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: typeof colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
      marginTop: -spacing.xl,
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    statsContainer: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.lg,
      gap: spacing.md,
    },
    statsRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    statCard: {
      flex: 1,
    },
    section: {
      marginTop: spacing.xl,
      paddingHorizontal: spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: theme.foreground,
    },
    viewAllText: {
      fontSize: fontSize.sm,
      color: theme.primary,
      fontWeight: fontWeight.medium,
    },
    transactionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    transactionLeft: {
      flex: 1,
      gap: spacing.xs,
    },
    categoryBadge: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs - 2,
      borderRadius: borderRadius.sm,
    },
    categoryText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      textTransform: 'capitalize',
    },
    transactionTitle: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: theme.foreground,
    },
    transactionDate: {
      fontSize: fontSize.xs,
      color: theme.mutedForeground,
    },
    transactionAmount: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
    incomeAmount: {
      color: '#10b981',
    },
    expenseAmount: {
      color: '#ef4444',
    },
    emptyText: {
      textAlign: 'center',
      color: theme.mutedForeground,
      fontSize: fontSize.sm,
      paddingVertical: spacing.lg,
    },
  });
