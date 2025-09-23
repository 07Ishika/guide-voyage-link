import { Button } from "@/components/ui/button";
import { addBooking, readBookings } from "@/lib/storage";
import { useEffect, useState } from "react";

const mockGuides = [
  { id: "g1", name: "Ava Patel", country: "Canada", specialty: "Study Visa" },
  { id: "g2", name: "Liam Chen", country: "Germany", specialty: "Job Seeker" },
  { id: "g3", name: "Maria Rossi", country: "Italy", specialty: "Family Reunification" },
];

const DashboardMigrant = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => setBookings(readBookings()), []);

  const requestSession = (guide) => {
    addBooking({ guideId: guide.id, guideName: guide.name, requestedBy: "migrant" });
    setBookings(readBookings());
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Migrant Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="font-semibold">Find a guide</h2>
          <div className="space-y-3">
            {mockGuides.map((g) => (
              <div key={g.id} className="flex items-center justify-between border border-border rounded-lg p-4 bg-card">
                <div>
                  <div className="font-medium">{g.name}</div>
                  <div className="text-xs text-muted-foreground">{g.country} • {g.specialty}</div>
                </div>
                <Button size="sm" onClick={() => requestSession(g)}>Request session</Button>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="font-semibold">Your requests</h2>
          <div className="space-y-3">
            {bookings.length === 0 && (
              <div className="text-sm text-muted-foreground">No requests yet.</div>
            )}
            {bookings.map((b) => (
              <div key={b.id} className="border border-border rounded-lg p-4 bg-card">
                <div className="font-medium">Guide: {b.guideName}</div>
                <div className="text-xs text-muted-foreground capitalize">Status: {b.status}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardMigrant;


