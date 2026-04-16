import { useEffect, useState, useCallback } from "react";
// Gunakan instance 'api' yang sudah ada interceptornya
import api from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Package,
  Users,
  Layers,
  AlertTriangle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { RefreshCw, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBarang: 0,
    totalUser: 0,
    totalKategori: 0,
    stokRendah: 0,
  });

  // Menggunakan useState untuk menyimpan data chart
  const [chartData, setChartData] = useState({ barData: [], lineData: [] });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. PINDAHKAN fetchData ke luar useEffect agar bisa diakses handleRefresh
  const fetchData = useCallback(async () => {
    try {
      const [resStats, resCharts] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/charts"),
      ]);
      setStats(resStats.data);
      setChartData(resCharts.data);

      // Berikan waktu ekstra bagi DOM untuk stabil sebelum render grafik
      setTimeout(() => setIsMounted(true), 300);
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Efek untuk memuat data pertama kali
  useEffect(() => {
    fetchData();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // KUNCI: Bersihkan timer HANYA saat komponen dihapus (return function)
    return () => clearInterval(timer);
  }, [fetchData]);

  // 3. Fungsi Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const cards = [
    {
      title: "Total Barang",
      value: stats.totalBarang,
      icon: <Package size={24} />,
      color: "bg-blue-500",
      link: "/barang",
    },
    {
      title: "Total Pengguna",
      value: stats.totalUser,
      icon: <Users size={24} />,
      color: "bg-purple-500",
      link: "/users",
    },
    {
      title: "Kategori",
      value: stats.totalKategori,
      icon: <Layers size={24} />,
      color: "bg-emerald-500",
      link: "/barang",
    },
    {
      title: "Stok Menipis",
      value: stats.stokRendah,
      icon: <AlertTriangle size={24} />,
      color: "bg-amber-500",
      link: "/barang",
    },
  ];

  if (loading) {
    return (
      // <div className="flex min-h-screen items-center justify-center bg-slate-50">
      //   <Loader2 className="animate-spin text-blue-600" size={48} />
      // </div>
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-blue-600">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="animate-spin" size={40} />
          <p className="text-sm font-medium animate-pulse">
            Menyiapkan Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-7xl mx-auto mt-16 lg:mt-0">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Ringkasan inventaris Anda hari ini.
              </p>
            </div>
            {/* Bisa ditambah tombol Refresh atau tanggal di sini */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Tombol Refresh */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 rounded-full shadow-sm border border-slate-200 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={`${isRefreshing ? "animate-spin" : ""}`}
                />
                {isRefreshing ? "Memperbarui..." : "Refresh"}
              </button>

              {/* Info Waktu & Jam */}
              <div className="flex items-center gap-3 bg-blue-600 px-4 py-2 rounded-full shadow-md text-white border border-blue-500">
                <div className="flex items-center gap-1.5 border-r border-blue-400 pr-3 mr-1">
                  <Clock size={14} />
                  <span className="text-xs font-mono font-bold">
                    {currentTime.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">
                  {currentTime.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Grid Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {cards.map((card, index) => (
              <Card
                key={index}
                className="border-none shadow-sm hover:shadow-md transition-all group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        {card.title}
                      </p>
                      <h3 className="text-3xl font-extrabold text-slate-800">
                        {card.value}
                      </h3>
                    </div>
                    <div
                      className={`p-4 rounded-2xl text-white shadow-lg transform group-hover:scale-110 transition-transform ${card.color}`}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <Link
                    to={card.link}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 mt-6 group/link"
                  >
                    Lihat Detail
                    <ArrowRight
                      size={14}
                      className="group-hover/link:translate-x-1 transition-transform"
                    />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bagian Grafik */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-base font-bold text-slate-700 uppercase tracking-tight">
                  Distribusi Barang
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.barData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="name"
                          fontSize={10}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          fontSize={10}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#f8fafc" }}
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="total"
                          fill="#3b82f6"
                          radius={[6, 6, 0, 0]}
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
                      Rendering chart...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-base font-bold text-slate-700 uppercase tracking-tight">
                  Tren Stok Barang
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.lineData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#f1f5f9"
                        />
                        <XAxis
                          dataKey="name"
                          fontSize={10}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          fontSize={10}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="stok"
                          stroke="#10b981"
                          strokeWidth={4}
                          dot={{
                            r: 4,
                            fill: "#10b981",
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">
                      Rendering chart...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
