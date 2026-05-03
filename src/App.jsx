import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Barang from "./pages/Barang"; // Import file yang baru dibuat
import KategoriBarang from "./pages/KategoriBarang";
import TambahBarang from "./pages/TambahBarang";
import EditBarang from "./pages/EditBarang";
import Users from "./pages/Users";
import TambahUser from "./pages/TambahUser";
import EditUser from "./pages/EditUser";
import UserGroups from "./pages/UserGroups";
import Transaksi from "./pages/Transaksi";
import LaporanStok from "./pages/laporan/LaporanStok";
import MutasiBarang from "./pages/laporan/mutasi/MutasiBarang";
import LaporanRetur from "./pages/laporan/LaporanRetur";
import AnalisisKategori from "./pages/laporan/AnalisisKategori";
import LaporanHistoris from "./pages/laporan/LaporanHistoris";
import Settings from "./pages/Settings";

// Komponen Pembungkus untuk Proteksi Halaman
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Komponen Pembungkus agar user yang sudah login tidak bisa balik ke halaman Login
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Halaman Login: Hanya bisa dibuka jika BELUM login */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Halaman Dashboard: Hanya bisa dibuka jika SUDAH login */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Halaman Barang */}
        <Route
          path="/barang"
          element={
            <ProtectedRoute>
              <Barang />
            </ProtectedRoute>
          }
        />

        {/* Halaman Kategori Barang */}
        <Route
          path="/kategori"
          element={
            <ProtectedRoute>
              <KategoriBarang />
            </ProtectedRoute>
          }
        />

        {/* Halaman Tambah Barang */}
        <Route
          path="/barang/tambah"
          element={
            <ProtectedRoute>
              <TambahBarang />
            </ProtectedRoute>
          }
        />

        {/* Halaman Edit Barang */}
        <Route
          path="/barang/edit/:id"
          element={
            <ProtectedRoute>
              <EditBarang />
            </ProtectedRoute>
          }
        />

        {/* Halaman Users */}
        <Route
          path="/users/"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Halaman Tambah User */}
        <Route
          path="/users/tambah"
          element={
            <ProtectedRoute>
              <TambahUser />
            </ProtectedRoute>
          }
        />

        {/* Halaman Edit User */}
        <Route
          path="/users/edit/:id"
          element={
            <ProtectedRoute>
              <EditUser />
            </ProtectedRoute>
          }
        />

        {/* Halaman User Groups */}
        <Route
          path="/users/roles"
          element={
            <ProtectedRoute>
              <UserGroups />
            </ProtectedRoute>
          }
        />

        {/* Halaman Transaksi */}
        <Route
          path="/transaksi"
          element={
            <ProtectedRoute>
              <Transaksi />
            </ProtectedRoute>
          }
        />

        {/* Halaman Laporan Stok */}
        <Route
          path="/laporan/stok"
          element={
            <ProtectedRoute>
              <LaporanStok />
            </ProtectedRoute>
          }
        />

        {/* Halaman Mutasi Barang */}
        <Route
          path="/laporan/mutasi"
          element={
            <ProtectedRoute>
              <MutasiBarang />
            </ProtectedRoute>
          }
        />

        {/* Halaman Laporan Retur */}
        <Route
          path="/laporan/retur"
          element={
            <ProtectedRoute>
              <LaporanRetur />
            </ProtectedRoute>
          }
        />

        {/* Halaman Analisis Kategori */}
        <Route
          path="/laporan/kategori"
          element={
            <ProtectedRoute>
              <AnalisisKategori />
            </ProtectedRoute>
          }
        />

        {/* Halaman Laporan Historis */}
        <Route
          path="/laporan/historis"
          element={
            <ProtectedRoute>
              <LaporanHistoris />
            </ProtectedRoute>
          }
        />

        {/* Halaman Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
