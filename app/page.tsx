"use client";

import { useEffect, useState } from "react";

/* ================= CONFIG ================= */
const SHOP_NAME = "TANA TRÀ QUÁN";
const LOGO = "🧋";

/* ================= TYPES ================= */
type Product = {
  id: string;
  name: string;
  price: number;
  active: boolean;
};

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
};

type Order = {
  id: string;
  time: string;
  items: CartItem[];
  total: number;
  payment: "cash" | "transfer";
};

/* ================= STORAGE ================= */
const store = {
  get<T>(k: string, d: T): T {
    if (typeof window === "undefined") return d;
    return JSON.parse(localStorage.getItem(k) || "null") ?? d;
  },
  set(k: string, v: any) {
    localStorage.setItem(k, JSON.stringify(v));
  },
};

/* ================= MAIN ================= */
export default function POS() {
  const [view, setView] = useState<"pos" | "menu" | "report">("pos");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  /* ===== INIT ===== */
  useEffect(() => {
    setProducts(
      store.get("products", [
        { id: "1", name: "Trà sữa truyền thống", price: 30000, active: true },
        { id: "2", name: "Trà đào", price: 35000, active: true },
      ])
    );
    setOrders(store.get("orders", []));
  }, []);

  useEffect(() => store.set("products", products), [products]);
  useEffect(() => store.set("orders", orders), [orders]);

  /* ===== POS LOGIC ===== */
  const addToCart = (p: Product) => {
    const found = cart.find((i) => i.productId === p.id);
    if (found) {
      setCart(
        cart.map((i) =>
          i.productId === p.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: Date.now().toString(),
          productId: p.id,
          name: p.name,
          price: p.price,
          qty: 1,
        },
      ]);
    }
  };

  const changeQty = (id: string, d: number) => {
    setCart(
      cart
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty + d } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = (payment: "cash" | "transfer") => {
    if (cart.length === 0) return;
    const order: Order = {
      id: Date.now().toString(),
      time: new Date().toLocaleString(),
      items: cart,
      total,
      payment,
    };
    setOrders([order, ...orders]);
    setCart([]);
    setTimeout(() => window.print(), 300);
  };

  /* ===== MENU ADMIN ===== */
  const addProduct = () => {
    const name = prompt("Tên món?");
    const price = Number(prompt("Giá tiền?"));
    if (!name || !price) return;
    setProducts([
      ...products,
      { id: Date.now().toString(), name, price, active: true },
    ]);
  };

  const updateProduct = (id: string) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const name = prompt("Tên món", p.name) || p.name;
    const price = Number(prompt("Giá", p.price.toString())) || p.price;
    setProducts(
      products.map((x) =>
        x.id === id ? { ...x, name, price } : x
      )
    );
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-200 p-4 text-black">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-extrabold">
          {LOGO} {SHOP_NAME}
        </h1>
        <div className="space-x-3 font-bold">
          <button onClick={() => setView("pos")}>Bán hàng</button>
          <button onClick={() => setView("menu")}>Menu</button>
          <button onClick={() => setView("report")}>Báo cáo</button>
        </div>
      </header>

      {/* ================= POS ================= */}
      {view === "pos" && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-extrabold mb-3">SẢN PHẨM</h2>
            <div className="grid grid-cols-3 gap-3">
              {products.filter(p => p.active).map(p => (
                <button
                  key={p.id}
                  className="bg-green-600 text-white p-4 rounded text-lg font-extrabold"
                  onClick={() => addToCart(p)}
                >
                  {p.name}
                  <div>{p.price.toLocaleString()} đ</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-extrabold mb-3">HÓA ĐƠN</h2>

            {cart.map(i => (
              <div key={i.id} className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-bold">{i.name}</div>
                  <div className="text-sm">{i.price.toLocaleString()} đ</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => changeQty(i.id, -1)}>-</button>
                  <strong>{i.qty}</strong>
                  <button onClick={() => changeQty(i.id, 1)}>+</button>
                </div>
              </div>
            ))}

            <hr className="my-2" />
            <div className="text-xl font-extrabold">
              TỔNG: {total.toLocaleString()} đ
            </div>

            <button
              className="w-full bg-blue-700 text-white p-3 mt-2 rounded font-bold"
              onClick={() => checkout("cash")}
            >
              THANH TOÁN TIỀN MẶT
            </button>
            <button
              className="w-full bg-purple-700 text-white p-3 mt-2 rounded font-bold"
              onClick={() => checkout("transfer")}
            >
              CHUYỂN KHOẢN
            </button>
          </div>
        </div>
      )}

      {/* ================= MENU ================= */}
      {view === "menu" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-extrabold mb-3">QUẢN LÝ MENU</h2>
          <button
            onClick={addProduct}
            className="bg-green-700 text-white px-4 py-2 rounded mb-3 font-bold"
          >
            + Thêm món
          </button>

          {products.map(p => (
            <div
              key={p.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <strong>{p.name}</strong> – {p.price.toLocaleString()} đ
                {!p.active && <span className="text-red-600"> (Tắt)</span>}
              </div>
              <div className="space-x-2">
                <button onClick={() => updateProduct(p.id)}>Sửa</button>
                <button
                  onClick={() =>
                    setProducts(products.map(x =>
                      x.id === p.id ? { ...x, active: !x.active } : x
                    ))
                  }
                >
                  {p.active ? "Tắt" : "Bật"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= REPORT ================= */}
      {view === "report" && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-extrabold mb-3">LỊCH SỬ ĐƠN</h2>
          {orders.map(o => (
            <div key={o.id} className="border-b py-2">
              <div className="font-bold">
                #{o.id} – {o.time}
              </div>
              <div>
                {o.total.toLocaleString()} đ – {o.payment}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
