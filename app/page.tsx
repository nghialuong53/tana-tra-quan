"use client";

import { useState } from "react";

/* ================== KIỂU DỮ LIỆU ================== */
type Size = "S" | "M" | "L";

type Topping = {
  name: string;
  price: number;
};

type MenuItem = {
  id: number;
  name: string;
  prices: Record<Size, number>;
  toppings: Topping[];
  active: boolean;
};

type OrderItem = {
  id: number;
  name: string;
  size: Size;
  price: number;
  toppings: Topping[];
  note: string;
};

type OrderHistory = {
  id: number;
  time: string;
  total: number;
};

/* ================== MENU MẪU ================== */
const INITIAL_MENU: MenuItem[] = [
  {
    id: 1,
    name: "Trà sữa truyền thống",
    prices: { S: 25000, M: 30000, L: 35000 },
    toppings: [
      { name: "Trân châu", price: 5000 },
      { name: "Pudding", price: 7000 },
    ],
    active: true,
  },
  {
    id: 2,
    name: "Trà đào",
    prices: { S: 30000, M: 35000, L: 40000 },
    toppings: [
      { name: "Đào miếng", price: 7000 },
      { name: "Nha đam", price: 6000 },
    ],
    active: true,
  },
];

/* ================== APP ================== */
export default function POS() {
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [size, setSize] = useState<Size>("M");
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [note, setNote] = useState("");

  /* ================== LOGIC ================== */
  const addToCart = () => {
    if (!selectedItem) return;

    const basePrice = selectedItem.prices[size];
    const toppingPrice = selectedToppings.reduce((s, t) => s + t.price, 0);

    setCart([
      ...cart,
      {
        id: Date.now(),
        name: selectedItem.name,
        size,
        price: basePrice + toppingPrice,
        toppings: selectedToppings,
        note,
      },
    ]);

    setSelectedItem(null);
    setSelectedToppings([]);
    setNote("");
  };

  const removeItem = (id: number) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const total = cart.reduce((s, i) => s + i.price, 0);

  const checkout = (method: "Tiền mặt" | "Chuyển khoản") => {
    if (cart.length === 0) return;

    setOrders([
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        total,
      },
      ...orders,
    ]);

    setCart([]);

    /* in bill an toàn */
    if (typeof window !== "undefined") {
      setTimeout(() => {
        try {
          window.print();
        } catch {}
      }, 300);
    }
  };

  /* ================== UI ================== */
  return (
    <main className="min-h-screen bg-gray-100 p-6 text-gray-900 font-semibold">
      <h1 className="text-4xl font-extrabold mb-6">
        🧋 TANA TRÀ QUÁN – POS
      </h1>

      {/* ===== BÁN HÀNG ===== */}
      <div className="grid grid-cols-3 gap-6">
        {/* MENU */}
        <div className="col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Sản phẩm</h2>
          <div className="grid grid-cols-2 gap-4">
            {menu
              .filter((m) => m.active)
              .map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedItem(m);
                    setSize("M");
                    setSelectedToppings([]);
                  }}
                  className="bg-green-600 text-white p-4 rounded text-lg font-bold"
                >
                  {m.name}
                  <div className="text-sm font-normal">
                    M: {m.prices.M.toLocaleString()} đ
                  </div>
                </button>
              ))}
          </div>

          {/* CHỌN SIZE + TOPPING */}
          {selectedItem && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-xl font-bold mb-2">
                {selectedItem.name}
              </h3>

              <div className="flex gap-2 mb-2">
                {(["S", "M", "L"] as Size[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded ${
                      size === s
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mb-2">
                {selectedItem.toppings.map((t) => (
                  <label key={t.name} className="block">
                    <input
                      type="checkbox"
                      checked={selectedToppings.some(
                        (x) => x.name === t.name
                      )}
                      onChange={(e) =>
                        setSelectedToppings(
                          e.target.checked
                            ? [...selectedToppings, t]
                            : selectedToppings.filter(
                                (x) => x.name !== t.name
                              )
                        )
                      }
                    />{" "}
                    {t.name} (+{t.price.toLocaleString()} đ)
                  </label>
                ))}
              </div>

              <textarea
                className="w-full border p-2 rounded mb-2"
                placeholder="Ghi chú"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <button
                onClick={addToCart}
                className="bg-blue-700 text-white px-6 py-2 rounded font-bold"
              >
                Thêm món
              </button>
            </div>
          )}
        </div>

        {/* HÓA ĐƠN */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Hóa đơn</h2>

          {cart.length === 0 && (
            <p className="text-gray-500">Chưa có sản phẩm</p>
          )}

          {cart.map((i) => (
            <div
              key={i.id}
              className="flex justify-between items-center mb-2"
            >
              <div>
                <div>{i.name} ({i.size})</div>
                <div className="text-sm text-gray-600">
                  {i.toppings.map((t) => t.name).join(", ")}
                </div>
              </div>
              <div className="flex gap-2">
                <span>{i.price.toLocaleString()} đ</span>
                <button
                  onClick={() => removeItem(i.id)}
                  className="text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="border-t mt-4 pt-4 text-xl">
            Tổng: {total.toLocaleString()} đ
          </div>

          <button
            onClick={() => checkout("Tiền mặt")}
            className="w-full mt-3 bg-blue-600 text-white py-3 rounded text-lg"
          >
            Thanh toán tiền mặt
          </button>

          <button
            onClick={() => checkout("Chuyển khoản")}
            className="w-full mt-2 bg-purple-600 text-white py-3 rounded text-lg"
          >
            Chuyển khoản
          </button>
        </div>
      </div>

      {/* ===== DOANH THU ===== */}
      <div className="mt-8 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">📊 Lịch sử đơn</h2>

        {orders.length === 0 && (
          <p className="text-gray-500">Chưa có đơn</p>
        )}

        {orders.map((o) => (
          <div
            key={o.id}
            className="flex justify-between border-b py-2"
          >
            <span>{o.time}</span>
            <strong>{o.total.toLocaleString()} đ</strong>
          </div>
        ))}

        <div className="mt-4 text-xl font-bold">
          Doanh thu:{" "}
          {orders
            .reduce((s, o) => s + o.total, 0)
            .toLocaleString()}{" "}
          đ
        </div>
      </div>
    </main>
  );
}
