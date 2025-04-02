
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import TransactionStatusBadge from '@/components/dashboard/TransactionStatusBadge';
import { getTransactions, Transaction } from '@/lib/api';

const FailedPaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });

  // Filter failed transactions
  const failedTransactions = transactions.filter(tx => 
    tx.status === 'declined' || tx.status === 'error'
  );

  // Filter based on search
  const filteredTransactions = failedTransactions.filter(transaction => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.customerName.toLowerCase().includes(searchLower) ||
      transaction.responseMessage?.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower)
    );
  });

  const handleRetry = (transaction: Transaction) => {
    toast.success(`Retrying payment for transaction ${transaction.id}`);
    // In a real app, this would retry the payment
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Failed Payments</h1>
          <p className="text-muted-foreground">View and manage declined or errored transactions</p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Failed Payments</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search failed payments..."
                className="pl-8 w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Error Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading failed payments...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No failed payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell className="capitalize">{transaction.type}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <TransactionStatusBadge status={transaction.status} />
                      </TableCell>
                      <TableCell>{transaction.responseMessage || 'Unknown error'}</TableCell>
                      <TableCell>{new Date(transaction.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRetry(transaction)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FailedPaymentsPage;
