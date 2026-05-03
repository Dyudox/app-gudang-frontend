import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import Sidebar from "../../components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Loader2,
  Plus,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccess } from "../../hooks/useAccess.js";

export default function LaporanStok() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const canGenerate = useAccess("CAN_GENERATE_REKAP");

  // Tambahkan di dalam komponen LaporanStok
  const [modalDetail, setModalDetail] = useState({
    open: false,
    data: [],
    kondisi: "",
    barangName: "",
  });

  // Fungsi untuk membuka modal
  const handleOpenModal = async (barangId, kondisi, namaBarang) => {
    // console.log("Tombol diklik! ID:", barangId, "Kondisi:", kondisi); // CEK INI DI CONSOLE
    try {
      const res = await api.get(
        `/laporan/detail-retur/${barangId}?kondisi=${kondisi}`,
      );
      // console.log("Data diterima:", res.data); // CEK APAKAH DATA ADA
      setModalDetail({
        open: true,
        data: res.data,
        kondisi,
        barangName: namaBarang,
      });
    } catch (err) {
      console.error("Error saat fetch:", err);
      alert("Gagal memuat detail retur: " + err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/laporan/stok-terkini");
      setData(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await api.post("/laporan/generate-rekap");
      alert("Rekap stok hari ini berhasil dibuat!");
      console.log("Success:", response.data);
      window.location.reload();
    } catch (err) {
      // Tampilkan detail error dari server
      const errorMessage =
        err.response?.data?.message || err.message || "Terjadi kesalahan";
      console.error("Detail Error:", err.response); // Cek ini di console
      alert("Gagal generate rekap: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cek apakah data terakhir adalah milik hari ini
  const today = new Date().toISOString().split("T")[0];
  const isAlreadyGenerated = data.some((item) => item.tanggal === today);

  const filteredData = data.filter((item) =>
    item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-7xl mx-auto mt-16 lg:mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Laporan Stok Terkini
              </h1>
              <p className="text-slate-500 font-medium">
                Monitoring saldo akhir barang hari ini.
              </p>
            </div>

            {/* Tombol Generate - Tetap menggunakan Button karena ini aksi API, bukan navigasi */}
            {/* {!loading && canGenerate && (
              <Button
                onClick={handleGenerate}
                className="bg-green-600 hover:bg-green-700 flex gap-2 shadow-md mb-4"
              >
                <Plus size={18} /> DEBUG: Generate Rekap Hari Ini
              </Button>
            )} */}
            {!loading && canGenerate && !isAlreadyGenerated && (
              <Button
                onClick={handleGenerate}
                className="bg-green-600 hover:bg-green-700 flex gap-2 shadow-md mb-4"
              >
                <Plus size={18} /> Generate Stok Rekap Hari Ini
              </Button>
            )}

            {/* Gunakan logika ini untuk memastikan data benar-benar sudah siap */}
            {/* {!loading && canGenerate && (
              <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4">
                <p>Debug Info: Data length = {data.length}</p>
                {data.length === 0 ? (
                  <Button onClick={handleGenerate} className="bg-green-600">
                    Generate Rekap Hari Ini
                  </Button>
                ) : (
                  <p className="text-red-600">
                    Tombol disembunyikan karena data.length bukan 0
                  </p>
                )}
              </div>
            )} */}
          </div>

          {/* Toolbar Search & Filter */}
          <Card className="mb-6 border-none shadow-sm bg-white">
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari nama barang..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <ListFilter size={18} className="text-slate-400" />
                <select
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5 Baris</option>
                  <option value={10}>10 Baris</option>
                  <option value={25}>25 Baris</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Tabel */}
          <Card className="shadow-sm border-none overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Stok Awal</TableHead>
                  <TableHead>Masuk</TableHead>
                  <TableHead>Keluar</TableHead>
                  <TableHead>Retur (B/R)</TableHead>
                  <TableHead>Stok Akhir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20">
                      <Loader2
                        className="animate-spin inline text-blue-600"
                        size={32}
                      />
                    </TableCell>
                  </TableRow>
                ) : currentItems && currentItems.length > 0 ? (
                  currentItems.map((item, i) => {
                    // DEBUG: Ini akan muncul di console browser (F12)
                    // Cek apakah 'barang_id' itu ada, atau mungkin namanya hanya 'id'
                    // console.log("Struktur item ke-", i, ":", item);

                    // Kita gunakan logika "fallback": coba barang_id dulu, kalau tidak ada baru pakai id
                    const idBarang = item.barang_id || item.id;

                    return (
                      <TableRow key={i}>
                        <TableCell>{indexOfFirstItem + i + 1}</TableCell>
                        <TableCell className="font-bold">
                          {item.nama_barang}
                        </TableCell>
                        <TableCell>{item.saldo_awal}</TableCell>
                        <TableCell className="text-green-600 font-semibold">
                          +{item.barang_masuk}
                        </TableCell>
                        <TableCell className="text-red-600 font-semibold">
                          -{item.barang_keluar}
                        </TableCell>

                        <TableCell>
                          <TooltipProvider>
                            {/* Retur Baik */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 font-bold hover:bg-green-50"
                                    onClick={() =>
                                      handleOpenModal(
                                        idBarang,
                                        "BAIK",
                                        item.nama_barang,
                                      )
                                    }
                                  >
                                    {item.retur_baik || 0}
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Detail retur BAIK</p>
                              </TooltipContent>
                            </Tooltip>

                            <span className="text-slate-300">/</span>

                            {/* Retur Rusak */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 font-bold hover:bg-red-50"
                                    onClick={() =>
                                      handleOpenModal(
                                        idBarang,
                                        "RUSAK",
                                        item.nama_barang,
                                      )
                                    }
                                  >
                                    {item.retur_rusak || 0}
                                  </Button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Detail retur RUSAK</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>

                        <TableCell className="font-black text-blue-600">
                          {item.saldo_akhir}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-20 text-slate-400 font-medium"
                    >
                      Data stok tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 px-2">
            <p className="text-sm text-slate-500">
              Menampilkan {currentItems.length} dari {filteredData.length} data
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft size={20} />
              </Button>
              <div className="h-9 px-4 flex items-center border rounded-lg text-sm font-bold bg-white">
                {currentPage} / {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
          {modalDetail.open && (
            <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <Card className="w-full max-w-lg shadow-2xl border-none">
                <CardContent className="p-6 relative">
                  {/* Tombol Close Ikon Pojok Kanan Atas */}
                  <button
                    onClick={() =>
                      setModalDetail({ ...modalDetail, open: false })
                    }
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={24} />
                  </button>

                  <h3 className="text-xl font-bold text-slate-800 mb-6">
                    Detail Retur {modalDetail.kondisi}
                    <span className="block text-sm font-normal text-slate-500">
                      {modalDetail.barangName}
                    </span>
                  </h3>

                  {modalDetail.data.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {modalDetail.data.map((d, i) => (
                        <div
                          key={i}
                          className="flex justify-between py-3 border-b border-slate-100 last:border-none"
                        >
                          <span className="text-slate-600">
                            {new Date(d.tanggal_retur).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="font-bold text-slate-800">
                            {d.jumlah} unit
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <p>Tidak ada catatan retur ditemukan.</p>
                    </div>
                  )}

                  <Button
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
                    onClick={() =>
                      setModalDetail({ ...modalDetail, open: false })
                    }
                  >
                    Tutup Detail
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
