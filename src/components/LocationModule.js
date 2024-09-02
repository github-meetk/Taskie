import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const LocationModule = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    capacity: "",
  });
  const [editLocation, setEditLocation] = useState(null);
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        BASE_URL + "/api/v1/getLocation"
      );
      setLocations(response?.data);
    } catch (error) {
      toast.error("Failed to fetch locations");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    setNewLocation({ ...newLocation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "POST",
        BASE_URL + "/api/v1/createLocation",
        newLocation
      );
      setLocations([...locations, response.data]);
      setNewLocation({ name: "", address: "", capacity: "" });
      toast.success("Location created successfully");
    } catch (error) {
      toast.error("Failed to create location");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiConnector("DELETE", BASE_URL + `/api/v1/deleteLocation/${id}`);
      setLocations(locations.filter((location) => location._id !== id));
      toast.success("Location deleted");
    } catch (error) {
      toast.error("Failed to delete location");
      console.error(error);
    }
  };

  const handleEdit = (location) => {
    setEditLocation(location);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "PUT",
        BASE_URL + "/api/v1/admin/updateLocation",
        {
          locationId: editLocation._id,
          name: editLocation.name,
          address: editLocation.address,
          capacity: editLocation.capacity,
        }
      );
      setLocations(
        locations.map((loc) =>
          loc._id === editLocation._id ? response.data : loc
        )
      );
      setEditLocation(null);
      toast.success("Location updated successfully");
    } catch (error) {
      toast.error("Failed to update location");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Locations</h2>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>

        {(userData.role === "admin" ||
          userData.permissions.canCreateLocation) && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg mb-8"
          >
            <h3 className="text-xl font-semibold mb-4">Add New Location</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Location name"
                value={newLocation.name}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={newLocation.address}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={newLocation.capacity}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
            >
              Add Location
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <div
                key={location._id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Address: {location.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    Capacity: {location.capacity}
                  </p>
                </div>
                {(userData.role === "admin" ||
                  userData.permissions.canCreateLocation) && (
                  <div className="flex mt-4 space-x-4">
                    <button
                      onClick={() => handleEdit(location)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(location._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {editLocation && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-1/2">
              <h3 className="text-2xl font-semibold mb-4">Edit Location</h3>
              <form onSubmit={handleUpdate}>
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Location name"
                    value={editLocation.name}
                    onChange={(e) =>
                      setEditLocation({ ...editLocation, name: e.target.value })
                    }
                    className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={editLocation.address}
                    onChange={(e) =>
                      setEditLocation({
                        ...editLocation,
                        address: e.target.value,
                      })
                    }
                    className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={editLocation.capacity}
                    onChange={(e) =>
                      setEditLocation({
                        ...editLocation,
                        capacity: e.target.value,
                      })
                    }
                    className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditLocation(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-500 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LocationModule;
