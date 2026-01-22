'use client'
import { useState } from 'react'

type Product = {
  id: number
  name: string
  price: number
}

type CartItem = Product & { qty: number }

type Order = {
  id: number
  time: string
  total: number
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Trà sữa truyền thống', price: 25000 },
  { id: 2, name: 'Trà sữa thái xanh', price: 27000 },
  { id: 3, name: 'Trà đào', price: 30000 },
]

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // ➕ thêm món
  const addItem = (p: Product) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === p.id)
      if (found) {
        return prev.map((i) =>
          i.id === p.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...p, qty: 1 }]
    })
  }

  // ➖ / ➕ số lượng
  const changeQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0)
    )
  }

  // 💰 tổng tiền
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  // 🧾 thanh toán
  const checkout = () => {
    if (cart.length === 0) return
    const newOrder: Order = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      total,
    }
    setOrders([newOrder, ...orders])
    setCart([])
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        🧋 TANA TRÀ QUÁN – MÀN HÌNH BÁN HÀNG
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* SẢN PHẨM */}
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>

          <div className="grid grid-cols-3 gap-4">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => addItem(p)}
                className="bg-green-500 text-white p-4 rounded text-center hover:bg-green-600"
              >
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm">
                  {p.price.toLocaleString()} đ
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* HÓA ĐƠN */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Hóa đơn</h2>

          {cart.length === 0 && (
            <p className="text-gray-400">Chưa có sản phẩm</p>
          )}

          {cart.map((i) => (
            <div
              key={i.id}
              className="flex justify-between items-center mb-2"
            >
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-gray-500">
                  {i.price.toLocaleString()} đ
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQty(i.id, -1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  −
                </button>
                <span>{i.qty}</span>
                <button
                  onClick={() => changeQty(i.id, 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="border-t mt-4 pt-4">
            <div className="text-lg font-bold">
              Tổng tiền: {total.toLocaleString()} đ
            </div>
            <button
              onClick={checkout}
              className="mt-4 w-full bg-blue-600 text-white p-3 rounded text-lg hover:bg-blue-700"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* DOANH THU */}
      <div className="mt-10 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">
          📊 Lịch sử đơn hàng
        </h2>

        {orders.length === 0 && (
          <p className="text-gray-400">Chưa có đơn nào</p>
        )}

        {orders.map((o) => (
          <div
            key={o.id}
            className="flex justify-between border-b py-2 text-sm"
          >
            <span>{o.time}</span>
            <strong>{o.total.toLocaleString()} đ</strong>
          </div>
        ))}

        {orders.length > 0 && (
          <div className="text-right font-bold mt-4">
            Doanh thu:{' '}
            {orders
              .reduce((s, o) => s + o.total, 0)
              .toLocaleString()}{' '}
            đ
          </div>
        )}
      </div>
    </main>
  )
}
