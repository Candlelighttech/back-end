import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToasterProvider } from "./contexts/ToasterContext";
import { DashboardLayout } from "./components/DashboardLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Overview from "./pages/dashboard/Overview";
import Projects from "./pages/dashboard/Projects";
import Builder from "./pages/dashboard/Builder";
import Assistant from "./pages/dashboard/Assistant";
import Blog from "./pages/dashboard/Blog";
import Deploy from "./pages/dashboard/Deploy";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import Billing from "./pages/dashboard/Billing";
import Team from "./pages/dashboard/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ToasterProvider>
            <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="projects" element={<Projects />} />
              <Route path="builder" element={<Builder />} />
              <Route path="assistant" element={<Assistant />} />
              <Route path="blog" element={<Blog />} />
              <Route path="deploy" element={<Deploy />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="billing" element={<Billing />} />
              <Route path="team" element={<Team />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
            </Routes>
          </ToasterProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
