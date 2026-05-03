import React, { useState, useEffect } from "react";
import Select from "react-select";
import api from "../../../api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Save } from "lucide-react";

export default function FormInputMutasi({ isOpen, onClose, onRefresh }) {
  // Tambahkan state gudangList
  const [gudangList, setGudangList] = useState([]);
  const [rakAsalList, setRakAsalList] = useState([]); // Daftar rak untuk asal
  const [barangList, setBarangList] = useState([]);

  const [formData, setFormData] = useState({
    barang_id: "",
    gudang_asal: "",
    rak_asal: "",
    gudang_tujuan: "",
    rak_tujuan: "",
    jumlah: "",
    keterangan: "",
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          // Gunakan Promise.all untuk mengambil data utama
          const [resBarang, resGudang] = await Promise.all([
            api.get("/barang"),
            api.get("/barang/gudang"),
          ]);

          // console.log("Data Barang:", resBarang.data);
          // console.log("Data Gudang:", resGudang.data);

          setBarangList(resBarang.data || []);
          setGudangList(resGudang.data || []);
        } catch (err) {
          console.error("Gagal ambil data:", err);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const loadRak = async (gudangId, setRakFunction) => {
    try {
      const res = await api.get(`/barang/rak/by-gudang/${gudangId}`);

      // console.log("Data Rak:", res.data);

      setRakFunction(res.data);
    } catch (err) {
      console.error("Gagal load rak:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/mutasi", formData);
      alert("Mutasi berhasil dicatat!");
      onRefresh();
      onClose();
    } catch (err) {
      alert("Gagal simpan: " + (err.response?.data?.message || err.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto p-2 sm:p-4">
      <Card className="w-full max-w-lg shadow-2xl border-none my-4 sm:my-0">
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold">Input Mutasi Baru</h3>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-red-500"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Barang */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pilih Barang
              </label>
              <Select
                options={barangList.map((b) => ({
                  value: b.id,
                  label: b.nama_barang,
                }))}
                onChange={(selected) =>
                  setFormData({ ...formData, barang_id: selected.value })
                }
                placeholder="Cari nama barang..."
                isSearchable
              />
            </div>

            {/* Asal */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Asal (Gudang - Rak)
              </label>
              <Select
                options={gudangList.map((g) => ({
                  value: g.id,
                  label: g.nama_gudang,
                }))}
                onChange={(selected) => {
                  // Simpan ID langsung ke formData
                  setFormData({
                    ...formData,
                    gudang_asal: selected.value,
                    rak_asal: "",
                  });
                  loadRak(selected.value, setRakAsalList);
                }}
                placeholder="Pilih Gudang Asal..."
              />
            </div>

            {/* Tujuan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tujuan (Gudang - Rak)
              </label>
              <Select
                options={rakAsalList.map((r) => ({
                  value: r.id,
                  label: r.nama_rak,
                }))}
                onChange={(selected) =>
                  setFormData({ ...formData, rak_asal: selected.value })
                }
                placeholder="Pilih Rak Asal..."
              />
            </div>

            {/* Jumlah */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Jumlah *
              </label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.jumlah}
                onChange={(e) =>
                  setFormData({ ...formData, jumlah: e.target.value })
                }
                required
              />
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Keterangan
              </label>
              <textarea
                className="w-full p-3 border rounded-lg text-base focus:ring-2 focus:ring-blue-500 outline-none"
                rows="2"
                value={formData.keterangan}
                onChange={(e) =>
                  setFormData({ ...formData, keterangan: e.target.value })
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 mt-2 sm:mt-4 text-base"
            >
              <Save className="mr-2" size={20} /> Simpan Mutasi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
