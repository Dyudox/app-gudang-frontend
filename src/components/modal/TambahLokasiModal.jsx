import { useState, useEffect } from "react";
import axios from "../../api/axiosConfig";
import Select from "react-select";
import { Button } from "@/components/ui/button";

export default function TambahLokasiModal({
  barangId,
  namaBarang,
  onClose,
  onRefresh,
}) {
  const [data, setData] = useState({
    gudang_id: "",
    rak_id: "",
    stok_lokasi: 0,
  });
  const [gudangList, setGudangList] = useState([]);
  const [rakList, setRakList] = useState([]);

  useEffect(() => {
    const fetchGudang = async () => {
      try {
        const token = localStorage.getItem("token");
        const gRes = await axios.get(
          "http://localhost:5000/api/barang/gudang",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setGudangList(gRes.data);
      } catch (err) {
        console.error("Gagal ambil gudang:", err);
      }
    };
    fetchGudang();
  }, []);

  const handleGudangChange = async (gudangId) => {
    try {
      const token = localStorage.getItem("token");
      const rRes = await axios.get(
        `http://localhost:5000/api/barang/rak/by-gudang/${gudangId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRakList(rRes.data);
      // Reset rak_id saat gudang berubah
      setData({ ...data, gudang_id: gudangId, rak_id: "" });
    } catch (err) {
      console.error("Gagal ambil rak:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/barang/tambah-lokasi", {
        barang_id: barangId,
        gudang_id: data.gudang_id,
        rak_id: data.rak_id,
        // Pastikan stok_lokasi dikirim sebagai angka (integer)
        stok_lokasi: parseInt(data.stok_lokasi, 10),
      });
      alert("Lokasi/Stok berhasil ditambahkan!");
      onRefresh();
      onClose();
    } catch (err) {
      alert("Gagal: " + (err.response?.data?.error || "Terjadi kesalahan"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">Tambah Lokasi: {namaBarang}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            options={gudangList.map((g) => ({
              value: g.id,
              label: g.nama_gudang,
            }))}
            onChange={(val) => handleGudangChange(val.value)}
            placeholder="Pilih Gudang"
            isRequired
          />

          <Select
            options={rakList.map((r) => ({ value: r.id, label: r.nama_rak }))}
            onChange={(val) => setData({ ...data, rak_id: val.value })}
            placeholder="Pilih Rak"
            isDisabled={!data.gudang_id} // Disable jika gudang belum dipilih
            isRequired
          />

          <input
            type="number"
            placeholder="Jumlah Stok"
            className="w-full border p-2 rounded"
            min="0"
            required
            onChange={(e) => setData({ ...data, stok_lokasi: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
