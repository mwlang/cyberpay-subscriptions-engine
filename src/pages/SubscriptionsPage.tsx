
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { getSubscriptions, Subscription } from '@/lib/api';

const SubscriptionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions
  });

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      subscription.id.toLowerCase().includes(searchLower) ||
      subscription.planName.toLowerCase().includes(searchLower) ||
      subscription.customerId.toLowerCase().includes(searchLower) ||
      subscription.status.toLowerCase().includes(searchLower)
    );
  });

  const activeSubscriptions = filteredSubscriptions.filter(sub => sub.status === 'active');
  const pastDueSubscriptions = filteredSubscriptions.filter(sub => sub.status === 'past_due');
  const canceledSubscriptions = filteredSubscriptions.filter(sub => sub.status === 'canceled');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground">Manage your recurring billing subscriptions</p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">All Subscriptions</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                className="pl-8 w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active">
                  Active ({activeSubscriptions.length})
                </TabsTrigger>
                <TabsTrigger value="past_due">
                  Past Due ({pastDueSubscriptions.length})
                </TabsTrigger>
                <TabsTrigger value="canceled">
                  Canceled ({canceledSubscriptions.length})
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-4">
                {['active', 'past_due', 'canceled'].map((status) => (
                  <TabsContent key={status} value={status}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Subscription ID</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>Next Billing</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              Loading subscriptions...
                            </TableCell>
                          </TableRow>
                        ) : filteredSubscriptions.filter(sub => sub.status === status).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                              No {status} subscriptions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSubscriptions
                            .filter(sub => sub.status === status)
                            .map((subscription) => (
                              <SubscriptionRow key={subscription.id} subscription={subscription} />
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

interface SubscriptionRowProps {
  subscription: Subscription;
}

const SubscriptionRow: React.FC<SubscriptionRowProps> = ({ subscription }) => {
  const handleCancel = () => {
    toast.success(`Subscription ${subscription.id} cancelled`);
  };
  
  const handleRenew = () => {
    toast.success(`Subscription ${subscription.id} renewed`);
  };
  
  const handleUpdatePayment = () => {
    toast.success(`Payment method updated for subscription ${subscription.id}`);
  };
  
  return (
    <TableRow>
      <TableCell className="font-medium">{subscription.id}</TableCell>
      <TableCell>{subscription.planName}</TableCell>
      <TableCell>{subscription.customerId}</TableCell>
      <TableCell>${subscription.amount.toFixed(2)}/month</TableCell>
      <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
      <TableCell>{new Date(subscription.nextBillingDate).toLocaleDateString()}</TableCell>
      <TableCell>
        •••• {subscription.paymentMethod.cardLast4} 
        <span className="text-xs text-muted-foreground ml-1">
          (Expires: {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear})
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {subscription.status === 'active' && (
            <Button size="sm" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          {subscription.status === 'past_due' && (
            <>
              <Button size="sm" variant="outline" onClick={handleUpdatePayment}>
                Update Payment
              </Button>
              <Button size="sm" onClick={handleRenew}>
                Renew
              </Button>
            </>
          )}
          {subscription.status === 'canceled' && (
            <Button size="sm" onClick={handleRenew}>
              Reactivate
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default SubscriptionsPage;
