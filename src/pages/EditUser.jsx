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
import { Loader2, ArrowLeft, Save, UserCog } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    user_group_id: "",
    password: "", // Kosongkan jika tidak ingin ganti password
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({ ...res.data, password: "" });
      } catch (err) {
        alert("Gagal mengambil data user");
        navigate("/users");
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Data user berhasil diperbarui!");
      navigate("/users");
    } catch (err) {
      alert("Gagal memperbarui user");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-2xl mx-auto mt-16 lg:mt-0">
          <Link
            to="/users"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 w-fit"
          >
            <ArrowLeft size={18} /> <span>Kembali</span>
          </Link>
          <Card className="border-none shadow-lg">
            <CardHeader className="border-b bg-white p-6">
              <div className="flex items-center gap-3">
                <UserCog className="text-blue-600" size={24} />
                <CardTitle className="text-xl font-bold">
                  Edit Profil Pengguna
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold">Nama Lengkap</label>
                  <input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Username</label>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-red-500 italic text-[11px]">
                    Password (Kosongkan jika tidak diubah)
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="******"
                    className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Level Akses</label>
                  <select
                    name="user_group_id"
                    value={formData.user_group_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="1">Level 1 (Super Admin)</option>
                    <option value="2">Level 2 (Admin Gudang)</option>
                    <option value="3">Level 3 (Viewer)</option>
                  </select>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 h-12 font-bold shadow-md"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Save size={20} />
                  )}{" "}
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
