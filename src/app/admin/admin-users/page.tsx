"use client";
import { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

interface AdminUser {
  id: string;
  username: string;
  status: string;
  isSuper: boolean;
  role: string;
}

export default function AdminUserManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<{
    id: string;
    loading: boolean;
  } | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admin/get-admins");
      if (!response.ok) {
        throw new Error("Failed to fetch admin users");
      }
      const data = await response.json();
      setAdmins(data.admins);
    } catch (error) {
      console.error("Error fetching admin users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setUpdateStatus({ id, loading: true });
    
    try {
      const response = await fetch("/api/admin/update-admin-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update admin status");
      }
      
      // Update local state
      setAdmins(admins.map(admin => 
        admin.id === id ? { ...admin, status: newStatus } : admin
      ));
    } catch (error) {
      console.error("Error updating admin status:", error);
    } finally {
      setUpdateStatus(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin User Management</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-3xl text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Super Admin</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">{admin.username}</td>
                  <td className="py-3 px-4">{admin.role || "N/A"}</td>
                  <td className="py-3 px-4">
                    {admin.isSuper ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-gray-500">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        admin.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleAdminStatus(admin.id, admin.status)}
                      disabled={updateStatus?.id === admin.id || admin.isSuper}
                      className={`p-2 rounded-full ${
                        admin.status === "active"
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      } ${
                        admin.isSuper ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title={admin.isSuper ? "Cannot modify super admin status" : ""}
                    >
                      {updateStatus?.id === admin.id ? (
                        <FaSpinner className="animate-spin" />
                      ) : admin.status === "active" ? (
                        <FaTimes />
                      ) : (
                        <FaCheck />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}