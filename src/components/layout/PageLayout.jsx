import Navbar from '@/components/layout/Navbar.jsx';
import Footer from './Footer';

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}