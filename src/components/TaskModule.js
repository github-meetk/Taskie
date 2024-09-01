import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../apiConnector";
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
  const [editTask, setEditTask] = useState(null); // State to handle task editing
  const navigate = useNavigate();

  console.log(editTask?.status);

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
    setEditTask(task); // Set the task to be edited
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(editTask);
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
      setEditTask(null); // Reset edit task
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center w-full justify-between">
        <h1 className="text-3xl font-bold mb-4">Tasks</h1>
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors duration-200"
        >
          ← Back to Home
        </div>
      </div>

      {(userData.role === "admin" || userData.permissions.canCreateTask) && (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-wrap -mx-2 mb-4">
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <input
                type="text"
                name="name"
                placeholder="Task name"
                value={newTask.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="w-full md:w-1/3 px-2">
              <input
                type="date"
                name="due_date"
                value={newTask.due_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create New Task
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
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Due Date</th>
              {(userData.role === "admin" ||
                userData.permissions.canCreateTask) && (
                <th className="text-left p-2">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tasks?.map((task) => (
              <tr key={task._id} className="border-b">
                <td className="p-2">{task.name}</td>
                <td className="p-2">{task.status}</td>
                <td className="p-2">
                  {new Date(task.due_date).toLocaleDateString()}
                </td>
                {(userData.role === "admin" ||
                  userData.permissions.canCreateTask) && (
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200 me-4"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
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

      {editTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-2/5 shadow-lg rounded-md bg-white">
            <form onSubmit={handleUpdate} className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
              <div className="flex flex-wrap -mx-2 mb-4">
                {/* Task Name Input Field */}
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <input
                    type="text"
                    name="name"
                    placeholder="Task name"
                    value={editTask.name} // Pre-filling the input with the current task name
                    onChange={(e) =>
                      setEditTask({ ...editTask, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                {/* Task Status Input Field */}
                <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
                  <select
                    name="status"
                    value={editTask.status} // Pre-filling the input with the current task status
                    onChange={(e) =>
                      setEditTask({ ...editTask, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    {/* Ensure 'completed' is an option */}
                  </select>
                </div>
                {/* Task Due Date Input Field */}
                <div className="w-full md:w-1/3 px-2">
                  <input
                    type="date"
                    name="due_date"
                    value={
                      editTask.due_date
                        ? new Date(editTask.due_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    } // Ensure the date is formatted as YYYY-MM-DD
                    onChange={(e) =>
                      setEditTask({ ...editTask, due_date: e.target.value })
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
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => setEditTask(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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

export default TaskModule;
