import React, { useEffect, useState } from "react";
import { apiConnector } from "../apiConnector";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Permission = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [companyUpdates, setCompanyUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        BASE_URL + "/api/v1/admin/users",
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setUsers(response?.data);
    } catch (error) {
      toast.error("Failed to fetch Users");
      console.error(error);
    }
    setLoading(false);
  };

  const fetchCompanyUpdates = async () => {
    try {
      const response = await apiConnector("GET", BASE_URL + "/api/v1/updates");
      setCompanyUpdates(response.data);
    } catch (error) {
      toast.error("Failed to fetch company updates");
      console.error("Error fetching updates:", error);
    }
  };

  const updateUserPermissions = async () => {
    if (!selectedUser) return;

    try {
      await apiConnector(
        "PUT",
        BASE_URL + "/api/v1/admin/updatePermissions",
        {
          userId: selectedUser._id,
          canCreateLocation: selectedUser.permissions.canCreateLocation,
          canCreateTask: selectedUser.permissions.canCreateTask,
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("Permissions updated successfully");
      fetchUsers(); // Refresh the user list to reflect changes
      setSelectedUser(null); // Close the modal after update
    } catch (error) {
      toast.error("Failed to update permissions");
      console.error("Failed to update permissions:", error);
    }
  };

  const handlePermissionChange = (permissionKey) => {
    setSelectedUser((prevUser) => ({
      ...prevUser,
      permissions: {
        ...prevUser.permissions,
        [permissionKey]: !prevUser.permissions[permissionKey],
      },
    }));
  };

  const handleAddUpdate = async () => {
    if (!newUpdate.title.trim() || !newUpdate.description.trim()) {
      toast.error("Both title and description are required");
      return;
    }

    try {
      await apiConnector("POST", `${BASE_URL}/api/v1/addUpdate`, newUpdate, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("Company update added successfully");
      setNewUpdate({ title: "", description: "" });
      fetchCompanyUpdates(); // Refresh the updates list
    } catch (error) {
      toast.error("Failed to add update");
      console.error("Error adding update:", error);
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    try {
      await apiConnector(
        "DELETE",
        `${BASE_URL}/api/v1/deleteUpdate/${updateId}`,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      );
      toast.success("Update deleted successfully");
      fetchCompanyUpdates(); // Refresh the updates list
    } catch (error) {
      toast.error("Failed to delete update");
      console.error("Error deleting update:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanyUpdates();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Admin Dashboard
        </h1>
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-700 text-lg font-semibold"
        >
          ← Back to Home
        </button>
      </div>

      {/* Users Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Manage Users
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            <span className="ml-4 text-lg font-medium text-gray-600">
              Loading...
            </span>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg">
            <table className="w-full text-left text-sm text-gray-600 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-700">
                    Username
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-700">Email</th>
                  <th className="px-6 py-4 font-medium text-gray-700">
                    Permissions
                  </th>
                  <th className="px-6 py-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-4 text-gray-500">
                        <span>
                          Create Location:{" "}
                          {user.permissions.canCreateLocation ? "Yes" : "No"}
                        </span>
                        <span>
                          Create Task:{" "}
                          {user.permissions.canCreateTask ? "Yes" : "No"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Update Permissions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Company Updates Section */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Company Updates
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Update
          </h3>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={newUpdate.title}
              onChange={(e) =>
                setNewUpdate({ ...newUpdate, title: e.target.value })
              }
              placeholder="Update Title"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500"
            />
            <textarea
              value={newUpdate.description}
              onChange={(e) =>
                setNewUpdate({ ...newUpdate, description: e.target.value })
              }
              placeholder="Update Description"
              className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500"
            />
            <button
              onClick={handleAddUpdate}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Update
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg">
          <table className="w-full text-left text-sm text-gray-600 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-700">Title</th>
                <th className="px-6 py-4 font-medium text-gray-700">
                  Description
                </th>
                <th className="px-6 py-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companyUpdates.map((update) => (
                <tr key={update._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{update.title}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {update.description}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUpdate(update._id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Update User Permissions Modal */}
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Update Permissions for {selectedUser.username}
            </h2>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedUser.permissions.canCreateLocation}
                  onChange={() => handlePermissionChange("canCreateLocation")}
                  className="mr-2"
                />
                <label className="text-gray-700">Create Location</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedUser.permissions.canCreateTask}
                  onChange={() => handlePermissionChange("canCreateTask")}
                  className="mr-2"
                />
                <label className="text-gray-700">Create Task</label>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={updateUserPermissions}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permission;
