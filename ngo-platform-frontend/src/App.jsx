import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';

// --- Phase 2: Auth & Roles - LIVE ---
import NgoLoginPage from './pages/NgoLoginPage.jsx';
import NgoRegisterPage from './pages/NgoRegisterPage.jsx';
import VolunteerLoginPage from './pages/VolunteerLoginPage.jsx';
// Volunteers do not self-register. Their accounts are created by their NGO's
// admin from the NGO dashboard (Phase 3+ "Volunteer management"), so there is
// no public /volunteer/register route.

// --- Phase 3: NGO dashboard - LIVE ---
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import DashboardHome from './pages/ngo-dashboard/DashboardHome.jsx';
import NeedsPage from './pages/ngo-dashboard/NeedsPage.jsx';
import HeatmapPage from './pages/ngo-dashboard/HeatmapPage.jsx';

// --- Phase 4: Matching + Task management - LIVE ---
import MatchingPage from './pages/ngo-dashboard/MatchingPage.jsx';
import TaskDetailPage from './pages/ngo-dashboard/TaskDetailPage.jsx';

// --- Phase 6: Event Mode + Logistics dashboard UI - LIVE ---
import EventsPage from './pages/ngo-dashboard/EventsPage.jsx';
import LogisticsPage from './pages/ngo-dashboard/LogisticsPage.jsx';

// --- Phase 7: NGO dashboard (not built yet) ---
// import UnclaimedTasksPage from './pages/ngo-dashboard/UnclaimedTasksPage.jsx';
// import ProofReviewPage from './pages/ngo-dashboard/ProofReviewPage.jsx';

// --- Phase 7: Volunteer dashboard (not built yet) ---
// import VolunteerHome from './pages/volunteer-dashboard/VolunteerHome.jsx';
// import ProofSubmitPage from './pages/volunteer-dashboard/ProofSubmitPage.jsx';

function App() {
  return (
    <Routes>
      {/* Phase 1 - LIVE */}
      <Route path="/" element={<LandingPage />} />

      {/* Phase 2 - LIVE */}
      <Route path="/ngo/login" element={<NgoLoginPage />} />
      <Route path="/ngo/register" element={<NgoRegisterPage />} />
      <Route path="/volunteer/login" element={<VolunteerLoginPage />} />

      {/* Phase 3 - LIVE */}
      <Route path="/dashboard" element={<ProtectedRoute role="ngo"><DashboardHome /></ProtectedRoute>} />
      <Route path="/dashboard/needs" element={<ProtectedRoute role="ngo"><NeedsPage /></ProtectedRoute>} />
      <Route path="/dashboard/heatmap" element={<ProtectedRoute role="ngo"><HeatmapPage /></ProtectedRoute>} />

      {/* Phase 4 - LIVE */}
      <Route path="/dashboard/match/:needId" element={<ProtectedRoute role="ngo"><MatchingPage /></ProtectedRoute>} />
      <Route path="/dashboard/tasks/:taskId" element={<ProtectedRoute role="ngo"><TaskDetailPage /></ProtectedRoute>} />

      {/* Phase 6 - LIVE */}
      <Route path="/dashboard/events" element={<ProtectedRoute role="ngo"><EventsPage /></ProtectedRoute>} />
      <Route path="/dashboard/logistics" element={<ProtectedRoute role="ngo"><LogisticsPage /></ProtectedRoute>} />

      {/* Phase 7: NGO dashboard - uncomment once built
      <Route path="/dashboard/unclaimed" element={<ProtectedRoute role="ngo"><UnclaimedTasksPage /></ProtectedRoute>} />
      <Route path="/dashboard/proofs" element={<ProtectedRoute role="ngo"><ProofReviewPage /></ProtectedRoute>} />
      */}

      {/* Phase 7: Volunteer dashboard - uncomment once built
      <Route path="/volunteer" element={<ProtectedRoute role="volunteer"><VolunteerHome /></ProtectedRoute>} />
      <Route path="/volunteer/submit/:taskId" element={<ProtectedRoute role="volunteer"><ProofSubmitPage /></ProtectedRoute>} />
      */}
    </Routes>
  );
}

export default App;