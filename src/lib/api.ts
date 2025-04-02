
// Mock API for Cybersource Payment Gateway
// In a real-world app, this would connect to the actual Cybersource API

// Type definitions
export type TransactionType = 'purchase' | 'authorization' | 'capture' | 'void' | 'refund' | 'verification';
export type TransactionStatus = 'processing' | 'success' | 'declined' | 'error' | 'refunded' | 'voided';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  cardLast4: string;
  customerName: string;
  timestamp: string;
  requestId?: string;
  responseCode?: string;
  responseMessage?: string;
  subscriptionId?: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'active' | 'canceled' | 'past_due';
  startDate: string;
  nextBillingDate: string;
  paymentMethod: {
    cardLast4: string;
    cardType: string;
    expiryMonth: string;
    expiryYear: string;
  }
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  subscriptions: string[];
  transactions: string[];
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: 'tx_1234567890',
    type: 'purchase',
    amount: 99.99,
    currency: 'USD',
    status: 'success',
    cardLast4: '4242',
    customerName: 'John Doe',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    requestId: 'req_123456',
    responseCode: '100',
    responseMessage: 'Success',
    subscriptionId: 'sub_12345'
  },
  {
    id: 'tx_2345678901',
    type: 'authorization',
    amount: 199.99,
    currency: 'USD',
    status: 'success',
    cardLast4: '1234',
    customerName: 'Jane Smith',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    requestId: 'req_234567',
    responseCode: '100',
    responseMessage: 'Success'
  },
  {
    id: 'tx_3456789012',
    type: 'capture',
    amount: 199.99,
    currency: 'USD',
    status: 'processing',
    cardLast4: '1234',
    customerName: 'Jane Smith',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    requestId: 'req_345678',
    responseCode: '100',
    responseMessage: 'Success'
  },
  {
    id: 'tx_4567890123',
    type: 'refund',
    amount: 49.99,
    currency: 'USD',
    status: 'refunded',
    cardLast4: '5678',
    customerName: 'Robert Johnson',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    requestId: 'req_456789',
    responseCode: '100',
    responseMessage: 'Success'
  },
  {
    id: 'tx_5678901234',
    type: 'purchase',
    amount: 129.99,
    currency: 'USD',
    status: 'declined',
    cardLast4: '9012',
    customerName: 'Sarah Williams',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    requestId: 'req_567890',
    responseCode: '231',
    responseMessage: 'Invalid card number'
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_12345',
    customerId: 'cus_12345',
    planName: 'Pro Plan',
    amount: 99.99,
    currency: 'USD',
    status: 'active',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: {
      cardLast4: '4242',
      cardType: 'Visa',
      expiryMonth: '12',
      expiryYear: '2025'
    }
  },
  {
    id: 'sub_23456',
    customerId: 'cus_23456',
    planName: 'Enterprise Plan',
    amount: 299.99,
    currency: 'USD',
    status: 'active',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: {
      cardLast4: '1234',
      cardType: 'Mastercard',
      expiryMonth: '09',
      expiryYear: '2024'
    }
  },
  {
    id: 'sub_34567',
    customerId: 'cus_34567',
    planName: 'Basic Plan',
    amount: 49.99,
    currency: 'USD',
    status: 'past_due',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    nextBillingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: {
      cardLast4: '5678',
      cardType: 'Visa',
      expiryMonth: '03',
      expiryYear: '2023'
    }
  }
];

const mockCustomers: Customer[] = [
  {
    id: 'cus_12345',
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    subscriptions: ['sub_12345'],
    transactions: ['tx_1234567890']
  },
  {
    id: 'cus_23456',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    subscriptions: ['sub_23456'],
    transactions: ['tx_2345678901', 'tx_3456789012']
  },
  {
    id: 'cus_34567',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    subscriptions: ['sub_34567'],
    transactions: ['tx_4567890123']
  },
  {
    id: 'cus_45678',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    subscriptions: [],
    transactions: ['tx_5678901234']
  }
];

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substring(2, 15)}`;

// API functions
export async function getTransactions(): Promise<Transaction[]> {
  await delay(500); // Simulate network request
  return [...mockTransactions];
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  await delay(300);
  const transaction = mockTransactions.find(tx => tx.id === id);
  return transaction || null;
}

export async function getSubscriptions(): Promise<Subscription[]> {
  await delay(500);
  return [...mockSubscriptions];
}

export async function getSubscription(id: string): Promise<Subscription | null> {
  await delay(300);
  const subscription = mockSubscriptions.find(sub => sub.id === id);
  return subscription || null;
}

export async function getCustomers(): Promise<Customer[]> {
  await delay(500);
  return [...mockCustomers];
}

export async function getCustomer(id: string): Promise<Customer | null> {
  await delay(300);
  const customer = mockCustomers.find(cus => cus.id === id);
  return customer || null;
}

export async function processPayment(paymentData: Record<string, any>): Promise<Transaction> {
  await delay(1000); // Simulate payment processing
  
  // In a real application, this would call the Cybersource API
  const success = Math.random() > 0.2; // 80% success rate for demo
  
  if (!success) {
    throw new Error('Payment declined by processor');
  }
  
  // Create new transaction
  const newTransaction: Transaction = {
    id: generateId('tx'),
    type: paymentData.type as TransactionType,
    amount: parseFloat(paymentData.amount),
    currency: 'USD',
    status: 'success',
    cardLast4: paymentData.cardNumber.slice(-4),
    customerName: paymentData.cardName,
    timestamp: new Date().toISOString(),
    requestId: generateId('req'),
    responseCode: '100',
    responseMessage: 'Success'
  };
  
  // If it's a purchase, create subscription
  if (paymentData.type === 'purchase') {
    const subscriptionId = generateId('sub');
    const customerId = generateId('cus');
    
    newTransaction.subscriptionId = subscriptionId;
    
    // Create subscription
    const newSubscription: Subscription = {
      id: subscriptionId,
      customerId: customerId,
      planName: 'Monthly Plan',
      amount: parseFloat(paymentData.amount),
      currency: 'USD',
      status: 'active',
      startDate: new Date().toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: {
        cardLast4: paymentData.cardNumber.slice(-4),
        cardType: 'Visa', // In a real app, determine this from the card number
        expiryMonth: paymentData.expiryMonth,
        expiryYear: paymentData.expiryYear
      }
    };
    
    // Create customer
    const newCustomer: Customer = {
      id: customerId,
      name: paymentData.cardName,
      email: `${paymentData.cardName.toLowerCase().replace(/\s/g, '.')}@example.com`, // Mock email
      createdAt: new Date().toISOString(),
      subscriptions: [subscriptionId],
      transactions: [newTransaction.id]
    };
    
    // In a real app, save these to database
    mockSubscriptions.push(newSubscription);
    mockCustomers.push(newCustomer);
  }
  
  // Save transaction
  mockTransactions.push(newTransaction);
  
  return newTransaction;
}

export async function captureAuthorization(authorizationId: string, amount?: number): Promise<Transaction> {
  await delay(800);
  
  const authorization = mockTransactions.find(tx => tx.id === authorizationId && tx.type === 'authorization');
  
  if (!authorization) {
    throw new Error('Authorization not found');
  }
  
  const captureAmount = amount || authorization.amount;
  
  const captureTransaction: Transaction = {
    id: generateId('tx'),
    type: 'capture',
    amount: captureAmount,
    currency: authorization.currency,
    status: 'success',
    cardLast4: authorization.cardLast4,
    customerName: authorization.customerName,
    timestamp: new Date().toISOString(),
    requestId: generateId('req'),
    responseCode: '100',
    responseMessage: 'Success'
  };
  
  mockTransactions.push(captureTransaction);
  
  return captureTransaction;
}

export async function voidTransaction(transactionId: string): Promise<Transaction> {
  await delay(800);
  
  const transaction = mockTransactions.find(tx => tx.id === transactionId);
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  if (transaction.status === 'voided') {
    throw new Error('Transaction already voided');
  }
  
  const voidTransaction: Transaction = {
    id: generateId('tx'),
    type: 'void',
    amount: transaction.amount,
    currency: transaction.currency,
    status: 'voided',
    cardLast4: transaction.cardLast4,
    customerName: transaction.customerName,
    timestamp: new Date().toISOString(),
    requestId: generateId('req'),
    responseCode: '100',
    responseMessage: 'Success'
  };
  
  // Update original transaction status
  const index = mockTransactions.findIndex(tx => tx.id === transactionId);
  if (index !== -1) {
    mockTransactions[index] = {
      ...mockTransactions[index],
      status: 'voided'
    };
  }
  
  mockTransactions.push(voidTransaction);
  
  return voidTransaction;
}

export async function refundTransaction(transactionId: string, amount?: number): Promise<Transaction> {
  await delay(800);
  
  const transaction = mockTransactions.find(tx => tx.id === transactionId);
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  const refundAmount = amount || transaction.amount;
  
  const refundTransaction: Transaction = {
    id: generateId('tx'),
    type: 'refund',
    amount: refundAmount,
    currency: transaction.currency,
    status: 'refunded',
    cardLast4: transaction.cardLast4,
    customerName: transaction.customerName,
    timestamp: new Date().toISOString(),
    requestId: generateId('req'),
    responseCode: '100',
    responseMessage: 'Success'
  };
  
  mockTransactions.push(refundTransaction);
  
  return refundTransaction;
}
