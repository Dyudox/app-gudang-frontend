import { useEffect, useState, useCallback } from "react";
import axios from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Users as UsersIcon,
  UserPlus,
  Trash2,
  ShieldCheck,
  Edit,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Searching & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(2);
  const [pagination, setPagination] = useState({
    totalData: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const token = localStorage.getItem("token");

  // Fungsi Fetch Data
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5000/api/users?search=${searchTerm}&page=${page}&limit=${limit}`;

      // console.log("1. Frontend Request ke URL:", url); // <--- LOG REQUEST

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.data) {
        // Kondisi jika backend SUDAH benar (mengirim objek)
        setUsers(res.data.data);
        setPagination(res.data.pagination);
      } else if (Array.isArray(res.data)) {
        // Kondisi darurat jika backend MASIH salah (mengirim array)
        console.warn(
          "Backend mengirim array mentah, paging tidak akan berfungsi!",
        );
        setUsers(res.data);
        setPagination({ totalData: res.data.length, totalPages: 1 });
      }

      if (res.data && res.data.data) {
        setUsers(res.data.data);
        setPagination(res.data.pagination);
      } else {
        console.warn(
          "Format data backend tidak sesuai (tidak ada property 'data')",
        );
        setUsers(res.data || []);
      }
    } catch (err) {
      console.error("3. Error Fetching:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, limit, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus akses untuk ${name}?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
      } catch (err) {
        alert("Gagal menghapus user");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-5xl mx-auto mt-16 lg:mt-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <UsersIcon className="text-blue-600" /> Manajemen Pengguna
              </h1>
              <p className="text-slate-500 text-sm">
                Kelola siapa saja yang bisa mengakses inventory.
              </p>
            </div>
            <Link to="/users/tambah">
              <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2 shadow-md">
                <UserPlus size={18} /> Tambah User
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama atau username..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Card className="border-none shadow-md overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 border-b">
                  <TableRow>
                    <TableHead className="text-center w-[80px]">ID</TableHead>
                    <TableHead>Nama Lengkap</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Akses</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-blue-600"
                      >
                        <Loader2 className="animate-spin mx-auto" size={32} />
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-32 text-center text-slate-400 italic"
                      >
                        User tidak ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50">
                        <TableCell className="text-center text-slate-400 font-mono text-xs">
                          {user.id}
                        </TableCell>
                        <TableCell className="font-bold text-slate-700">
                          {user.full_name}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                            <ShieldCheck size={14} /> Level {user.user_group_id}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-1">
                            <Link to={`/users/edit/${user.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:bg-blue-50 h-9 w-9 p-0"
                              >
                                <Edit size={18} />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete(user.id, user.full_name)
                              }
                              className="text-red-500 hover:bg-red-50 h-9 w-9 p-0"
                            >
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Tampilkan:
                </span>
                <select
                  className="text-xs border rounded-lg px-2 py-1.5 bg-white cursor-pointer"
                  value={limit}
                  onChange={(e) => {
                    setLimit(parseInt(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={2}>2 Baris</option>
                  <option value={10}>10 Baris</option>
                  <option value={20}>20 Baris</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-slate-500">
                  Total: {pagination.totalData || users.length} data
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <div className="flex items-center px-3 h-8 text-xs font-bold bg-white border rounded-md">
                    {page} / {pagination.totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
