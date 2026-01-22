"use client";

import { useEffect, useState } from "react";

/* ================== CONFIG ================== */
const SHOP_NAME = "TANA TRÀ QUÁN";
const LOGO = "🧋";

/* ================== TYPES ================== */
type Role = "admin" | "cashier";

type User = {
  username: string;
  role: Role;
};

type Size = "S" | "M" | "L";

type Topping = {
  id: string;
  name: string;
  price: number;
};

type Product = {
  id: string;
  name: string;
  active: boolean;
  prices: Record<Size, number>;
  toppings: Topping[];
};

type OrderItem = {
  id: string;
  productId: string;
  name: string;
  size: Size;
  toppings: Topping[];
  note: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  time: string;
  items: OrderItem[];
  total: number;
  payment: "cash" | "transfer";
  paid: boolean;
  canceled?: boolean;
};

/* ================== STORAGE ================== */
const store = {
  get<T>(k: string, d: T): T {
    if (typeof window === "undefined") return d;
    return JSON.parse(localStorage.getItem(k) || "null") ?? d;
  },
  set(k: string, v: any) {
    localStorage.setItem(k, JSON.stringify(v));
  },
};

/* ================== MAIN ================== */
export default function POS() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [view, setView] = useState<"pos" | "admin" | "report">("pos");

  /* ========== INIT ========== */
  useEffect(() => {
    setProducts(
      store.get<Product[]>("products", [
        {
          id: "ts1",
          name: "Trà sữa truyền thống",
          active: true,
          prices: { S: 25000, M: 30000, L: 35000 },
          toppings: [
            { id: "tp1", name: "Trân châu", price: 5000 },
            { id: "tp2", name: "Pudding", price: 7000 },
          ],
        },
        {
          id: "ts2",
          name: "Trà đào",
          active: true,
          prices: { S: 30000, M: 35000, L: 40000 },
          toppings: [],
        },
      ])
    );
    setOrders(store.get<Order[]>("orders", []));
  }, []);

  useEffect(() => {
    store.set("products", products);
  }, [products]);

  useEffect(() => {
    store.set("orders", orders);
  }, [orders]);

  /* ========== LOGIN ========== */
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-80">
          <h2 className="text-xl font-bold mb-4 text-center">{SHOP_NAME}</h2>
          <button
            className="w-full bg-blue-600 text-white p-2 rounded mb-2"
            onClick={() => setUser({ username: "admin", role: "admin" })}
          >
            Đăng nhập CHỦ QUÁN
          </button>
          <button
            className="w-full bg-green-600 text-white p-2 rounded"
            onClick={() => setUser({ username: "cashier", role: "cashier" })}
          >
            Đăng nhập THU NGÂN
          </button>
        </div>
      </div>
    );
  }

  /* ========== ORDER LOGIC ========== */
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = (payment: "cash" | "transfer") => {
    if (cart.length === 0) return;
    const order: Order = {
      id: Date.now().toString(),
      time: new Date().toLocaleString(),
      items: cart,
      total,
      payment,
      paid: true,
    };
    setOrders([order, ...orders]);
    setCart([]);
    setTimeout(() => window.print(), 300);
  };

  const cancelOrder = (id: string) => {
    if (user.role !== "admin") return;
    setOrders(
      orders.map((o) => (o.id === id ? { ...o, canceled: true } : o))
    );
  };

  /* ========== UI ========== */
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-extrabold">
          {LOGO} {SHOP_NAME}
        </h1>
        <div className="space-x-2">
          <button onClick={() => setView("pos")}>Bán hàng</button>
          {user.role === "admin" && (
            <>
              <button onClick={() => setView("admin")}>Menu</button>
              <button onClick={() => setView("report")}>Báo cáo</button>
            </>
          )}
        </div>
      </header>

      {/* ================= POS ================= */}
      {view === "pos" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Sản phẩm</h2>
            <div className="grid grid-cols-3 gap-3">
              {products
                .filter((p) => p.active)
                .map((p) => (
                  <button
                    key={p.id}
                    className="bg-green-600 text-white p-4 rounded font-bold"
                    onClick={() =>
                      setCart([
                        ...cart,
                        {
                          id: Date.now().toString(),
                          productId: p.id,
                          name: p.name,
                          size: "M",
                          toppings: [],
                          note: "",
                          qty: 1,
                          price: p.prices.M,
                        },
                      ])
                    }
                  >
                    {p.name}
                    <div>{p.prices.M.toLocaleString()} đ</div>
                  </button>
                ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Hóa đơn</h2>
            {cart.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span>
                  {i.name} x{i.qty}
                </span>
                <span>{(i.price * i.qty).toLocaleString()} đ</span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="font-extrabold">
              Tổng: {total.toLocaleString()} đ
            </div>
            <button
              className="w-full bg-blue-600 text-white p-2 mt-2 rounded"
              onClick={() => checkout("cash")}
            >
              Thanh toán tiền mặt
            </button>
            <button
              className="w-full bg-purple-600 text-white p-2 mt-2 rounded"
              onClick={() => checkout("transfer")}
            >
              Chuyển khoản
            </button>
          </div>
        </div>
      )}

      {/* ================= ADMIN MENU ================= */}
      {view === "admin" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Quản lý menu</h2>
          {products.map((p, idx) => (
            <div key={p.id} className="flex justify-between mb-2">
              <span>{p.name}</span>
              <button
                onClick={() =>
                  setProducts(
                    products.map((x, i) =>
                      i === idx ? { ...x, active: !x.active } : x
                    )
                  )
                }
                className="text-sm text-blue-600"
              >
                {p.active ? "Tắt" : "Bật"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= REPORT ================= */}
      {view === "report" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-2">Lịch sử đơn</h2>
          {orders.map((o) => (
            <div key={o.id} className="border-b py-1 text-sm">
              <div>
                #{o.id} – {o.time}
              </div>
              <div>
                {o.total.toLocaleString()} đ – {o.payment}
                {o.canceled && " (ĐÃ HOÀN)"}
              </div>
              {user.role === "admin" && !o.canceled && (
                <button
                  className="text-red-600 text-xs"
                  onClick={() => cancelOrder(o.id)}
                >
                  Hoàn đơn
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
