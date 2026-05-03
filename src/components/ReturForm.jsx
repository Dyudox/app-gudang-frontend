import React, { useState } from "react";

export default function ReturForm({ transaksi, onClose, onSubmit }) {
  const [item, setItem] = useState({
    barang_id: transaksi.barang_id,
    nama_barang: transaksi.nama_barang,
    jumlah_maks: transaksi.jumlah,
    jumlah: "",
    kondisi: "BAIK",
    catatan: "", // <-- Tambahan state untuk catatan
  });

  const handleUpdate = (field, value) => {
    setItem({ ...item, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg sm:p-6 p-4">
        <h2 className="text-xl font-bold mb-4">Proses Retur Barang</h2>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-slate-50">
            <p className="font-bold text-lg">{item.nama_barang}</p>
            <p className="text-sm text-slate-500">
              Maksimal Retur: {item.jumlah_maks}
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Jumlah Retur</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="0"
              max={item.jumlah_maks}
              value={item.jumlah} // Sekarang value akan mengikuti string kosong atau angka
              onChange={(e) => {
                const val = e.target.value;

                // Jika user menghapus semua, val akan jadi ""
                if (val === "") {
                  handleUpdate("jumlah", "");
                } else {
                  // Pastikan angka yang dimasukkan tidak melebihi jumlah_maks
                  const numVal = Math.min(Number(val), item.jumlah_maks);
                  handleUpdate("jumlah", numVal);
                }
              }}
            />
            {/* <input
              type="number"
              className="w-full p-2 border rounded"
              max={item.jumlah_maks}
              // Gunakan '' jika nilainya 0 agar bisa dihapus
              value={item.jumlah === 0 ? "" : item.jumlah}
              onChange={(e) => {
                const val = e.target.value;

                // Jika input dikosongkan (user menekan backspace sampai habis)
                if (val === "") {
                  handleUpdate("jumlah", 0);
                } else {
                  // Pastikan tidak melebihi jumlah_maks
                  const numVal = Math.min(Number(val), item.jumlah_maks);
                  handleUpdate("jumlah", numVal);
                }
              }}
            /> */}
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Kondisi</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => handleUpdate("kondisi", e.target.value)}
            >
              <option value="BAIK">Kondisi Baik</option>
              <option value="RUSAK">Kondisi Rusak</option>
            </select>
          </div>

          {/* Kolom Catatan Baru */}
          <div>
            <label className="block text-sm font-bold mb-1">
              Catatan Kondisi
            </label>
            <textarea
              className="w-full p-2 border rounded h-20 resize-none"
              placeholder="Jelaskan detail kerusakan atau alasan retur..."
              value={item.catatan}
              onChange={(e) => handleUpdate("catatan", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-500">
            Batal
          </button>
          <button
            onClick={() => onSubmit({ ...item, transaksi_id: transaksi.id })} // Tambahkan ini
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Konfirmasi Retur
          </button>

          {/* Tombol Konfirmasi Retur disabled jika jumlah <= 0 */}
          {/* <button
            disabled={item.jumlah <= 0 || item.jumlah > item.jumlah_maks}
            onClick={() => onSubmit({ ...item, transaksi_id: transaksi.id })} // Tambahkan ini
            className={`px-4 py-2 rounded-lg text-white ${
              item.jumlah <= 0 || item.jumlah > item.jumlah_maks
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {item.jumlah <= 0 ? "Masukkan Jumlah" : "Konfirmasi Retur"}
          </button> */}
        </div>
      </div>
    </div>
  );
}
