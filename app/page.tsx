export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        TANA TRÀ QUÁN – MÀN HÌNH BÁN HÀNG
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Danh sách sản phẩm */}
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm</h2>

          <div className="grid grid-cols-3 gap-4">
            <button className="bg-green-500 text-white p-3 rounded">
              Trà sữa truyền thống
            </button>
            <button className="bg-green-500 text-white p-3 rounded">
              Trà sữa thái xanh
            </button>
            <button className="bg-green-500 text-white p-3 rounded">
              Trà đào
            </button>
          </div>
        </div>

        {/* Hóa đơn */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Hóa đơn</h2>

          <p>Chưa có sản phẩm</p>

          <div className="mt-4 border-t pt-4">
            <p className="text-lg font-bold">Tổng tiền: 0₫</p>

            <button className="mt-4 w-full bg-blue-600 text-white p-3 rounded">
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
