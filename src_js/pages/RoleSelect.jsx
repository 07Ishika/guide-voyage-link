import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Globe2 } from "lucide-react";
import GoogleLoginButton from "../components/GoogleLoginButton";
import DemoLoginButton from "../components/DemoLoginButton";
import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

const RoleSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, loading, refreshUser } = useAuth();
  const [settingRole, setSettingRole] = useState(false);

  useEffect(() => {
    // If user has a role, redirect them
    if (currentUser && currentUser.role) {
      if (currentUser.role === 'guide') {
        navigate('/home/guide');
      } else {
        navigate('/home'); // Migrants go to home page first
      }
    }
  }, [currentUser, navigate]);

  const handleRoleSelection = async (role) => {
    if (!currentUser) {
      // User not authenticated, proceed with normal OAuth flow
      return;
    }

    // User is authenticated but needs to set role
    setSettingRole(true);
    try {
      const response = await fetch('http://localhost:5000/auth/set-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Role Set Successfully!",
          description: `Welcome ${data.user.displayName} as a ${role}`,
        });

        // Refresh user data in context
        refreshUser();

        // Redirect based on role
        if (role === 'guide') {
          navigate('/home/guide');
        } else {
          navigate('/home'); // Migrants go to home page first
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to set role",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive"
      });
    } finally {
      setSettingRole(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f6f8ff] via-[#eef2ff] to-white dark:from-[#0b0620] dark:via-[#14112d] dark:to-[#1a1240]">
      {/* Subtle gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[26rem] h-[26rem] sm:w-[34rem] sm:h-[34rem] lg:w-[40rem] lg:h-[40rem] rounded-full bg-primary/15 dark:bg-primary/20 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[30rem] h-[30rem] sm:w-[40rem] sm:h-[40rem] lg:w-[50rem] lg:h-[50rem] rounded-full bg-secondary/8 dark:bg-secondary/20 blur-3xl"></div>
      {/* Light-mode purple accent circles to match reference */}
      <div className="pointer-events-none absolute top-16 right-6 w-[28rem] h-[28rem] rounded-full bg-[#a78bfa]/30 blur-2xl dark:hidden"></div>
      <div className="pointer-events-none absolute top-1/2 left-8 -translate-y-1/2 w-[22rem] h-[22rem] rounded-full bg-[#c4b5fd]/30 blur-2xl dark:hidden"></div>
      <div className="pointer-events-none absolute -top-10 right-1/4 w-[34rem] h-[34rem] rounded-full bg-[#93c5fd]/20 blur-2xl dark:hidden"></div>

      {/* Top-right controls (glassmorphism) */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-20">
        <ThemeToggle />
      </div>

      <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative z-10">
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl p-8 shadow-soft">
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          {currentUser ? `Welcome ${currentUser.displayName}!` : 'Choose your role'}
        </h2>
        <p className="text-muted-foreground mb-8">
          {currentUser 
            ? 'Please select your role to continue to your personalized dashboard.'
            : 'Select your role and sign in with Google to access your personalized dashboard.'
          }
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border border-border p-6 bg-background/60">
            <div className="flex items-center gap-3 mb-4">
              <Globe2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Migrant</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Find verified guides, book sessions and track your journey.</p>
            <div className="space-y-3">
              {currentUser ? (
                <Button 
                  onClick={() => handleRoleSelection('migrant')}
                  disabled={settingRole}
                  className="w-full"
                  variant="hero"
                >
                  {settingRole ? 'Setting Role...' : 'Continue as Migrant'}
                </Button>
              ) : (
                <>
                  <GoogleLoginButton role="migrant" />
                  <DemoLoginButton role="migrant" />
                </>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-border p-6 bg-background/60">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold">Guide</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Offer consultations, manage availability and help migrants succeed.</p>
            <div className="space-y-3">
              {currentUser ? (
                <Button 
                  onClick={() => handleRoleSelection('guide')}
                  disabled={settingRole}
                  className="w-full"
                  variant="hero"
                >
                  {settingRole ? 'Setting Role...' : 'Continue as Guide'}
                </Button>
              ) : (
                <>
                  <GoogleLoginButton role="guide" />
                  <DemoLoginButton role="guide" />
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Manual Login Section */}
        <div className="rounded-xl border border-border p-6 bg-background/60 border-dashed border-accent">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
              <span className="text-xs font-bold text-accent">🔧</span>
            </div>
            <h3 className="font-semibold text-accent">Manual Login (Testing)</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Login as any user from the database for testing purposes. Perfect for development and testing the complete flow.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => window.location.href = '/manual-login'}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              Open Manual Login
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RoleSelection;


