import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";

const moduleData = [
  { name: "Tasks", icon: "📝", path: "/tasks", color: "bg-indigo-600" },
  { name: "Locations", icon: "📍", path: "/locations", color: "bg-teal-600" },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [tasksCount, setTasksCount] = useState();
  const [locationsCount, setLocationsCount] = useState();
  const [companyUpdates, setCompanyUpdates] = useState();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchCount = async () => {
    setLoading(true);
    try {
      const taskResponse = await apiConnector(
        "GET",
        BASE_URL + "/api/v1/getTask"
      );
      const locationResponse = await apiConnector(
        "GET",
        BASE_URL + "/api/v1/getLocation"
      );

      const pendingTasks = taskResponse?.data.filter(
        (task) => task.status === "pending"
      );

      setTasks(pendingTasks);
      setTasksCount(taskResponse?.data.length);
      setLocationsCount(locationResponse?.data.length);
    } catch (error) {
      toast.error("Failed to fetch data");
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

  useEffect(() => {
    fetchCount();
    fetchCompanyUpdates();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-indigo-600"></div>
        </div>
      ) : (
        <div className="container max-w-6xl mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {moduleData.map((module) => (
              <Link
                key={module.name}
                to={module.path}
                className={`flex flex-col items-center justify-center h-48 rounded-xl shadow-xl transform transition-all duration-300 hover:scale-105 ${module.color}`}
              >
                <span className="text-5xl">{module.icon}</span>
                <span className="text-2xl font-bold mt-4 text-white">
                  {module.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                Tasks
              </h2>
              <p className="text-6xl font-bold text-indigo-600">{tasksCount}</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                Locations
              </h2>
              <p className="text-6xl font-bold text-teal-600">
                {locationsCount}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg shadow-md mb-12">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">
              Company Updates
            </h2>
            <ul className="space-y-4">
              {companyUpdates.map((update, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                    {update.title}
                  </h3>
                  <p className="text-gray-700">{update.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-700 mb-6">
              Your Reminders
            </h2>
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <Link to="/tasks" className="text-blue-500 hover:underline">
                    {task.name} - Due by{" "}
                    {new Date(task.due_date).toLocaleDateString()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
