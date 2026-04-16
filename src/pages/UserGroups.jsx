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
import { Loader2, Plus, Edit2, Trash2, Users, Search } from "lucide-react";

// Import Komponen Pagination Shadcn
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function UserGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 2,
    totalData: 0,
  });

  const [formData, setFormData] = useState({
    group_name: "",
    description: "",
  });

  // --- LOGIKA INTERCEPTOR (Bisa ditaruh di sini jika tidak mau buat file terpisah) ---
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);
  // --------------------------------------------------------------------------------

  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/user-groups`, {
        params: {
          search: search,
          page: pagination.currentPage,
          limit: pagination.limit,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(res.data.data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: res.data.pagination.totalPages,
        totalData: res.data.pagination.totalData,
      }));
    } catch (err) {
      console.error("Gagal fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [search, pagination.currentPage, pagination.limit]);

  const handleLimitChange = (e) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(e.target.value),
      currentPage: 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const payload = {
      nama_group_user: formData.group_name,
      deskripsi: formData.description,
    };

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/user-groups/${selectedId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.post("http://localhost:5000/api/user-groups", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ group_name: "", description: "" });
      setIsEdit(false);
      fetchGroups();
      alert("Berhasil menyimpan data!");
    } catch (err) {
      alert(err.response?.data?.error || "Gagal menyimpan data");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleEdit = (group) => {
    setIsEdit(true);
    setSelectedId(group.id);
    setFormData({
      group_name: group.nama_group_user,
      description: group.deskripsi,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus group ini?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/user-groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGroups();
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
            {/* FORM INPUT */}
            <Card className="md:col-span-1 shadow-md border-none h-fit text-slate-800">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus size={18} className="text-blue-600" />
                  {isEdit ? "Edit Group" : "Tambah Group"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-white">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Nama Group</label>
                    <input
                      required
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.group_name}
                      onChange={(e) =>
                        setFormData({ ...formData, group_name: e.target.value })
                      }
                      placeholder="Contoh: Admin"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Deskripsi</label>
                    <textarea
                      className="w-full px-3 py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Keterangan hak akses..."
                    />
                  </div>
                  <div className="flex gap-2">
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
                          setFormData({ group_name: "", description: "" });
                        }}
                      >
                        Batal
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* TABEL DATA */}
            <div className="md:col-span-2 space-y-4">
              <Card className="shadow-sm border-none">
                <CardContent className="p-3">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-2.5 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Cari nama group, deskripsi..."
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPagination((prev) => ({ ...prev, currentPage: 1 }));
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-none overflow-hidden">
                <CardHeader className="bg-white border-b">
                  <div className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Users size={20} />
                    </div>
                    <CardTitle className="text-lg">Daftar User Group</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-bold">
                        <tr>
                          <th className="px-6 py-4">Nama Group</th>
                          <th className="px-6 py-4">Deskripsi</th>
                          <th className="px-6 py-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {loading ? (
                          <tr>
                            <td
                              colSpan="3"
                              className="py-10 text-center text-slate-400"
                            >
                              <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" />
                              Memuat data...
                            </td>
                          </tr>
                        ) : groups.length === 0 ? (
                          <tr>
                            <td
                              colSpan="3"
                              className="py-10 text-center text-slate-400"
                            >
                              Belum ada data.
                            </td>
                          </tr>
                        ) : (
                          groups.map((group) => (
                            <tr
                              key={group.id}
                              className="hover:bg-blue-50/30 transition-colors group"
                            >
                              <td className="px-6 py-4 font-medium text-slate-700 group-hover:text-blue-600">
                                {group.nama_group_user}
                              </td>
                              <td className="px-6 py-4 text-slate-500 text-sm">
                                {group.deskripsi || "-"}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => handleEdit(group)}
                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors shadow-sm bg-white border border-slate-100"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(group.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors shadow-sm bg-white border border-slate-100"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* FOOTER: PAGINATION & LIMIT (SHADCN VERSION) */}
                  <div className="p-4 border-t bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 order-2 md:order-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                          Tampilkan:
                        </span>
                        <select
                          value={pagination.limit}
                          onChange={handleLimitChange}
                          className="text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500 bg-white shadow-sm cursor-pointer hover:border-blue-300 transition-all"
                        >
                          <option value="2">2</option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Total: {pagination.totalData} Data
                      </p>
                    </div>

                    <div className="order-1 md:order-2">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (pagination.currentPage > 1) {
                                  setPagination((prev) => ({
                                    ...prev,
                                    currentPage: prev.currentPage - 1,
                                  }));
                                }
                              }}
                              className={
                                pagination.currentPage === 1
                                  ? "pointer-events-none opacity-40"
                                  : "cursor-pointer hover:bg-white"
                              }
                            />
                          </PaginationItem>

                          <PaginationItem>
                            <PaginationLink className="bg-white border-slate-200 pointer-events-none">
                              {pagination.currentPage}{" "}
                              <span className="mx-1 text-slate-400">/</span>{" "}
                              {pagination.totalPages}
                            </PaginationLink>
                          </PaginationItem>

                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (
                                  pagination.currentPage < pagination.totalPages
                                ) {
                                  setPagination((prev) => ({
                                    ...prev,
                                    currentPage: prev.currentPage + 1,
                                  }));
                                }
                              }}
                              className={
                                pagination.currentPage === pagination.totalPages
                                  ? "pointer-events-none opacity-40"
                                  : "cursor-pointer hover:bg-white"
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
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
