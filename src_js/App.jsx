import { Toaster } from "@/components/ui/toaster";
import BackendData from "./components/BackendData";
import UserInfo from "./components/UserInfo";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import Cover from "./pages/Cover";
import RoleSelection from "./pages/RoleSelect";
import HomeGuide from "./pages/HomeGuide";
import Community from "./pages/Community";
import Guides from "./pages/Guides";
import MigrantRequests from "./pages/MigrantRequests";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppShell = () => {
  const location = useLocation();
  const hiddenHeaderPaths = new Set(["/", "/role", "/login/migrant", "/login/guide"]);
  const isCover = hiddenHeaderPaths.has(location.pathname);
  return (
    <div className="min-h-screen bg-background">
      {!isCover && <Header />}
      {/* Show user info globally for demo purposes */}
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <UserInfo />
      </div>
      <Routes>
        <Route path="/" element={<Cover />} />
        <Route path="/role" element={<RoleSelection />} />
        <Route path="/home/guide" element={<HomeGuide />} />
        <Route path="/home" element={<Index />} />
        <Route path="/community" element={<Community />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/migrant-requests" element={<MigrantRequests />} />
        <Route path="/profile" element={<Profile />} />
        {/* MongoDB API demo route */}
        <Route path="/backend-demo" element={<BackendData />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
