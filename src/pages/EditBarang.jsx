import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Save, Edit3 } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function EditBarang() {
  const { id } = useParams(); // Ambil ID dari URL
  // console.log("ID yang terbaca dari URL:", id); // Muncul angka 1 atau undefined?

  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    serial_number: "",
    nama_barang: "",
    merk: "",
    kategori_id: "",
    keterangan: "",
  });

  const [gudangList, setGudangList] = useState([]);
  const [rakList, setRakList] = useState([]);

  // 1. Fungsi reusable untuk mengambil rak berdasarkan gudang
  const fetchRakByGudang = async (gudangId) => {
    if (!gudangId) {
      setRakList([]);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/barang/rak/by-gudang/${gudangId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRakList(res.data);
    } catch (err) {
      console.error("Gagal load rak:", err);
      setRakList([]);
    }
  };

  // 3. Efek untuk memuat data awal (Edit)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Ambil semua data master dan data barang sekaligus
        const [resGroups, resGudang, resBarang] = await Promise.all([
          axios.get("http://localhost:5000/api/barang/groups", { headers }),
          axios.get("http://localhost:5000/api/barang/gudang", { headers }),
          axios.get(`http://localhost:5000/api/barang/${id}`, { headers }),
        ]);

        setGroups(resGroups.data);
        setGudangList(resGudang.data);

        if (resBarang.data) {
          setFormData({
            ...resBarang.data,
            lokasi_gudang: resBarang.data.lokasi_gudang || "",
            lokasi_rak: resBarang.data.lokasi_rak || "",
          });

          // Panggil fungsi untuk mengisi daftar rak berdasarkan gudang yang terpilih
          if (resBarang.data.lokasi_gudang) {
            await fetchRakByGudang(resBarang.data.lokasi_gudang);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        alert("Data tidak ditemukan!");
        navigate("/barang");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/barang/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Data berhasil diperbarui!");
      navigate("/barang");
    } catch (err) {
      alert("Gagal memperbarui: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

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
              <span className="font-medium">Batal & Kembali</span>
            </Link>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Edit3 size={24} />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  Edit Data Barang
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Serial Number (SN)
                    </label>
                    <input
                      name="serial_number"
                      value={formData.serial_number || ""}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Nama Barang *
                    </label>
                    <input
                      name="nama_barang"
                      required
                      value={formData.nama_barang || ""}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Merk
                    </label>
                    <input
                      name="merk"
                      value={formData.merk || ""}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Kategori *
                    </label>
                    <select
                      name="kategori_id"
                      required
                      value={formData.kategori_id || ""}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleChange}
                    >
                      <option value="">Pilih Kategori</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Keterangan
                  </label>
                  <textarea
                    name="keterangan"
                    rows="3"
                    value={formData.keterangan || ""}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg font-bold shadow-md gap-2 transition-all"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}
                  Simpan Perubahan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
