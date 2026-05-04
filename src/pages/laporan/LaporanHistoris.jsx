import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import * as XLSX from "xlsx";
import Sidebar from "../../components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LaporanHistoris = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ start: "", end: "", tipe: "" });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchRiwayat = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/transaksi/riwayat", {
        params: {
          start_date: filter.start,
          end_date: filter.end,
          tipe: filter.tipe,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setData(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const exportToExcel = () => {
    const dataFormatted = data.map((item) => ({
      Tanggal: new Date(item.created_at).toLocaleString(),
      Kode: item.kode_transaksi,
      Barang: item.nama_barang,
      Tipe: item.tipe_transaksi,
      Jumlah: item.jumlah,
      Lokasi: `${item.nama_gudang} - ${item.nama_rak}`,
      User: item.nama_user,
    }));

    const ws = XLSX.utils.json_to_sheet(dataFormatted);
    const wb = { Sheets: { Riwayat: ws }, SheetNames: ["Riwayat"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_Gudang_${new Date().toLocaleDateString()}.xlsx`;
    link.click();
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-7xl mx-auto mt-16 lg:mt-0">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Laporan Historis
              </h1>
              <p className="text-slate-500 mt-1">
                Pantau seluruh aliran keluar masuk barang di gudang.
              </p>
            </div>
            <Button
              onClick={exportToExcel}
              disabled={data.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-100 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Ekspor Data</span>
            </Button>
          </div>

          {/* Filter Section menggunakan Card */}
          <Card className="mb-8 border-none shadow-sm bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-6 items-end">
                <div className="flex-1 min-w-[280px]">
                  <label className="text-[11px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Rentang Tanggal
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      className="flex-1 border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none border bg-white transition-all"
                      onChange={(e) =>
                        setFilter({ ...filter, start: e.target.value })
                      }
                    />
                    <span className="text-slate-300 font-bold text-xs px-1">
                      KE
                    </span>
                    <input
                      type="date"
                      className="flex-1 border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none border bg-white transition-all"
                      onChange={(e) =>
                        setFilter({ ...filter, end: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="w-full md:w-56">
                  <label className="text-[11px] font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <ArrowUpDown className="h-3 w-3" /> Tipe Transaksi
                  </label>
                  <select
                    className="w-full border-slate-200 rounded-lg p-2.5 text-sm border focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    onChange={(e) =>
                      setFilter({ ...filter, tipe: e.target.value })
                    }
                  >
                    <option value="">Semua Aktivitas</option>
                    <option value="MASUK">Pemasukan (Masuk)</option>
                    <option value="KELUAR">Pengeluaran (Keluar)</option>
                  </select>
                </div>

                <Button
                  onClick={fetchRiwayat}
                  className="bg-blue-600 hover:bg-blue-700 h-[42px] px-8 rounded-lg shadow-md shadow-blue-100"
                >
                  <Filter className="h-4 w-4 mr-2" /> Tampilkan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Table Section menggunakan Card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Waktu
                      </th>
                      <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        ID Ref
                      </th>
                      <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Barang
                      </th>
                      <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Status
                      </th>
                      <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Jumlah
                      </th>
                      <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Lokasi Simpan
                      </th>
                      <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Users
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="p-20 text-center text-slate-400 font-medium"
                        >
                          <div className="flex flex-col items-center justify-center gap-2 animate-pulse">
                            <Loader2
                              className="animate-spin text-blue-600"
                              size={32}
                            />
                            <span>Menyinkronkan log riwayat...</span>
                          </div>
                        </td>
                      </tr>
                    ) : // <TableRow>
                    //   <TableCell colSpan={7} className="text-center py-20">
                    //     <Loader2
                    //       className="animate-spin inline text-blue-600"
                    //       size={32}
                    //     />
                    //     <span className="text-slate-400 font-medium">
                    //       Menyinkronkan log riwayat...
                    //     </span>
                    //   </TableCell>
                    // </TableRow>
                    currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="text-sm font-semibold text-slate-700">
                              {new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </div>
                            {/* <div className="text-[10px] text-slate-400 font-mono italic">
                              {new Date(item.created_at).toLocaleTimeString(
                                "id-ID",
                              )}
                            </div> */}
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">
                              {item.kode_transaksi}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-bold text-slate-800">
                              {item.nama_barang}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border-2 ${
                                item.tipe_transaksi === "MASUK"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-rose-50 text-rose-600 border-rose-100"
                              }`}
                            >
                              {item.tipe_transaksi}
                            </span>
                          </td>
                          <td className="p-4 font-black text-center text-slate-800 text-base">
                            {item.jumlah}
                          </td>
                          <td className="p-4">
                            <div className="text-xs font-bold text-slate-700">
                              {item.nama_gudang}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium italic">
                              Rak: {item.nama_rak}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 border border-blue-100 uppercase">
                                {/* Jika nama_user kosong, tampilkan 'ID' dan User ID-nya */}
                                {item.nama_user
                                  ? item.nama_user.substring(0, 2)
                                  : `U${item.user_id}`}
                              </div>
                              <span className="text-xs text-slate-600 font-semibold">
                                {item.nama_user || `User ID: ${item.user_id}`}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="p-20 text-center text-slate-400"
                        >
                          Tidak ada log transaksi ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls di dalam Card Footer */}
              {data.length > 0 && (
                <div className="p-4 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
                  {/* Sisi Kiri: Selector Jumlah Baris */}
                  <div className="flex items-center gap-3 order-2 md:order-1">
                    <span className="text-[11px] font-bold text-slate-400 tracking-wider">
                      Page Size
                    </span>
                    <select
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      {[10, 25, 50, 100].map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sisi Tengah: Info Data */}
                  {/* <div className="order-1 md:order-3"></div> */}

                  {/* Sisi Kanan: Navigasi Halaman */}
                  <div className="flex items-center gap-2 order-3">
                    <p className="text-[11px] text-slate-400 font-bold tracking-wider">
                      Page{" "}
                      <span className="text-slate-900">
                        {indexOfFirstItem + 1} of{" "}
                        {Math.min(indexOfLastItem, data.length)}
                      </span>{" "}
                      ( <span className="text-slate-900">{data.length}</span>{" "}
                      items )
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg border-slate-200 disabled:opacity-30"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex gap-1">
                      {/* Logika Ringkas: Jika total halaman banyak, tampilkan sekitar halaman aktif saja */}
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Tampilkan halaman pertama, terakhir, dan halaman di sekitar halaman aktif
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 &&
                            pageNum <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              className={`h-8 min-w-[32px] p-0 rounded-lg text-xs font-bold transition-all ${
                                currentPage === pageNum
                                  ? "bg-slate-900 text-white shadow-md shadow-slate-200 border-slate-900"
                                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
                              }`}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <span key={pageNum} className="text-slate-300 px-1">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg border-slate-200 disabled:opacity-30"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LaporanHistoris;
