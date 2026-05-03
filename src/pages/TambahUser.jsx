import { useState } from "react";
import axios from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, UserPlus, Save, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function TambahUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    user_group_id: "2", // Default ke Level 2 (User Biasa)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Menggunakan endpoint register yang sudah Anda buat di backend
      await axios.post("http://localhost:5000/api/auth/register", formData);

      alert("User baru berhasil didaftarkan!");
      navigate("/users"); // Kembali ke daftar user
    } catch (err) {
      alert(
        "Gagal menambah user: " +
          (err.response?.data?.error || "Terjadi kesalahan"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-2xl mx-auto mt-16 lg:mt-0">
          <div className="mb-6">
            <Link
              to="/users"
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors w-fit"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Kembali ke Daftar User</span>
            </Link>
          </div>

          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <UserPlus size={24} />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  Daftarkan User Baru
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="p-6 bg-white">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nama Lengkap */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Nama Lengkap
                  </label>
                  <input
                    name="full_name"
                    required
                    placeholder="Masukkan nama lengkap user"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={handleChange}
                  />
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Username
                  </label>
                  <input
                    name="username"
                    required
                    placeholder="Username untuk login"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={handleChange}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={handleChange}
                  />
                </div>

                {/* Level / Role */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Shield size={16} className="text-slate-400" /> Level Akses
                  </label>
                  <select
                    name="user_group_id"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.user_group_id}
                    onChange={handleChange}
                  >
                    <option value="1">Level 1 (Administrator)</option>
                    <option value="2">Level 2 (Manager)</option>
                    <option value="3">Level 3 (Staff)</option>
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    * Level menentukan izin hapus dan edit data.
                  </p>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-bold shadow-md gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Save size={20} />
                    )}
                    Buat Akun Sekarang
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
