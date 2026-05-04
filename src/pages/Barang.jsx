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
  ChevronLeft,
  ChevronRight,
  ListFilter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAccess } from "../hooks/useAccess.js";
import TambahLokasiModal from "../components/modal/TambahLokasiModal";

export default function Barang() {
  const [barang, setBarang] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  const [selectedBarang, setSelectedBarang] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/barang", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transformed = res.data.reduce((acc, curr) => {
          const existing = acc.find((item) => item.id === curr.id);
          if (existing) {
            existing.lokasiList.push({
              nama_gudang: curr.lokasi_gudang,
              nama_rak: curr.lokasi_rak,
              stok: curr.stok,
            });
            existing.totalStok += curr.stok;
          } else {
            acc.push({
              ...curr,
              totalStok: curr.stok,
              lokasiList: [
                {
                  nama_gudang: curr.lokasi_gudang,
                  nama_rak: curr.lokasi_rak,
                  stok: curr.stok,
                },
              ],
            });
          }
          return acc;
        }, []);
        setBarang(transformed);
      } catch (err) {
        console.error("Error fetching barang:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBarang();
  }, []);

  const toggleRow = (id) =>
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredBarang = barang.filter((item) =>
    `${item.nama_barang} ${item.serial_number} ${item.merk}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const canManage = useAccess("CAN_EDIT_BARANG");
  const canAdd = useAccess("CAN_ADD_BARANG");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBarang.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-7xl mx-auto mt-16 lg:mt-0">
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Data Inventory
              </h1>
              <p className="text-slate-500">
                Manajemen stok unit dan sparepart.
              </p>
            </div>
            {canAdd && (
              <Link to="/barang/tambah">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                  <Plus size={18} className="mr-2" /> Tambah Barang
                </Button>
              </Link>
            )}
          </div>

          <Card className="mb-6 border-none shadow-sm bg-white">
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari SN, Nama, atau Merk..."
                  className="w-full pl-10 py-2.5 bg-slate-50 border rounded-lg outline-none"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <select
                className="bg-slate-50 border rounded-lg px-3 py-2.5 text-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {[5, 10, 25, 50].map((val) => (
                  <option key={val} value={val}>
                    {val} Baris
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <Card className="shadow-sm border-none overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="w-16 text-center">No</TableHead>
                    <TableHead>SN / Nama Barang</TableHead>
                    <TableHead>Merk & Kategori</TableHead>
                    <TableHead className="text-center">Detail</TableHead>
                    <TableHead className="text-right">Total Stok</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
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
                  ) : currentItems.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-20 text-slate-400"
                      >
                        Data barang tidak ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((item, index) => (
                      <RenderRow
                        key={item.id}
                        item={item}
                        index={indexOfFirstItem + index}
                        toggleRow={toggleRow}
                        expanded={expandedRows[item.id]}
                        canManage={canManage}
                        setSelectedBarang={setSelectedBarang}
                        setModalOpen={setModalOpen}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* <div className="flex items-center justify-between mt-6 px-2">
              <p className="text-sm text-slate-500">
                Menampilkan {indexOfFirstItem + 1} -{" "}
                {Math.min(indexOfLastItem, filteredBarang.length)} dari{" "}
                {filteredBarang.length} barang
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((c) => c - 1)}
                >
                  <ChevronLeft size={16} />
                </Button>
                <div className="px-4 py-2 bg-white border rounded text-sm font-bold">
                  Hal {currentPage} / {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((c) => c + 1)}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div> */}

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
                  onClick={() => setCurrentPage((c) => c - 1)}
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
                  onClick={() => setCurrentPage((c) => c + 1)}
                  className="h-10 px-3 bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Modal dipanggil sekali saja di sini */}
      {modalOpen && (
        <TambahLokasiModal
          barangId={selectedBarang?.id}
          namaBarang={selectedBarang?.nama_barang}
          onClose={() => setModalOpen(false)}
          onRefresh={() => window.location.reload()}
        />
      )}
    </div>
  );
}

function RenderRow({
  item,
  index,
  toggleRow,
  expanded,
  canManage,
  setModalOpen,
  setSelectedBarang,
}) {
  // Logika warna merah jika stok <= 5
  const isLowStock = item.totalStok <= 5;

  return (
    <>
      <TableRow
        className={`cursor-pointer hover:bg-slate-50 transition-colors ${expanded ? "bg-slate-100" : ""}`}
        onClick={() => toggleRow(item.id)}
      >
        <TableCell className="text-center">{index + 1}</TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              SN: {item.serial_number || "-"}
            </span>
            <span className="font-bold text-slate-700">{item.nama_barang}</span>
            <span className="text-[11px] text-slate-500 italic truncate max-w-[200px]">
              {item.keterangan || "-"}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm">{item.merk}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {item.kategori}
          </div>
        </TableCell>
        <TableCell className="text-center">
          <Button variant="ghost" size="sm" className="text-xs">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}{" "}
            {item.lokasiList.length} Lokasi
          </Button>
        </TableCell>
        <TableCell
          className={`text-right font-black text-lg ${isLowStock ? "text-red-500" : "text-blue-600"}`}
        >
          {item.totalStok}
        </TableCell>
        <TableCell className="text-center">
          {canManage && (
            <div className="flex items-center justify-center gap-2">
              <Link to={`/barang/edit/${item.id}`}>
                <Button
                  onClick={() => console.log("Mencoba mengedit ID:", item.id)}
                  variant="outline"
                  size="sm"
                  className="h-8 text-blue-600 border-blue-100 hover:bg-blue-50 font-semibold"
                >
                  Edit
                </Button>
              </Link>
              {/* Tombol Tambah Lokasi berdiri sendiri */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-blue-600 border-blue-100 hover:bg-blue-50 font-semibold"
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah klik tombol membuka/menutup baris
                  setSelectedBarang(item);
                  setModalOpen(true);
                }}
              >
                + Lokasi
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>

      {/* Baris Expandable dengan Aksen Warna */}
      {expanded && (
        <TableRow className="bg-blue-50/30">
          <TableCell colSpan={6} className="p-4 border-b-2 border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-4 w-1 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Detail Lokasi Stok
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {item.lokasiList.map((loc, i) => (
                <div
                  key={i}
                  className="bg-white p-3 border border-blue-100 rounded-lg shadow-sm flex justify-between items-center hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">
                      {loc.nama_gudang}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Rak: {loc.nama_rak}
                    </span>
                  </div>
                  <span
                    className={`font-bold text-sm px-2 py-1 rounded ${loc.stok <= 5 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"}`}
                  >
                    {loc.stok} unit
                  </span>
                </div>
              ))}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
