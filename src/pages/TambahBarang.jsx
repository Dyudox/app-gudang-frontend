import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Save, PackagePlus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function TambahBarang() {
  const navigate = useNavigate();
  const [kategoriList, setKategoriList] = useState([]);
  const [gudangList, setGudangList] = useState([]);
  const [rakList, setRakList] = useState([]);

  const [loading, setLoading] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    serial_number: "",
    nama_barang: "",
    merk: "",
    kategori_id: "",
    stok: 0,
    lokasi_gudang: "",
    lokasi_rak: "",
    keterangan: "",
    barcode: "",
  });

  // Ambil data kategori untuk dropdown
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token tidak ada, user belum login!");
      return; // Berhenti jika tidak ada token
    }
    //const headers = { Authorization: `Bearer ${token}` };

    // 1. Fetch Kategori
    const fetchKategori = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/kategori", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setKategoriList(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    // 2. Fetch Gudang
    const fetchGudang = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/barang/gudang", {
          headers: { Authorization: `Bearer ${token}` },
        });

        //console.log("Data Gudang dari API:", res.data); // <--- CEK INI DI BROWSER CONSOLE

        setGudangList(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchKategori();
    fetchGudang();
  }, []);

  // 3. Tambahkan fungsi untuk Fetch Rak saat Gudang dipilih
  const handleGudangChange = async (gudangId) => {
    if (!gudangId) {
      setRakList([]);
      return;
    }
    // const gudangId = e.target.value;
    // setFormData({ ...formData, lokasi_gudang: gudangId, lokasi_rak: "" }); // Reset rak saat gudang ganti

    if (gudangId) {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/barang/rak/by-gudang/${gudangId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRakList(res.data);
    } else {
      setRakList([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cek apakah field yang diubah adalah 'serial_number'
    if (name === "serial_number") {
      setFormData({
        ...formData,
        serial_number: value,
        barcode: value, // Otomatis samakan barcode dengan serial_number
      });
    } else {
      // Untuk field lainnya, gunakan cara biasa
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      console.log("Data yang dikirim:", formData);

      await axios.post("http://localhost:5000/api/barang", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Barang berhasil ditambahkan!");
      navigate("/barang"); // Kembali ke daftar barang
    } catch (err) {
      // Debug: Lihat struktur error lengkap di console
      console.error("Error penuh:", err);

      alert("Gagal menambah barang: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Mapping data ke format react-select
  const kategoriOptions = kategoriList.map((g) => ({
    value: g.id,
    label: g.nama_kategori,
  }));

  const gudangOptions = gudangList.map((g) => ({
    value: g.id,
    label: g.nama_gudang,
  }));

  const rakOptions = rakList.map((r) => ({
    value: r.id,
    label: r.nama_rak,
  }));

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-3xl mx-auto mt-16 lg:mt-0">
          <div className="mb-6">
            <Link
              to="/barang"
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Kembali ke Daftar</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <PackagePlus size={24} />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Tambah Unit Barang Baru
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="p-6 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Serial Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Serial Number (SN)
                      </label>
                      <input
                        name="serial_number"
                        placeholder="Contoh: SN123456"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={handleChange}
                      />
                    </div>

                    {/* Nama Barang */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Nama Barang *
                      </label>
                      <input
                        name="nama_barang"
                        required
                        placeholder="Nama unit/part"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={handleChange}
                      />
                    </div>

                    {/* Merk */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Merk
                      </label>
                      <input
                        name="merk"
                        placeholder="Contoh: Cisco, Ubiquiti"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={handleChange}
                      />
                    </div>

                    {/* Kategori */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Kategori *
                      </label>
                      <Select
                        options={kategoriOptions}
                        required
                        value={
                          kategoriOptions.find(
                            (o) => o.value == formData.kategori_id,
                          ) || null
                        }
                        onChange={(val) =>
                          setFormData({
                            ...formData,
                            kategori_id: val?.value || "",
                          })
                        }
                        placeholder="Pilih Kategori"
                        isClearable
                      />
                      {/* <select
                        name="kategori_id"
                        required
                        //className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        onChange={handleChange}
                      >
                        <option value="">Pilih Kategori</option>
                        {kategoriList.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.nama_kategori}
                          </option>
                        ))}
                      </select> */}
                    </div>

                    {/* Lokasi gudang */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Lokasi Gudang
                      </label>
                      <Select
                        options={gudangOptions}
                        value={
                          gudangOptions.find(
                            (o) => o.value == formData.lokasi_gudang,
                          ) || null
                        }
                        onChange={(val) => {
                          setFormData({
                            ...formData,
                            lokasi_gudang: val?.value || "",
                            lokasi_rak: "",
                          });
                          if (val) handleGudangChange(val.value); // Trigger load rak
                        }}
                        placeholder="Pilih Gudang"
                        isClearable
                      />
                      {/* <select
                        name="lokasi_gudang"
                        value={formData.lokasi_gudang}
                        onChange={handleGudangChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      >
                        <option value="">Pilih Gudang</option>
                        {gudangList.map((g) => {
                          // Console log ini akan muncul 10 kali di konsol browser kamu (sesuai jumlah data)
                          // console.log("Item gudang yang diproses:", g);

                          return (
                            <option key={g.id} value={g.id}>
                              {g.nama_gudang}
                            </option>
                          );
                        })}
                      </select> */}
                    </div>

                    {/* Lokasi Rak */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Lokasi Rak *
                      </label>
                      <Select
                        options={rakOptions}
                        required
                        value={
                          rakOptions.find(
                            (option) => option.value == formData.lokasi_rak,
                          ) || null
                        }
                        onChange={(selectedOption) => {
                          // React-select mengembalikan object, bukan event
                          setFormData({
                            ...formData,
                            lokasi_rak: selectedOption
                              ? selectedOption.value
                              : "",
                          });
                        }}
                        placeholder="Pilih Rak"
                        isClearable
                      />
                      {/* <select
                        name="lokasi_rak"
                        value={formData.lokasi_rak}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        disabled={!formData.lokasi_gudang}
                      >
                        <option value="">Pilih Rak</option>
                        {rakList.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.nama_rak}
                          </option>
                        ))}
                      </select> */}
                    </div>
                  </div>

                  {/* Stok */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Stok Awal
                    </label>
                    <input
                      type="number"
                      name="stok"
                      placeholder="0"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Keterangan */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Keterangan Tambahan
                    </label>
                    <textarea
                      name="keterangan"
                      rows="3"
                      placeholder="Catatan mengenai kondisi barang atau spesifikasi..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-md gap-2"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Save size={20} />
                      )}
                      Simpan Barang ke Gudang
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
