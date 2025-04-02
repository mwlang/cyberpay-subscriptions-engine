
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TransactionsPage from "./pages/TransactionsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import CustomersPage from "./pages/CustomersPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import FailedPaymentsPage from "./pages/FailedPaymentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/payment-history" element={<PaymentHistoryPage />} />
          <Route path="/failed-payments" element={<FailedPaymentsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
