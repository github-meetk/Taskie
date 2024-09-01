import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiConnector } from "../apiConnector";
import toast from "react-hot-toast";

const moduleData = [
  { name: "Tasks", icon: "📝", path: "/tasks", color: "bg-blue-500" },
  { name: "Locations", icon: "📍", path: "/locations", color: "bg-green-500" },
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
    <div className="flex w-full h-auto justify-center items-center">
      {loading ? (
        <div role="status">
          <svg
            aria-hidden="true"
            class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Welcome to Taskie, John Doe!
          </h1>
          {/* Modules */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              {moduleData.map((module) => (
                <Link
                  key={module.name}
                  to={module.path}
                  className={`${module.color} hover:opacity-90 text-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105`}
                >
                  <span className="text-4xl mb-2">{module.icon}</span>
                  <span className="text-xl font-semibold">{module.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Current Task and Location Visualization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white text-gray-800 rounded-2xl shadow p-6 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold">{tasksCount}</span>
              <span className="text-lg">Pending Tasks</span>
            </div>
            <div className="bg-white text-gray-800 rounded-2xl shadow p-6 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold">{locationsCount}</span>
              <span className="text-lg">Locations</span>
            </div>
          </div>

          {/* Company Updates and Announcements */}
          <div className="bg-gray-100 p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Company Updates</h2>
            <ul className="list-disc list-inside">
              {companyUpdates.map((update, index) => (
                <div key={index} className="text-lg">
                  <h3 className="text-lg font-semibold">{update.title}</h3>
                  <p>{update.description}</p>
                </div>
              ))}
            </ul>
          </div>

          {/* Self-Reminders */}
          <div className="bg-yellow-100 p-6 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Reminders</h2>
            <ul className="list-none">
              {tasks.map((task) => (
                <li key={task._id} className="mb-2">
                  <Link to="/tasks" className="text-blue-600 hover:underline">
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
