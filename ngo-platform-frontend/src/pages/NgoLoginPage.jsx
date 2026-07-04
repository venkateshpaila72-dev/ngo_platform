import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Card from '../components/common/Card.jsx';
import NgoLoginForm from '../components/auth/NgoLoginForm.jsx';

export default function NgoLoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card hoverLift={false} className="w-full max-w-md p-8">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-1">NGO Login</h1>
          <p className="text-sm text-muted mb-6">
            Sign in to manage needs, tasks, and your volunteer roster.
          </p>
          <NgoLoginForm />
        </Card>
      </main>
      <Footer />
    </div>
  );
}