import { useEffect, useState } from "react";
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
  Search,
  Loader2,
  Plus,
  Tag,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAccess } from "../hooks/useAccess.js";

export default function Barang() {
  const [barang, setBarang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // State untuk Pagination & Dinamis Row
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 baris

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/barang", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBarang(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching barang:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBarang();
  }, []);

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${nama}"?`)) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/barang/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Update state agar baris yang dihapus langsung hilang dari layar
        setBarang(barang.filter((item) => item.id !== id));
        alert("Barang berhasil dihapus.");
      } catch (err) {
        alert(
          "Gagal menghapus barang: " +
            (err.response?.data?.error || err.message),
        );
      }
    }
  };

  const filteredBarang = barang.filter((item) => {
    const targetSearch =
      `${item.nama_barang} ${item.serial_number} ${item.merk}`.toLowerCase();
    return targetSearch.includes(searchTerm.toLowerCase());
  });

  // Pastikan key "CAN_EDIT_BARANG" sesuai dengan yang ada di PERMISSIONS pada constants.js
  const canManage = useAccess("CAN_EDIT_BARANG");
  const canAdd = useAccess("CAN_ADD_BARANG");

  // Logika Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBarang.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-7xl mx-auto mt-16 lg:mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                Data Inventory
              </h1>
              <p className="text-slate-500 font-medium">
                Manajemen stok unit dan sparepart.
              </p>
            </div>
            {canAdd && (
              <Link to="/barang/tambah">
                <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2 shadow-md">
                  <Plus size={18} /> Tambah Barang
                </Button>
              </Link>
            )}

            {/* Opsi: Jika ingin tetap menampilkan sesuatu untuk staff, 
            Anda bisa tambahkan else di sini (misal: "Read Only") */}
            {/* {!canAdd && (
              <span className="text-xs text-slate-400 italic">Read Only</span>
              // <Link to={canAdd ? "/barang/tambah" : "#"}>
              //   <Button
              //     className="bg-blue-600 hover:bg-blue-700 flex gap-2 shadow-md"
              //     disabled={!canAdd}
              //   >
              //     <Plus size={18} /> Tambah Barang
              //   </Button>
              // </Link>
            )} */}
          </div>

          {/* Toolbar: Search & Row Selector */}
          <Card className="mb-6 border-none shadow-sm bg-white">
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari SN, Nama, atau Merk..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Row Selector (Jumlah Baris) */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <ListFilter size={18} className="text-slate-400" />
                <span className="text-sm text-slate-500 whitespace-nowrap">
                  Tampilkan:
                </span>
                <select
                  className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset ke hal 1 saat ganti jumlah baris
                  }}
                >
                  <option value={5}>5 Baris</option>
                  <option value={10}>10 Baris</option>
                  <option value={25}>25 Baris</option>
                  <option value={50}>50 Baris</option>
                  <option value={filteredBarang.length}>Semua</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Tabel */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <Card className="shadow-sm border-none overflow-hidden bg-white mb-6">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow>
                        <TableHead className="w-[50px] text-center font-bold py-4 text-slate-700">
                          No
                        </TableHead>
                        <TableHead className="font-bold py-4 text-slate-700">
                          SN / Nama Barang
                        </TableHead>
                        <TableHead className="font-bold py-4 text-slate-700">
                          Merk & Kategori
                        </TableHead>
                        <TableHead className="font-bold py-4 text-slate-700">
                          Lokasi Gudang
                        </TableHead>
                        <TableHead className="font-bold py-4 text-slate-700">
                          Lokasi Rak
                        </TableHead>
                        <TableHead className="text-right font-bold py-4 text-slate-700">
                          Stok
                        </TableHead>
                        <TableHead className="text-center font-bold py-4 text-slate-700">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-20">
                            <Loader2
                              className="animate-spin inline-block text-blue-600"
                              size={32}
                            />
                          </TableCell>
                        </TableRow>
                      ) : currentItems.length > 0 ? (
                        currentItems.map((item, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="text-center text-slate-400 text-sm">
                              {indexOfFirstItem + index + 1}
                            </TableCell>

                            <TableCell className="py-4">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-mono text-slate-400 uppercase">
                                  SN: {item.serial_number || "-"}
                                </span>
                                <span className="font-bold text-slate-700 leading-tight">
                                  {item.nama_barang}
                                </span>
                                <span className="text-[10px] text-slate-400 italic truncate max-w-[200px]">
                                  {item.keterangan || ""}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="py-4 text-sm">
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-slate-600 flex items-center gap-1">
                                  <Tag size={12} className="text-blue-500" />{" "}
                                  {item.merk || "-"}
                                </span>
                                <span className="w-fit px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-wider">
                                  {item.kategori || "Umum"}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="py-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <Building2
                                  size={14}
                                  className="text-blue-400"
                                />
                                {item.lokasi_gudang || "Gudang Utama"}
                              </div>
                            </TableCell>

                            <TableCell className="py-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} className="text-red-400" />
                                {item.lokasi_rak || "Gudang Utama"}
                              </div>
                            </TableCell>

                            <TableCell className="text-right py-4 font-black">
                              <span
                                className={`text-lg ${item.stok <= 5 ? "text-red-500" : "text-blue-600"}`}
                              >
                                {item.stok}
                              </span>
                            </TableCell>

                            <TableCell className="text-center py-4">
                              {/* Gunakan conditional rendering */}
                              {canManage && (
                                <div className="flex justify-center gap-2">
                                  <Link to={`/barang/edit/${item.id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-blue-600 border-blue-100 hover:bg-blue-50 font-semibold"
                                    >
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDelete(item.id, item.nama_barang)
                                    }
                                    className="h-8 text-red-500 border-red-100 hover:bg-red-50"
                                  >
                                    Hapus
                                  </Button>
                                </div>
                              )}

                              {/* Opsi: Jika ingin tetap menampilkan sesuatu untuk staff, 
                            Anda bisa tambahkan else di sini (misal: "Read Only") */}
                              {!canManage && (
                                <span className="text-xs text-slate-400 italic">
                                  Read Only
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-20 text-slate-400"
                          >
                            Data barang tidak ditemukan.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 mb-10">
            <p className="text-sm text-slate-500 font-medium order-2 md:order-1">
              Menampilkan{" "}
              <span className="text-slate-800">{indexOfFirstItem + 1}</span> -{" "}
              <span className="text-slate-800">
                {Math.min(indexOfLastItem, filteredBarang.length)}
              </span>{" "}
              dari{" "}
              <span className="text-blue-600 font-bold">
                {filteredBarang.length}
              </span>{" "}
              barang
            </p>

            <div className="flex items-center gap-2 order-1 md:order-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="h-10 px-3 bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ChevronLeft size={20} />
              </Button>

              <div className="h-10 flex items-center px-4 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 shadow-sm">
                Hal {currentPage} / {totalPages || 1}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => paginate(currentPage + 1)}
                className="h-10 px-3 bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
