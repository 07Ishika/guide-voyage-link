const STORAGE_KEY = "voyagery_demo_bookings";

export function readBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBooking(booking) {
  const current = readBookings();
  current.push({ id: Date.now().toString(), status: "pending", ...booking });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

export function updateBooking(id, partial) {
  const current = readBookings();
  const next = current.map(b => (b.id === id ? { ...b, ...partial } : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}




