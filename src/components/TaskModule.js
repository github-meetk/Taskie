import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const TaskModule = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: "",
    status: "pending",
    due_date: "",
  });
  const [editTask, setEditTask] = useState(null);
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await apiConnector("GET", BASE_URL + "/api/v1/getTask");
      setTasks(response?.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "POST",
        BASE_URL + "/api/v1/createTask",
        newTask
      );
      setTasks([...tasks, response.data]);
      setNewTask({ name: "", status: "pending", due_date: "" });
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiConnector("DELETE", BASE_URL + `/api/v1/deleteTask/${id}`);
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector(
        "PUT",
        BASE_URL + `/api/v1/admin/updateTask`,
        {
          taskId: editTask._id,
          name: editTask.name,
          status: editTask.status,
          due_date: editTask.due_date,
        }
      );
      setTasks(
        tasks.map((task) => (task._id === editTask._id ? response.data : task))
      );
      setEditTask(null);
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Tasks</h2>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>

        {(userData.role === "admin" || userData.permissions.canCreateTask) && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg mb-8"
          >
            <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Task name"
                value={newTask.name}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="date"
                name="due_date"
                value={newTask.due_date}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
            >
              Add Task
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {task.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Due Date: {new Date(task.due_date).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      task.status === "completed"
                        ? "text-green-600"
                        : task.status === "in-progress"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    Status: {task.status}
                  </p>
                </div>
                {(userData.role === "admin" ||
                  userData.permissions.canCreateTask) && (
                  <div className="flex mt-4 space-x-4">
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
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

        {editTask && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-1/2">
              <h3 className="text-2xl font-semibold mb-4">Edit Task</h3>
              <form onSubmit={handleUpdate}>
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Task name"
                    value={editTask.name}
                    onChange={(e) =>
                      setEditTask({ ...editTask, name: e.target.value })
                    }
                    className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <select
                    name="status"
                    value={editTask.status}
                    onChange={(e) =>
                      setEditTask({ ...editTask, status: e.target.value })
                    }
                    className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <input
                    type="date"
                    name="due_date"
                    value={
                      editTask.due_date
                        ? new Date(editTask.due_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setEditTask({ ...editTask, due_date: e.target.value })
                    }
                    className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditTask(null)}
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

export default TaskModule;
