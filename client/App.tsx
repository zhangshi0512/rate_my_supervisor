import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import LandingPage from '@/pages/LandingPage';
import SupervisorList from '@/pages/SupervisorList';
import SupervisorDetail from '@/pages/SupervisorDetail';
import OrganizationList from '@/pages/OrganizationList';
import OrganizationDetail from '@/pages/OrganizationDetail';
import WriteReview from '@/pages/WriteReview';
import WriteOrganizationReview from '@/pages/WriteOrganizationReview';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/supervisors" element={<SupervisorList />} />
              <Route path="/supervisors/:id" element={<SupervisorDetail />} />
              <Route path="/supervisors/:id/review" element={<WriteReview />} />
              <Route path="/organizations" element={<OrganizationList />} />
              <Route path="/organizations/:id" element={<OrganizationDetail />} />
              <Route path="/organizations/:id/review" element={<WriteOrganizationReview />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;