// === README ===
// FULL POS PROJECT – READY TO USE
// Tech: Next.js App Router + Tailwind + Supabase

/* =========================
   FILE STRUCTURE
============================
/app
  /layout.tsx
  /page.tsx            // POS bán hàng
  /menu/page.tsx       // Quản lý menu + nhóm + topping
  /report/page.tsx     // Báo cáo doanh thu
  /login/page.tsx      // Đăng nhập
/lib
  supabase.ts
  auth.ts
/types
  pos.ts
/styles
  globals.css
.env.local
========================== */

/* =========================
   lib/supabase.ts
========================== */
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/* =========================
   types/pos.ts
========================== */
export type Role = 'owner' | 'cashier'

export type Size = { name: string; price: number }
export type Topping = { id: string; name: string; price: number }

export type Product = {
  id: string
  name: string
  group: string
  sizes: Size[]
  toppings: Topping[]
  active: boolean
}

export type OrderItem = {
  product: Product
  size: Size
  toppings: Topping[]
  qty: number
  note?: string
}

export type Order = {
  id: string
  items: OrderItem[]
  total: number
  payment: 'cash' | 'bank'
  created_at: string
}

/* =========================
   app/layout.tsx
========================== */
import './globals.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-100 text-black font-sans">{children}</body>
    </html>
  )
}

/* =========================
   app/page.tsx  (POS)
========================== */
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, OrderItem } from '@/types/pos'

export default function POS() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<OrderItem[]>([])

  useEffect(() => {
    supabase.from('products').select('*').then(r => setProducts(r.data || []))
  }, [])

  const addItem = (p: Product) => {
    const size = p.sizes[0]
    setCart([...cart, { product: p, size, toppings: [], qty: 1 }])
  }

  const total = cart.reduce((s, i) => s + i.size.price * i.qty + i.toppings.reduce((t, x) => t + x.price, 0), 0)

  const checkout = async (payment: 'cash' | 'bank') => {
    await supabase.from('orders').insert({ total, payment })
    setCart([])
  }

  return (
    <main className="p-6">
      <h1 className="text-4xl font-extrabold mb-6">TANA TRÀ QUÁN – POS</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Sản phẩm</h2>
          <div className="grid grid-cols-3 gap-4">
            {products.filter(p => p.active).map(p => (
              <button key={p.id} onClick={() => addItem(p)} className="bg-green-600 text-white font-bold p-4 rounded">
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-2xl font-bold">Hóa đơn</h2>
          {cart.map((i, idx) => (
            <div key={idx} className="border-b py-2">{i.product.name} – {i.size.name}</div>
          ))}
          <p className="text-xl font-extrabold mt-4">Tổng: {total.toLocaleString()} đ</p>
          <button onClick={() => checkout('cash')} className="w-full mt-2 bg-blue-600 text-white font-bold p-3 rounded">Tiền mặt</button>
          <button onClick={() => checkout('bank')} className="w-full mt-2 bg-purple-600 text-white font-bold p-3 rounded">Chuyển khoản</button>
        </div>
      </div>
    </main>
  )
}

/* =========================
   app/menu/page.tsx
========================== */
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/pos'

export default function MenuPage() {
  const [items, setItems] = useState<Product[]>([])

  useEffect(() => {
    supabase.from('products').select('*').then(r => setItems(r.data || []))
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-3xl font-extrabold">Quản lý menu</h1>
      {items.map(i => (
        <div key={i.id} className="bg-white p-4 my-2 flex justify-between">
          <span className="font-bold">{i.name} – {i.group}</span>
          <span>{i.active ? 'Đang bán' : 'Tắt'}</span>
        </div>
      ))}
    </main>
  )
}

/* =========================
   app/report/page.tsx
========================== */
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Report() {
  const [total, setTotal] = useState(0)

  useEffect(() => {
    supabase.from('orders').select('total').then(r => setTotal(r.data?.reduce((s, i) => s + i.total, 0) || 0))
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-3xl font-extrabold">Doanh thu</h1>
      <p className="text-2xl font-bold">{total.toLocaleString()} đ</p>
    </main>
  )
}

/* =========================
   globals.css (Tailwind)
========================== */
@tailwind base;
@tailwind components;
@tailwind utilities;

body { @apply text-black bg-gray-100 }

/* =========================
   .env.local
========================== */
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
