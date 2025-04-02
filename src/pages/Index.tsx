
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, CreditCard, DollarSign, RefreshCcw, Users } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import TransactionStatusBadge from '@/components/dashboard/TransactionStatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTransactions, getSubscriptions, getCustomers, Transaction } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });

  const { data: subscriptions = [], isLoading: loadingSubscriptions } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions,
  });
  
  const { data: customers = [], isLoading: loadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });

  // Calculate summary statistics
  const totalRevenue = transactions
    .filter(tx => tx.status === 'success' && (tx.type === 'purchase' || tx.type === 'capture'))
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const activeSubscriptionsCount = subscriptions.filter(sub => sub.status === 'active').length;
  
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
  
  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your payment operations</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={<DollarSign className="h-4 w-4 text-payment-primary" />}
            description="All time revenue"
          />
          
          <StatCard
            title="Active Subscriptions"
            value={activeSubscriptionsCount}
            icon={<RefreshCcw className="h-4 w-4 text-payment-primary" />}
            trend="up"
            trendValue="+5.2%"
            description="From last month"
          />
          
          <StatCard
            title="Customers"
            value={customers.length}
            icon={<Users className="h-4 w-4 text-payment-primary" />}
            description="Total customer base"
          />
          
          <StatCard
            title="Transactions"
            value={transactions.length}
            icon={<CreditCard className="h-4 w-4 text-payment-primary" />}
            description="Total processed"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest payment activities</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/transactions">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">When</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingTransactions ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : recentTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No transactions yet</TableCell>
                    </TableRow>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="font-medium">{transaction.customerName}</div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.type}
                          </div>
                        </TableCell>
                        <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <TransactionStatusBadge status={transaction.status} />
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {formatTimeAgo(transaction.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Subscriptions Overview</CardTitle>
              <CardDescription>Active and past due subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="past_due">Past Due</TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  {loadingSubscriptions ? (
                    <div className="py-4 text-center">Loading...</div>
                  ) : subscriptions.filter(sub => sub.status === 'active').length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground">No active subscriptions</div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions
                        .filter(sub => sub.status === 'active')
                        .map(subscription => (
                          <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="font-medium">{subscription.planName}</div>
                              <div className="text-xs text-muted-foreground">
                                Next billing: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${subscription.amount.toFixed(2)}/mo</div>
                              <div className="text-xs">
                                <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs">Active</span>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="past_due">
                  {loadingSubscriptions ? (
                    <div className="py-4 text-center">Loading...</div>
                  ) : subscriptions.filter(sub => sub.status === 'past_due').length === 0 ? (
                    <div className="py-4 text-center text-muted-foreground">No past due subscriptions</div>
                  ) : (
                    <div className="space-y-4">
                      {subscriptions
                        .filter(sub => sub.status === 'past_due')
                        .map(subscription => (
                          <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="font-medium">{subscription.planName}</div>
                              <div className="text-xs text-muted-foreground">
                                Due since: {new Date(subscription.nextBillingDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${subscription.amount.toFixed(2)}/mo</div>
                              <div className="text-xs">
                                <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs">Past Due</span>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/subscriptions">
                    Manage Subscriptions
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
