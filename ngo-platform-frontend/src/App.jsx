import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import NgoLoginPage from './pages/NgoLoginPage.jsx';
import NgoRegisterPage from './pages/NgoRegisterPage.jsx';
import VolunteerLoginPage from './pages/VolunteerLoginPage.jsx';
import VolunteerRegisterPage from './pages/VolunteerRegisterPage.jsx';
import DashboardHome from './pages/ngo-dashboard/DashboardHome.jsx';
import NeedsPage from './pages/ngo-dashboard/NeedsPage.jsx';
import HeatmapPage from './pages/ngo-dashboard/HeatmapPage.jsx';
import MatchingPage from './pages/ngo-dashboard/MatchingPage.jsx';
import TaskDetailPage from './pages/ngo-dashboard/TaskDetailPage.jsx';
import UnclaimedTasksPage from './pages/ngo-dashboard/UnclaimedTasksPage.jsx';
import ProofReviewPage from './pages/ngo-dashboard/ProofReviewPage.jsx';
import VolunteerHome from './pages/volunteer-dashboard/VolunteerHome.jsx';
import ProofSubmitPage from './pages/volunteer-dashboard/ProofSubmitPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      {/* Phase 1 */}
      <Route path="/" element={<LandingPage />} />

      {/* Phase 2 */}
      <Route path="/ngo/login" element={<NgoLoginPage />} />
      <Route path="/ngo/register" element={<NgoRegisterPage />} />
      <Route path="/volunteer/login" element={<VolunteerLoginPage />} />
      <Route path="/volunteer/register" element={<VolunteerRegisterPage />} />

      {/* Phase 3-5, 7: NGO dashboard (role-protected) */}
      <Route path="/dashboard" element={<ProtectedRoute role="ngo"><DashboardHome /></ProtectedRoute>} />
      <Route path="/dashboard/needs" element={<ProtectedRoute role="ngo"><NeedsPage /></ProtectedRoute>} />
      <Route path="/dashboard/heatmap" element={<ProtectedRoute role="ngo"><HeatmapPage /></ProtectedRoute>} />
      <Route path="/dashboard/match/:needId" element={<ProtectedRoute role="ngo"><MatchingPage /></ProtectedRoute>} />
      <Route path="/dashboard/tasks/:taskId" element={<ProtectedRoute role="ngo"><TaskDetailPage /></ProtectedRoute>} />
      <Route path="/dashboard/unclaimed" element={<ProtectedRoute role="ngo"><UnclaimedTasksPage /></ProtectedRoute>} />
      <Route path="/dashboard/proofs" element={<ProtectedRoute role="ngo"><ProofReviewPage /></ProtectedRoute>} />

      {/* Phase 7: Volunteer dashboard (role-protected) */}
      <Route path="/volunteer" element={<ProtectedRoute role="volunteer"><VolunteerHome /></ProtectedRoute>} />
      <Route path="/volunteer/submit/:taskId" element={<ProtectedRoute role="volunteer"><ProofSubmitPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;