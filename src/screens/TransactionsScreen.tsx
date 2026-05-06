import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme/colors';
import { Card } from '../components/common/Card';
import { useGetAllTransactionsQuery } from '../features/transaction/transactionAPI';
import { format } from 'date-fns';

export default function TransactionsScreen({ navigation }: any) {
  const { activeTheme } = useTheme();
  const themeColors = colors[activeTheme];
  const [page, setPage] = useState(1);
  
  const { data, isLoading, isFetching, refetch } = useGetAllTransactionsQuery({ 
    pageNumber: page, 
    pageSize: 20 
  });

  const transactions = data?.transations || [];
  const hasMore = (data?.pagination?.pageNumber || 1) < (data?.pagination?.totalPages || 1);

  const onRefresh = () => {
    setPage(1);
    refetch();
  };

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setPage(p => p + 1);
    }
  };

  const renderTransaction = ({ item, index }: any) => (
    <TouchableOpacity
      style={[
        styles(themeColors).transactionRow,
        index === transactions.length - 1 && styles(themeColors).lastRow,
      ]}
      onPress={() => navigation.navigate('TransactionDetail', { id: item._id })}
      activeOpacity={0.7}
    >
      <View style={styles(themeColors).transactionLeft}>
        <View style={styles(themeColors).transactionHeader}>
          <View style={[
            styles(themeColors).categoryBadge,
            { backgroundColor: item.type === 'INCOME' ? '#10b98120' : '#ef444420' }
          ]}>
            <Text style={[
              styles(themeColors).categoryText,
              { color: item.type === 'INCOME' ? '#10b981' : '#ef4444' }
            ]}>
              {item.category}
            </Text>
          </View>
          <View style={styles(themeColors).paymentBadge}>
            <Text style={styles(themeColors).paymentText}>
              {item.paymentMethod}
            </Text>
          </View>
        </View>
        <Text style={styles(themeColors).transactionTitle}>{item.title}</Text>
        <Text style={styles(themeColors).transactionDate}>
          {format(new Date(item.date), 'MMM dd, yyyy • h:mm a')}
        </Text>
      </View>
      <Text
        style={[
          styles(themeColors).transactionAmount,
          item.type === 'INCOME' ? styles(themeColors).incomeAmount : styles(themeColors).expenseAmount,
        ]}
      >
        {item.type === 'INCOME' ? '+' : '-'}₨{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles(themeColors).header}>
      <View>
        <Text style={styles(themeColors).headerTitle}>All Transactions</Text>
        <Text style={styles(themeColors).headerSubtitle}>
          Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles(themeColors).addButton}
        onPress={() => navigation.navigate('AddTransaction')}
        activeOpacity={0.7}
      >
        <Plus size={20} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles(themeColors).emptyContainer}>
      <Text style={styles(themeColors).emptyText}>No transactions found</Text>
      <Text style={styles(themeColors).emptySubtext}>
        Start by adding your first transaction
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isFetching) return null;
    return (
      <View style={styles(themeColors).footer}>
        <ActivityIndicator size="small" color={themeColors.primary} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles(themeColors).loadingContainer}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles(themeColors).container}>
      {renderHeader()}
      <View style={styles(themeColors).content}>
        <Card>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item._id}
            renderItem={renderTransaction}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl 
                refreshing={false} 
                onRefresh={onRefresh}
                tintColor={themeColors.primary}
              />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        </Card>
      </View>
    </View>
  );
}

const styles = (theme: typeof colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      backgroundColor: theme.navbar,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxl,
    },
    headerTitle: {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.medium,
      color: '#ffffff',
      marginBottom: spacing.xs,
    },
    headerSubtitle: {
      fontSize: fontSize.sm,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    addButton: {
      backgroundColor: theme.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      marginTop: -spacing.xl,
      paddingHorizontal: spacing.lg,
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
    transactionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    categoryBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs - 2,
      borderRadius: borderRadius.sm,
    },
    categoryText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      textTransform: 'capitalize',
    },
    paymentBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs - 2,
      borderRadius: borderRadius.sm,
      backgroundColor: theme.muted,
    },
    paymentText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: theme.mutedForeground,
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
      marginLeft: spacing.sm,
    },
    incomeAmount: {
      color: '#10b981',
    },
    expenseAmount: {
      color: '#ef4444',
    },
    emptyContainer: {
      paddingVertical: spacing.xxxl,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: theme.foreground,
      marginBottom: spacing.xs,
    },
    emptySubtext: {
      fontSize: fontSize.sm,
      color: theme.mutedForeground,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    footer: {
      paddingVertical: spacing.lg,
      alignItems: 'center',
    },
  });
