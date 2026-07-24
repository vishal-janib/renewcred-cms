"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { logout } from "../store/slices/authSlice";

export default function AdminSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-8">RenewCred CMS</h2>

      <nav className="space-y-3">
        <Link
          href="/dashboard"
          className="block px-3 py-2 rounded hover:bg-gray-800"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/pages/new"
          className="block px-3 py-2 rounded hover:bg-gray-800"
        >
          Create Page
        </Link>

        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
