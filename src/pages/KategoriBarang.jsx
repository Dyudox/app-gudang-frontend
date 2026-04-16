import { useEffect, useState, useCallback } from "react";
import axios from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function KategoriBarang() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // State Form
  const [formData, setFormData] = useState({
    nama_kategori: "",
    deskripsi: "",
  });

  // State Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // Default 5 baris
  const [pagination, setPagination] = useState({
    totalData: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const token = localStorage.getItem("token");

  // Fungsi Fetch Data
  const fetchKategori = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/kategori?search=${searchTerm}&page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setCategories(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, limit, token]);

  useEffect(() => {
    fetchKategori();
  }, [fetchKategori]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/kategori/${selectedId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else {
        await axios.post("http://localhost:5000/api/kategori", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ nama_kategori: "", deskripsi: "" });
      setIsEdit(false);
      fetchKategori();
      alert("Data berhasil disimpan!");
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menyimpan");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setSelectedId(item.id);
    setFormData({
      nama_kategori: item.nama_kategori,
      deskripsi: item.deskripsi,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/kategori/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKategori();
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menghapus");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 ml-0 lg:ml-72 transition-all duration-300">
        <div className="max-w-5xl mx-auto mt-16 lg:mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FORM CARD */}
            <Card className="md:col-span-1 shadow-md border-none h-fit">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus size={18} className="text-blue-600" />
                  {isEdit ? "Edit Kategori" : "Tambah Kategori"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-white">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">
                      Nama Kategori
                    </label>
                    <input
                      required
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.nama_kategori}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nama_kategori: e.target.value,
                        })
                      }
                      placeholder="Contoh: RF Electronics"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600">
                      Deskripsi
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                      placeholder="Penjelasan kategori..."
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={btnLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {btnLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : isEdit ? (
                        "Update"
                      ) : (
                        "Simpan"
                      )}
                    </Button>
                    {isEdit && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEdit(false);
                          setFormData({ nama_kategori: "", deskripsi: "" });
                        }}
                      >
                        Batal
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* TABLE CARD */}
            <div className="md:col-span-2 space-y-4">
              {/* TOP BAR: SEARCH */}
              <Card className="shadow-sm border-none">
                <CardContent className="p-3">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-2.5 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Cari kategori (Antenna, Modem...)"
                      className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="md:col-span-2 shadow-md border-none overflow-hidden">
                <CardHeader className="bg-white border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Tag size={20} />
                    </div>
                    <CardTitle className="text-lg">Kategori Barang</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
                        <tr>
                          <th className="px-6 py-4 font-semibold">
                            Nama Kategori
                          </th>
                          <th className="px-6 py-4 font-semibold">Deskripsi</th>
                          <th className="px-6 py-4 font-semibold text-center">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {loading ? (
                          <tr>
                            <td
                              colSpan="3"
                              className="py-10 text-center text-blue-600"
                            >
                              <Loader2 className="animate-spin mx-auto" />
                            </td>
                          </tr>
                        ) : categories.length === 0 ? (
                          <tr>
                            <td
                              colSpan="3"
                              className="py-10 text-center text-slate-400 italic"
                            >
                              Data tidak ditemukan.
                            </td>
                          </tr>
                        ) : (
                          categories.map((cat) => (
                            <tr
                              key={cat.id}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              <td className="px-6 py-4 font-medium text-slate-700">
                                {cat.nama_kategori}
                              </td>
                              <td className="px-6 py-4 text-slate-500 text-sm">
                                {cat.deskripsi || "-"}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => handleEdit(cat)}
                                    className="text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition-colors"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINATION & ROWS CONTROL */}
                  <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">
                        Tampilkan:
                      </span>
                      <select
                        className="text-xs border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 bg-white shadow-sm cursor-pointer"
                        value={limit}
                        onChange={(e) => {
                          setLimit(parseInt(e.target.value));
                          setPage(1);
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-xs text-slate-500 font-medium">
                        data
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <span className="text-xs text-slate-500 font-medium">
                        Total: {pagination.totalData} data
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white"
                          disabled={page === 1}
                          onClick={() => setPage(page - 1)}
                        >
                          <ChevronLeft size={16} />
                        </Button>
                        <div className="flex items-center px-3 text-xs font-bold bg-white border rounded-md h-8">
                          {page} / {pagination.totalPages || 1}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white"
                          disabled={page >= pagination.totalPages}
                          onClick={() => setPage(page + 1)}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
