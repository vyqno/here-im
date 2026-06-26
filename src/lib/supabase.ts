// ── Auth & database layer ──────────────────────────────────────
// Uses Supabase when env vars are present, localStorage mock otherwise.

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItemSnapshot[];
  pickupDate: string;
  pickupTime: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface CartItemSnapshot {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const isMock = !supabaseUrl || !supabaseKey;

// Lazily initialise real client only in browser
let _supabase: any = null;
const getClient = async () => {
  if (isMock) return null;
  if (!_supabase) {
    const { createClient } = await import("@supabase/supabase-js");
    _supabase = createClient(supabaseUrl, supabaseKey);
  }
  return _supabase;
};

// ── Auth ──────────────────────────────────────────────────────
export const authService = {
  signUp: async (email: string, password: string, fullName: string) => {
    const sb = await getClient();
    if (sb) {
      return sb.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    }
    // Mock
    const users = JSON.parse(localStorage.getItem("hi_users") ?? "[]");
    if (users.find((u: any) => u.email === email))
      return { data: null, error: { message: "User already exists" } };
    const user = { id: `u_${Math.random().toString(36).slice(2)}`, email, fullName, password };
    users.push(user);
    localStorage.setItem("hi_users", JSON.stringify(users));
    const session: UserProfile = { id: user.id, email, fullName };
    localStorage.setItem("hi_session", JSON.stringify(session));
    return { data: { user: session }, error: null };
  },

  signIn: async (email: string, password: string) => {
    const sb = await getClient();
    if (sb) return sb.auth.signInWithPassword({ email, password });
    const users = JSON.parse(localStorage.getItem("hi_users") ?? "[]");
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) return { data: null, error: { message: "Invalid credentials" } };
    const session: UserProfile = { id: user.id, email: user.email, fullName: user.fullName };
    localStorage.setItem("hi_session", JSON.stringify(session));
    return { data: { user: session }, error: null };
  },

  signOut: async () => {
    const sb = await getClient();
    if (sb) return sb.auth.signOut();
    localStorage.removeItem("hi_session");
    return { error: null };
  },

  getCurrentUser: async (): Promise<UserProfile | null> => {
    const sb = await getClient();
    if (sb) {
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return null;
      return { id: user.id, email: user.email ?? "", fullName: user.user_metadata?.full_name ?? "Guest" };
    }
    try {
      const s = localStorage.getItem("hi_session");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  },
};

// ── Orders ────────────────────────────────────────────────────
export const dbService = {
  createOrder: async (payload: Omit<Order, "id" | "userId" | "status" | "createdAt">) => {
    const user = await authService.getCurrentUser();
    if (!user) return { data: null, error: { message: "Not authenticated" } };

    const order: Order = {
      id: `ord_${Math.random().toString(36).slice(2, 10)}`,
      userId: user.id,
      ...payload,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const sb = await getClient();
    if (sb) {
      const { data, error } = await sb.from("orders").insert([{
        id: order.id, user_id: order.userId, items: order.items,
        pickup_date: order.pickupDate, pickup_time: order.pickupTime,
        total_amount: order.totalAmount, status: order.status,
      }]).select();
      return { data, error };
    }

    const orders = JSON.parse(localStorage.getItem("hi_orders") ?? "[]");
    orders.unshift(order);
    localStorage.setItem("hi_orders", JSON.stringify(orders));
    return { data: order, error: null };
  },

  getUserOrders: async (): Promise<{ data: Order[] | null; error: any }> => {
    const user = await authService.getCurrentUser();
    if (!user) return { data: null, error: { message: "Not authenticated" } };

    const sb = await getClient();
    if (sb) {
      const { data, error } = await sb.from("orders").select("*")
        .eq("user_id", user.id).order("created_at", { ascending: false });
      return { data, error };
    }

    const orders: Order[] = JSON.parse(localStorage.getItem("hi_orders") ?? "[]");
    return { data: orders.filter((o) => o.userId === user.id), error: null };
  },
};
