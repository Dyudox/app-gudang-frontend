import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  History,
  Settings,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  List,
  PlusCircle,
  UserPlus,
  LucideTags,
  ShieldCheck,
  ClipboardList,
  ArrowRightLeft,
  RotateCcw,
  BarChart3,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
// import { useAccess } from "../hooks/useAccess.js";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState("");
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      roles: [1, 2, 3],
    },
    {
      icon: Package,
      label: "Data Barang",
      roles: [1, 2],
      submenu: [
        { label: "Daftar Barang", path: "/barang", icon: List },
        { label: "Kategori Barang", path: "/kategori", icon: LucideTags },
      ],
    },
    {
      icon: Users,
      label: "User Management",
      roles: [1],
      submenu: [
        { label: "Semua User", path: "/users", icon: List },
        { label: "Hak Akses", path: "/users/roles", icon: ShieldCheck },
      ],
    },
    { icon: History, label: "Transaksi", path: "/transaksi", roles: [1, 2, 3] },
    {
      icon: FileText,
      label: "Laporan & Analisis",
      roles: [1, 2, 3], // Manager(2) biasanya juga butuh akses laporan
      submenu: [
        {
          label: "Stok Terkini",
          roles: [1, 2, 3],
          path: "/laporan/stok",
          icon: Archive,
        },
        {
          label: "Mutasi Barang",
          roles: [1, 2, 3],
          path: "/laporan/mutasi",
          icon: ArrowRightLeft,
        },
        {
          label: "Daftar Retur",
          roles: [1, 2, 3],
          path: "/laporan/retur",
          icon: RotateCcw,
        },
        {
          label: "Analisis Kategori",
          roles: [1, 2],
          path: "/laporan/kategori",
          icon: BarChart3,
        },
        {
          label: "Laporan Historis",
          roles: [1, 2],
          path: "/laporan/historis",
          icon: ClipboardList,
        },
      ],
    },
    { icon: Settings, label: "Settings", path: "/settings", roles: [1] },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const [userData, setUserData] = useState({ username: "", name: "" });

  // 1. Ambil string mentah: {"username":"kiero_admin","name":"Manager"}
  useEffect(() => {
    const savedData = localStorage.getItem("user");

    if (savedData) {
      // 2. Ubah string jadi object JavaScript
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
    }
  }, []);

  // 2. Efek untuk Auto-Open Submenu berdasarkan URL saat ini
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.submenu) {
        // Cek apakah URL saat ini dimulai dengan salah satu path di submenu
        // Contoh: /barang/edit/1 dimulai dengan /barang
        const isActive = item.submenu.some((sub) =>
          location.pathname.startsWith(sub.path),
        );

        if (isActive) {
          setOpenSubmenu(item.label);
        }
      }
    });
  }, [location.pathname]);

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  // Tambahkan ini tepat sebelum bagian yang me-return JSX
  // const filteredItems = menuItems.filter((item) =>
  //   item.roles.includes(userData.user_group_id),
  // );

  return (
    <>
      {/* MOBILE NAVBAR (Hanya muncul di HP) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {/* Logo Kiero */}
            <img
              src="/Kiero.svg"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />

            <div className="flex flex-col">
              <h2 className="text-lg font-extrabold text-slate-600 leading-tight tracking-tight">
                KIERO TEKNOLOGI
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[1px] leading-none">
                Warehouse Management
              </span>
            </div>

            {/* <img
              src="/OT.svg"
              alt="Logo"
              className="w-10 h-10 object-contain"
            /> */}

            {/* Container Teks disusun vertikal (flex-col) */}
            {/* <div className="flex flex-col">
              <h2 className="text-lg font-extrabold text-slate-600 leading-tight tracking-tight">
                DIGITAL PRINTING
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[1px] leading-none">
                Design-Clothes-Sticker
              </span>
            </div> */}
          </div>
          {/* <span className="font-bold text-blue-600 tracking-tight">
            KIERO GUDANG
          </span> */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-slate-600"
          >
            <Menu size={24} />
          </Button>
        </div>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR UTAMA */}
      <aside
        className={`
    fixed top-0 left-0 h-screen bg-white border-r shadow-xl z-50 transition-all duration-300
    w-72 flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
    lg:translate-x-0 lg:shadow-none
  `}
      >
        {/* Header Logo */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/Kiero.svg"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />

            <div className="flex flex-col">
              <h2 className="text-lg font-extrabold text-slate-600 leading-tight tracking-tight">
                KIERO TEKNOLOGI
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[1px] leading-none">
                Warehouse Management
              </span>
            </div>

            {/* <img
              src="/Khanita.svg"
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-extrabold text-slate-600 leading-tight tracking-tight">
                DIGITAL PRINTING
              </h2>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[1px] leading-none">
                Design-Clothes-Sticker
              </span>
            </div> */}
          </div>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-slate-600"
          >
            <Menu size={24} />
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-500"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* NAVIGASI MENU (DENGAN FILTER) */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Logika Filter: Hanya tampilkan jika userData sudah ada dan role sesuai */}
          {menuItems
            .filter(
              (item) => userData && item.roles.includes(userData.user_group_id),
            )
            .map((item) => {
              const hasSubmenu = !!item.submenu;
              const isSubmenuOpen = openSubmenu === item.label;

              return (
                <div key={item.label}>
                  {hasSubmenu ? (
                    <button
                      onClick={() =>
                        setOpenSubmenu(isSubmenuOpen ? "" : item.label)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-blue-50 rounded-lg font-medium transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={20}
                          className={isSubmenuOpen ? "text-blue-600" : ""}
                        />
                        <span className={isSubmenuOpen ? "text-blue-600" : ""}>
                          {item.label}
                        </span>
                      </div>
                      {isSubmenuOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        location.pathname === item.path
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {/* Submenu Mapping */}
                  {hasSubmenu && isSubmenuOpen && (
                    <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-100 pl-2">
                      {item.submenu
                        // 1. Tambahkan filter di sini agar submenu hanya muncul sesuai role
                        .filter(
                          (sub) =>
                            !sub.roles ||
                            sub.roles.includes(userData.user_group_id),
                        )
                        .map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                              location.pathname === sub.path
                                ? "text-blue-600 bg-blue-50"
                                : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                            }`}
                          >
                            <sub.icon size={16} />
                            {sub.label}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
        </nav>

        {/* STATUS USER LOGIN */}
        <div className="p-4 border-t bg-slate-50 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
              {userData?.username ? userData.username.charAt(0) : "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">
                {userData?.username || "Guest"}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 truncate">
                {userData?.name || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-red-100"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// import { useState } from "react";
// import {
//   LayoutDashboard,
//   Users,
//   Package,
//   History,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   ChevronDown,
//   ChevronRight,
//   PlusCircle,
//   List,
//   UserPlus,
//   ShieldCheck,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Link, useLocation } from "react-router-dom";

// export default function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [openSubmenu, setOpenSubmenu] = useState(""); // Untuk melacak submenu mana yang terbuka
//   const location = useLocation();

//   const menuItems = [
//     {
//       icon: LayoutDashboard,
//       label: "Dashboard",
//       path: "/dashboard",
//     },
//     {
//       icon: Package,
//       label: "Data Barang",
//       submenu: [
//         { label: "Daftar Barang", path: "/barang", icon: List },
//         { label: "Tambah Barang", path: "/barang/tambah", icon: PlusCircle },
//       ],
//     },
//     {
//       icon: Users,
//       label: "User Management",
//       submenu: [
//         { label: "Semua User", path: "/users", icon: List },
//         { label: "Tambah User", path: "/users/tambah", icon: UserPlus },
//         { label: "Hak Akses", path: "/users/roles", icon: ShieldCheck },
//       ],
//     },
//     { icon: History, label: "Log Transaksi", path: "/logs" },
//     { icon: Settings, label: "Pengaturan", path: "/settings" },
//   ];

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   const toggleSubmenu = (label) => {
//     setOpenSubmenu(openSubmenu === label ? "" : label);
//   };

//   return (
//     <>
//       {/* TOMBOL HAMBURGER (Mobile) - Sekarang Ikut Bergeser */}
//       <div
//         className={`
//           lg:hidden fixed top-4 z-50 transition-all duration-300
//           ${isOpen ? "left-56" : "left-4"}
//         `}
//       >
//         <Button
//           variant="outline"
//           size="icon"
//           onClick={toggleSidebar}
//           className={`shadow-md border-none ${isOpen ? "bg-white text-slate-600" : "bg-blue-600 text-white"}`}
//         >
//           {isOpen ? <X size={20} /> : <Menu size={20} />}
//         </Button>
//       </div>

//       {/* OVERLAY (Mobile) */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={toggleSidebar}
//         />
//       )}

//       {/* SIDEBAR */}
//       <aside
//         className={`
//         fixed top-0 left-0 h-screen bg-white border-r shadow-sm z-40 transition-all duration-300
//         w-64 flex flex-col
//         ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0
//       `}
//       >
//         <div className="p-6 border-b">
//           <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
//             <Package size={24} /> KIERO GUDANG
//           </h2>
//         </div>

//         <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//           {menuItems.map((item) => {
//             const hasSubmenu = !!item.submenu;
//             const isSubmenuOpen = openSubmenu === item.label;
//             const isActive = location.pathname === item.path;

//             return (
//               <div key={item.label}>
//                 {hasSubmenu ? (
//                   /* ITEM DENGAN SUBMENU */
//                   <button
//                     onClick={() => toggleSubmenu(item.label)}
//                     className="w-full flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
//                   >
//                     <div className="flex items-center gap-3">
//                       <item.icon size={20} />
//                       <span>{item.label}</span>
//                     </div>
//                     {isSubmenuOpen ? (
//                       <ChevronDown size={16} />
//                     ) : (
//                       <ChevronRight size={16} />
//                     )}
//                   </button>
//                 ) : (
//                   /* ITEM BIASA */
//                   <Link
//                     to={item.path}
//                     onClick={() => setIsOpen(false)}
//                     className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
//                       isActive
//                         ? "bg-blue-600 text-white shadow-md"
//                         : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
//                     }`}
//                   >
//                     <item.icon size={20} />
//                     <span>{item.label}</span>
//                   </Link>
//                 )}

//                 {/* AREA SUBMENU */}
//                 {hasSubmenu && isSubmenuOpen && (
//                   <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-100 pl-2 transition-all">
//                     {item.submenu.map((sub) => (
//                       <Link
//                         key={sub.label}
//                         to={sub.path}
//                         onClick={() => setIsOpen(false)}
//                         className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                           location.pathname === sub.path
//                             ? "text-blue-600 bg-blue-50"
//                             : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"
//                         }`}
//                       >
//                         <sub.icon size={16} />
//                         {sub.label}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t">
//           <Button
//             variant="ghost"
//             className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-3"
//             onClick={() => {
//               localStorage.removeItem("token");
//               window.location.href = "/";
//             }}
//           >
//             <LogOut size={20} /> Keluar
//           </Button>
//         </div>
//       </aside>
//     </>
//   );
// }
