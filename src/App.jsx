import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Page imports
import Home from '@/pages/Home';
import MyVisits from '@/pages/MyVisits';
import BookingPage from '@/pages/BookingPage';
import VouchersPage from '@/pages/VouchersPage.jsx';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminServices from '@/pages/admin/AdminServices';
import AdminVouchers from '@/pages/admin/AdminVouchers';
import AdminStats from '@/pages/admin/AdminStats';
import AdminSoapNotes from '@/pages/admin/AdminSoapNotes';
import AccountPage from '@/pages/AccountPage';
import PackagesPage from '@/pages/PackagesPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-obsidian">
        <div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/rezerwacja" element={<BookingPage />} />
      <Route path="/vouchery" element={<VouchersPage />} />
      <Route path="/moje-wizyty" element={<MyVisits />} />
      <Route path="/konto" element={<AccountPage />} />
      <Route path="/pakiety" element={<PackagesPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/admin/wiadomosci" element={<AdminMessages />} />
      <Route path="/admin/uslugi" element={<AdminServices />} />
      <Route path="/admin/vouchery" element={<AdminVouchers />} />
      <Route path="/admin/statystyki" element={<AdminStats />} />
      <Route path="/admin/soap" element={<AdminSoapNotes />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App