import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Card from '../components/common/Card.jsx';
import NgoRegisterForm from '../components/auth/NgoRegisterForm.jsx';

export default function NgoRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card hoverLift={false} className="w-full max-w-md p-8">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Register your NGO</h1>
          <p className="text-sm text-muted mb-6">
            Create an organization account to start posting needs and coordinating relief.
          </p>
          <NgoRegisterForm />
        </Card>
      </main>
      <Footer />
    </div>
  );
}