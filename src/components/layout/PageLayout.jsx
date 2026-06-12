import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({ children, dark = false }) {
  return (
    <div className={`min-h-screen ${dark ? 'bg-obsidian' : 'bg-bone'}`}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}