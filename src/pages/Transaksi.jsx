import { useEffect, useState, useRef } from "react";
import axios from "../api/axiosConfig";
import Sidebar from "../components/Sidebar";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Barcode,
  ArrowUpCircle,
  ArrowDownCircle,
  Package,
  MapPin,
  Save,
  RotateCcw,
  Loader2,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function Transaksi() {
  const [barcode, setBarcode] = useState("");
  const [barang, setBarang] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [tipe, setTipe] = useState("MASUK");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [riwayat, setRiwayat] = useState([]);

  // Fungsi untuk ambil riwayat dari API
  const fetchRiwayat = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/barang/transaksi/recent",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRiwayat(res.data);
    } catch (err) {
      console.error("Gagal ambil riwayat:", err);
    }
  };

  // Auto-focus ke input barcode saat halaman dimuat
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    fetchRiwayat(); // Ambil riwayat saat pertama kali buka halaman
  }, []);

  const handleCariBarang = async (e) => {
    e.preventDefault();
    if (!barcode) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/barang/barcode/${barcode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setBarang(res.data);
    } catch (err) {
      alert("Barang dengan barcode tersebut tidak ditemukan!");
      setBarang(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSimpan = async () => {
    if (!barang || jumlah < 1) return;

    try {
      const token = localStorage.getItem("token");
      // Tambahkan "const res =" di depan axios.post jika ingin menggunakan variabel res
      const res = await axios.post(
        "http://localhost:5000/api/barang/transaksi",
        {
          barang_id: barang.id,
          tipe_transaksi: tipe,
          jumlah: parseInt(jumlah),
          keterangan: `Input via scanner - ${tipe}`,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("Respon sukses:", res.data); // Sekarang 'res' sudah ada
      alert(`Berhasil mencatat barang ${tipe.toLowerCase()}!`);

      fetchRiwayat(); // Refresh tabel riwayat otomatis

      // Reset form
      setBarang(null);
      setBarcode("");
      setJumlah(1);
      inputRef.current.focus();
    } catch (err) {
      // Hapus baris yang memanggil 'res' di dalam catch karena res tidak ada jika error
      console.error("DETAIL ERROR:", err);
      alert(err.response?.data?.message || "Gagal menyimpan transaksi");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 transition-all duration-300 ml-0 lg:ml-72 p-4 md:p-8">
        <div className="max-w-4xl mx-auto mt-16 lg:mt-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              Scan Transaksi
            </h1>
            <p className="text-slate-500 font-medium">
              Proses barang masuk dan keluar menggunakan barcode scanner.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Input Barcode Section */}
            <Card className="md:col-span-2 border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-6">
                <form onSubmit={handleCariBarang} className="space-y-4">
                  <div className="relative">
                    <label className="text-sm font-bold text-slate-700 mb-2 block">
                      Barcode Scanner
                    </label>
                    <div className="relative">
                      <Barcode
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        ref={inputRef}
                        type="text"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-lg"
                        placeholder="Scan atau ketik kode barcode..."
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-md gap-2"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Barcode size={20} />
                      )}
                      Cari Barang
                    </Button>
                  </div>
                  {/* <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-lg font-bold shadow-md gap-2 transition-all"
                  >
                    Cari Barang
                  </Button> */}
                </form>

                {/* Info Detail Barang setelah di-scan */}
                {barang && (
                  <div className="mt-8 pt-8 border-t border-dashed border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          <Package size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {barang.nama_barang}
                          </h3>
                          <p className="text-slate-500 text-sm font-medium">
                            {barang.merk} | SN: {barang.serial_number || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                          Stok Saat Ini
                        </span>
                        <span
                          className={`text-3xl font-black ${barang.stok <= 5 ? "text-red-500" : "text-blue-600"}`}
                        >
                          {barang.stok}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div
                        onClick={() => setTipe("MASUK")}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${tipe === "MASUK" ? "border-green-500 bg-green-50 text-green-700" : "border-slate-100 bg-slate-50 text-slate-400"}`}
                      >
                        <ArrowDownCircle size={24} />
                        <span className="font-bold uppercase text-xs tracking-wider">
                          Barang Masuk
                        </span>
                      </div>
                      <div
                        onClick={() => setTipe("KELUAR")}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${tipe === "KELUAR" ? "border-orange-500 bg-orange-50 text-orange-700" : "border-slate-100 bg-slate-50 text-slate-400"}`}
                      >
                        <ArrowUpCircle size={24} />
                        <span className="font-bold uppercase text-xs tracking-wider">
                          Barang Keluar
                        </span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-sm font-bold text-slate-700 mb-2 block">
                        Jumlah Transaksi
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl font-bold"
                        value={jumlah}
                        onChange={(e) => setJumlah(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 h-12 gap-2"
                        onClick={() => setBarang(null)}
                      >
                        <RotateCcw size={18} /> Batal
                      </Button>
                      <Button
                        className={`flex-[2] h-12 gap-2 shadow-lg font-bold ${tipe === "MASUK" ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`}
                        onClick={handleSimpan}
                      >
                        <Save size={18} /> Simpan Transaksi {tipe}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Side Info */}
            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={20} className="text-blue-200" />
                    <h3 className="font-bold uppercase text-xs tracking-widest text-blue-100">
                      Lokasi Rak
                    </h3>
                  </div>
                  <p className="text-4xl font-black mb-2">
                    {barang ? barang.lokasi_rak : "--"}
                  </p>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {barang
                      ? `Pastikan barang diletakkan kembali ke rak ${barang.lokasi_rak} setelah diproses.`
                      : "Scan barang untuk melihat lokasi penyimpanan."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                  <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                    Instruksi
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 text-xs text-slate-500 font-medium leading-relaxed">
                      <span className="h-5 w-5 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-800">
                        1
                      </span>
                      Klik kotak input dan scan barcode barang.
                    </li>
                    <li className="flex gap-3 text-xs text-slate-500 font-medium leading-relaxed">
                      <span className="h-5 w-5 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-800">
                        2
                      </span>
                      Pilih tipe transaksi (Masuk untuk restock, Keluar untuk
                      pengiriman).
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* TABEL RIWAYAT DI BAWAH */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <RotateCcw size={20} className="text-blue-600" />
              10 Transaksi Terakhir
            </h2>
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[50px] text-center">No</TableHead>
                      <TableHead>Tanggal & Waktu</TableHead>
                      <TableHead>Barang</TableHead>
                      <TableHead>Petugas</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riwayat.length > 0 ? (
                      riwayat.map((t, index) => (
                        <TableRow key={index} className="hover:bg-slate-50/50">
                          {/* Kolom No */}
                          <TableCell className="text-center text-slate-400 font-medium">
                            {index + 1}
                          </TableCell>

                          {/* Kolom Tanggal & Waktu */}
                          <TableCell className="text-xs text-slate-600">
                            <div className="font-semibold">
                              {new Date(t.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              {new Date(t.created_at).toLocaleTimeString(
                                "id-ID",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}{" "}
                              WIB
                            </div>
                          </TableCell>

                          {/* Kolom Barang */}
                          <TableCell>
                            <div className="font-bold text-slate-700">
                              {t.nama_barang}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-tighter">
                              {t.merk} | SN: {t.serial_number || "-"}
                            </div>
                          </TableCell>

                          {/* Kolom Petugas Baru */}
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {t.nama_user?.substring(0, 2).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-700">
                                {t.nama_user}
                              </span>
                            </div>
                          </TableCell>

                          {/* Kolom Tipe */}
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-md text-[10px] font-black tracking-wider ${
                                t.tipe_transaksi === "MASUK"
                                  ? "bg-green-100 text-green-700 border border-green-200"
                                  : "bg-orange-100 text-orange-700 border border-orange-200"
                              }`}
                            >
                              {t.tipe_transaksi}
                            </span>
                          </TableCell>

                          {/* Kolom Jumlah */}
                          <TableCell className="text-right font-black text-slate-800">
                            <span
                              className={
                                t.tipe_transaksi === "MASUK"
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }
                            >
                              {t.tipe_transaksi === "MASUK" ? "+" : "-"}
                              {t.jumlah}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-10 text-slate-400"
                        >
                          Belum ada riwayat transaksi.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
