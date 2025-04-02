
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

import TransactionStatusBadge from '@/components/dashboard/TransactionStatusBadge';
import PaymentForm from '@/components/forms/PaymentForm';
import { getTransactions, Transaction } from '@/lib/api';

const TransactionsPage = () => {
  const [open, setOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'purchase' | 'authorization'>('purchase');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions
  });

  const handleNewPaymentSuccess = () => {
    setOpen(false);
    // This would trigger a refetch in a real app
  };

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.customerName.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower) ||
      transaction.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-muted-foreground">Manage and view your payment transactions</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>New Transaction</DialogTitle>
                <DialogDescription>
                  Process a new payment or authorize for later capture
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="purchase" onValueChange={(value) => setPaymentType(value as 'purchase' | 'authorization')}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="purchase">Purchase</TabsTrigger>
                  <TabsTrigger value="authorization">Authorization</TabsTrigger>
                </TabsList>
                <TabsContent value="purchase">
                  <PaymentForm 
                    paymentType="purchase" 
                    onSuccess={handleNewPaymentSuccess}
                  />
                </TabsContent>
                <TabsContent value="authorization">
                  <PaymentForm 
                    paymentType="authorization"
                    onSuccess={handleNewPaymentSuccess}
                  />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">All Transactions</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
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
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TransactionRow key={transaction.id} transaction={transaction} />
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

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const canCapture = transaction.type === 'authorization' && transaction.status === 'success';
  const canVoid = ['success', 'processing'].includes(transaction.status);
  const canRefund = transaction.type === 'purchase' && transaction.status === 'success';
  
  const handleCapture = () => {
    toast.success('Authorization captured successfully');
  };
  
  const handleVoid = () => {
    toast.success('Transaction voided successfully');
  };
  
  const handleRefund = () => {
    toast.success('Transaction refunded successfully');
  };
  
  return (
    <TableRow>
      <TableCell className="font-medium">{transaction.id}</TableCell>
      <TableCell>{transaction.customerName}</TableCell>
      <TableCell className="capitalize">{transaction.type}</TableCell>
      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
      <TableCell>
        <TransactionStatusBadge status={transaction.status} />
      </TableCell>
      <TableCell>{new Date(transaction.timestamp).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          {canCapture && (
            <Button size="sm" variant="outline" onClick={handleCapture}>
              Capture
            </Button>
          )}
          {canVoid && (
            <Button size="sm" variant="outline" onClick={handleVoid}>
              Void
            </Button>
          )}
          {canRefund && (
            <Button size="sm" variant="outline" onClick={handleRefund}>
              Refund
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TransactionsPage;
