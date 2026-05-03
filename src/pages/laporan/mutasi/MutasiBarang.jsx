import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig"; // Pastikan path ini benar
import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import FormInputMutasi from "./FormInputMutasi";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MutasiBarang() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/mutasi"); // Sesuaikan dengan endpoint backend kamu
      setData(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Searching
  const filteredData = data.filter((item) =>
    item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
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
                Mutasi Barang
              </h1>
              <p className="text-slate-500 font-medium">
                Daftar riwayat pemindahan barang antar gudang/lokasi.
              </p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-md"
            >
              <Plus className="mr-2" size={18} /> Input Mutasi Baru
            </Button>
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
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Asal</TableHead>
                  <TableHead>Tujuan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <Loader2
                        className="animate-spin inline text-blue-600"
                        size={32}
                      />
                    </TableCell>
                  </TableRow>
                ) : currentItems.length > 0 ? (
                  currentItems.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{indexOfFirstItem + i + 1}</TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell className="font-bold">
                        {item.nama_barang}
                      </TableCell>
                      <TableCell>{item.gudang_asal}</TableCell>
                      <TableCell>{item.gudang_tujuan}</TableCell>
                      <TableCell className="font-semibold">
                        {item.jumlah}
                      </TableCell>
                      <TableCell>{item.keterangan}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-20 text-slate-400 font-medium"
                    >
                      Data mutasi tidak ditemukan.
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
        </div>
        <FormInputMutasi
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchData}
        />
      </main>
    </div>
  );
}
