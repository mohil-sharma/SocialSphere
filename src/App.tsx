
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ModeToggle } from "@/components/ThemeSwitcher";
import ProtectedRouteWrapper from "@/components/ProtectedRouteWrapper";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PostDetail from "./pages/PostDetail";
import UserProfile from "./pages/UserProfile";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Create a new query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <div className="fixed top-4 right-4 z-50">
              <ModeToggle />
            </div>
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route 
                  path="/user/:id" 
                  element={
                    <ProtectedRouteWrapper>
                      <UserProfile />
                    </ProtectedRouteWrapper>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <ProtectedRouteWrapper>
                      <Search />
                    </ProtectedRouteWrapper>
                  } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
