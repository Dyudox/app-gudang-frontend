import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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
  RefreshCw,
  Clock,
} from "lucide-react";
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
  AreaChart,
  Area,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBarang: 0,
    totalUser: 0,
    totalTransaksiHariIni: 0,
    stokRendah: 0,
  });

  // State untuk menampung barData, lineData, dan data tren area
  const [chartData, setChartData] = useState({ barData: [], lineData: [] });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [resStats, resCharts] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/dashboard/charts"),
      ]);

      setStats(resStats.data);
      setChartData(resCharts.data);

      setTimeout(() => setIsMounted(true), 400);
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [fetchData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  const statCards = [
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
      title: "Transaksi Hari Ini",
      value: stats.totalTransaksiHariIni,
      icon: <Layers size={24} />,
      color: "bg-emerald-500",
      link: "/transaksi",
    },
    {
      title: "Stok Menipis (<5)",
      value: stats.stokRendah,
      icon: <AlertTriangle size={24} />,
      color: "bg-amber-500",
      link: "/barang",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-blue-600">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin" size={48} />
          <p className="text-sm font-bold animate-pulse tracking-widest uppercase text-slate-500">
            Menyinkronkan Gudang...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-7xl mx-auto mt-16 lg:mt-0">
          {/* HEADER SECTION */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Dashboard Ringkasan
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Selamat datang kembali di panel kendali sistem.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm border border-slate-200 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                {isRefreshing ? "Updating..." : "Refresh Data"}
              </button>

              <div className="flex items-center gap-3 bg-blue-600 px-5 py-2.5 rounded-xl shadow-lg text-white">
                <div className="flex items-center gap-2 border-r border-blue-400 pr-3">
                  <Clock size={14} />
                  <span className="text-sm font-mono font-bold tracking-tighter">
                    {currentTime.toLocaleTimeString("id-ID")}
                  </span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest">
                  {currentTime.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* STATISTIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, idx) => (
              <Card
                key={idx}
                className="border-none shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                        {card.title}
                      </p>
                      <h3 className="text-3xl font-black text-slate-800">
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
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 mt-6 group/link"
                  >
                    DETAIL{" "}
                    <ArrowRight
                      size={14}
                      className="group-hover/link:translate-x-1 transition-transform"
                    />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 1. Bar Chart: Distribusi Kategori */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  Distribusi Per Kategori
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
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
                          interval={0} // Memaksa semua label muncul
                          // angle={-45} // Memutar teks
                          // textAnchor="end" // Memastikan ujung teks menempel di garis axis
                          // height={60} // Menambah ruang bawah agar teks yang miring tidak terpotong
                          //interval="preserveStartEnd" // Menyembunyikan label yang akan bertabrakan
                          tickFormatter={(value) =>
                            value.length > 10
                              ? `${value.substring(0, 10)}...`
                              : value
                          }
                        />
                        <YAxis
                          fontSize={10}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "#f8fafc" }}
                          contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Bar
                          dataKey="total"
                          fill="#3b82f6"
                          radius={[6, 6, 0, 0]}
                          barSize={35}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center animate-pulse text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">
                          {/* Memuat Analisis Arus Barang... */}
                          Loading Chart...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 2. Area Chart: Tren Stok (Aktivitas Volume Stok) */}
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />{" "}
                  Aktivitas Volume Stok
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 px-2">
                <div className="h-[300px] w-full">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.lineData}>
                        <defs>
                          <linearGradient
                            id="colorStok"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            {/* Menggunakan warna Biru (Blue-500) */}
                            <stop
                              offset="5%"
                              stopColor="#f6d43bff"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor="#f6d43bff"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
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
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="stok"
                          stroke="#f6d43bff" // Garis Biru
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorStok)" // Gradien Biru
                          dot={{
                            r: 4,
                            fill: "#f6d43bff",
                            strokeWidth: 2,
                            stroke: "#fff",
                          }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    // <div className="h-full flex items-center justify-center animate-pulse text-slate-300">
                    //   Loading Chart...
                    // </div>
                    <div className="h-full flex items-center justify-center animate-pulse text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">
                          {/* Memuat Analisis Arus Barang... */}
                          Loading Chart...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. Area Chart: Tren Transaksi (Masuk vs Keluar) */}
          {/* Bagian ini menggunakan chartData.lineData yang diasumsikan berisi key 'masuk' dan 'keluar' dari Backend */}
          <Card className="border-none shadow-sm bg-white mb-8">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-700">
                Analisis Arus Barang (7 Hari Terakhir)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[350px] w-full">
                {/* Logika Loading di sini: Jika chartData ada, tampilkan Chart, jika tidak tampilkan Loading */}
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData.lineData}>
                      <defs>
                        <linearGradient
                          id="colorMasuk"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#22c55e"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#22c55e"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorKeluar"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f1f5f9"
                      />
                      <XAxis
                        dataKey="name"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend verticalAlign="top" align="right" height={36} />
                      <Area
                        name="Barang Masuk"
                        type="monotone"
                        dataKey="masuk"
                        stroke="#22c55e"
                        fillOpacity={1}
                        fill="url(#colorMasuk)"
                        strokeWidth={3}
                      />
                      <Area
                        name="Barang Keluar"
                        type="monotone"
                        dataKey="keluar"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#colorKeluar)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center animate-pulse text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">
                        Loading Chart...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
