import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Card from '../components/common/Card.jsx';
import VolunteerLoginForm from '../components/auth/VolunteerLoginForm.jsx';

export default function VolunteerLoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Card hoverLift={false} className="w-full max-w-md p-8">
          <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Volunteer Login</h1>
          <p className="text-sm text-muted mb-6">
            Sign in to view your assigned tasks and submit proof of work.
          </p>
          <VolunteerLoginForm />
        </Card>
      </main>
      <Footer />
    </div>
  );
}