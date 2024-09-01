import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const LocationModule = () => {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: "",
    address: "",
    capacity: "",
  });
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [editLocation, setEditLocation] = useState(null); // State to handle location editing
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
        BASE_URL + "http://localhost:4000/api/v1/createLocation",
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
    setEditLocation(location); // Set the location to be edited
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
      setEditLocation(null); // Reset edit location
      toast.success("Location updated successfully");
    } catch (error) {
      toast.error("Failed to update location");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center w-full justify-between">
        <h1 className="text-3xl font-bold mb-4">Locations</h1>
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors duration-200"
        >
          ← Back to Home
        </div>
      </div>

      {(userData.role === "admin" ||
        userData.permissions.canCreateLocation) && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <input
                type="text"
                name="name"
                placeholder="Location name"
                value={newLocation.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={newLocation.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="w-full md:w-1/3 px-2">
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={newLocation.capacity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Create New Location
          </button>
        </form>
      )}

      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <button
            disabled
            type="button"
            className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="#1C64F2"
              />
            </svg>
            Loading...
          </button>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Address</th>
              <th className="text-left p-2">Capacity</th>
              {(userData.role === "admin" ||
                userData.permissions.canCreateLocation) && (
                <th className="text-left p-2">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {locations?.map((location) => (
              <tr key={location._id} className="border-b">
                <td className="p-2">{location.name}</td>
                <td className="p-2">{location.address}</td>
                <td className="p-2">{location.capacity}</td>
                {(userData.role === "admin" ||
                  userData.permissions.canCreateLocation) && (
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(location)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200 me-4"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(location._id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editLocation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/5 shadow-lg rounded-md bg-white">
            <form onSubmit={handleUpdate} className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Edit Location</h2>
              <div className="flex flex-wrap -mx-2 mb-4">
                {/* Location Name Input Field */}
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <input
                    type="text"
                    name="name"
                    placeholder="Location name"
                    value={editLocation.name} // Pre-filling the input with the current location name
                    onChange={(e) =>
                      setEditLocation({ ...editLocation, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                {/* Address Input Field */}
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={editLocation.address} // Pre-filling the input with the current address
                    onChange={(e) =>
                      setEditLocation({
                        ...editLocation,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                {/* Capacity Input Field */}
                <div className="w-full md:w-1/3 px-2">
                  <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={editLocation.capacity} // Pre-filling the input with the current capacity
                    onChange={(e) =>
                      setEditLocation({
                        ...editLocation,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update Location
                </button>
                <button
                  type="button"
                  onClick={() => setEditLocation(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationModule;
