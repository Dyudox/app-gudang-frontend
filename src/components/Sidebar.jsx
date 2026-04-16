import { useEffect, useState } from "react";
import {
  User,
  LayoutDashboard,
  Users,
  Package,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  List,
  PlusCircle,
  UserPlus,
  ShieldCheck,
  TagIcon,
  TagsIcon,
  LucideTags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState("");
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    {
      icon: Package,
      label: "Data Barang",
      submenu: [
        { label: "Daftar Barang", path: "/barang", icon: List },
        { label: "Kategori Barang", path: "/kategori", icon: LucideTags },
        { label: "Tambah Barang", path: "/barang/tambah", icon: PlusCircle },
      ],
    },
    {
      icon: Users,
      label: "User Management",
      submenu: [
        { label: "Semua User", path: "/users", icon: List },
        { label: "Tambah User", path: "/users/tambah", icon: UserPlus },
        { label: "Hak Akses", path: "/users/roles", icon: ShieldCheck },
      ],
    },
    { icon: History, label: "Log Transaksi", path: "/logs" },
    { icon: Settings, label: "Pengaturan", path: "/settings" },
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

  return (
    <>
      {/* MOBILE NAVBAR (Hanya muncul di HP) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-slate-600"
          >
            <Menu size={24} />
          </Button>
          <span className="font-bold text-blue-600 tracking-tight">
            KIERO GUDANG
          </span>
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
        {/* Header Sidebar dengan Tombol Close di HP */}
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Package size={24} /> KIERO GUDANG
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
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

                {hasSubmenu && isSubmenuOpen && (
                  <div className="ml-9 mt-1 space-y-1 border-l-2 border-slate-100 pl-2">
                    {item.submenu.map((sub) => (
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

        {/* <div className="p-4 border-t bg-slate-50/50">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-3 font-semibold"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            <LogOut size={20} /> LogOut
          </Button>
        </div> */}

        {/* STATUS USER LOGIN (DINAMIS) */}
        <div className="p-4 border-t bg-slate-50 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            {/* Avatar otomatis ambil huruf pertama dari name "Manager" (huruf M) */}
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
              {userData.username ? userData.username.charAt(0) : "U"}
            </div>

            <div className="flex-1 overflow-hidden">
              {/* Menampilkan "Manager" */}
              <p className="text-sm font-bold text-slate-800 truncate">
                {userData.username || "username"}
              </p>
              {/* Menampilkan "kiero_admin" sebagai sub-label */}
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 truncate">
                {userData.name || "name"}
              </p>
            </div>
          </div>

          <button
            variant="ghost"
            // className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 gap-3 font-semibold"
            onClick={handleLogout}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-red-100"
          >
            <LogOut size={16} />
            Logout
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
