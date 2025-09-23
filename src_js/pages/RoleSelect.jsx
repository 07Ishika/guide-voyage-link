import { Button } from "@/components/ui/button";
import { Users, Globe2 } from "lucide-react";
import GoogleRoleLogin from "../components/GoogleRoleLogin";

const RoleSelection = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl bg-card border border-border rounded-2xl p-8 shadow-soft">
        <h2 className="text-2xl font-bold mb-2 text-foreground">Choose your role</h2>
        <p className="text-muted-foreground mb-8">Log in as a migrant seeking guidance or as a guide offering help.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border p-6 bg-background/60">
            <div className="flex items-center gap-3 mb-4">
              <Globe2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Migrant</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Find verified guides, book sessions and track your journey.</p>
            <a href="/home"><Button variant="hero" className="w-full">Continue as Migrant</Button></a>
          </div>
          <div className="rounded-xl border border-border p-6 bg-background/60">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-secondary" />
              <h3 className="font-semibold">Guide</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Offer consultations, manage availability and help migrants succeed.</p>
            <a href="/home/guide"><Button variant="outline" className="w-full">Continue as Guide</Button></a>
          </div>
        </div>

  {/* Google login options removed as requested */}
      </div>
    </div>
  );
};

export default RoleSelection;


