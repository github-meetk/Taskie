import React from "react";
import { Link } from "react-router-dom";

const moduleData = [
  { name: "Tasks", icon: "📝", path: "/tasks", color: "bg-blue-500" },
  { name: "Locations", icon: "📍", path: "/locations", color: "bg-green-500" },
];

// Sample data for additional features
const currentStats = {
  tasks: 8,
  locations: 3,
};

const companyUpdates = [
  "Quarterly meeting on 2024-09-10",
  "New project launch scheduled for October",
  "Team-building event on 2024-09-15",
];

const selfReminders = [
  { task: "Design new logo", dueDate: "2024-09-15", link: "/tasks" },
  { task: "User testing", dueDate: "2024-08-30", link: "/tasks" },
];

const Dashboard = () => {
  return (
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
          <span className="text-5xl font-bold">{currentStats.tasks}</span>
          <span className="text-lg">Tasks</span>
        </div>
        <div className="bg-white text-gray-800 rounded-2xl shadow p-6 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold">{currentStats.locations}</span>
          <span className="text-lg">Locations</span>
        </div>
      </div>

      {/* Company Updates and Announcements */}
      <div className="bg-gray-100 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Company Updates</h2>
        <ul className="list-disc list-inside">
          {companyUpdates.map((update, index) => (
            <li key={index} className="text-lg">
              {update}
            </li>
          ))}
        </ul>
      </div>

      {/* Self-Reminders */}
      <div className="bg-yellow-100 p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Reminders</h2>
        <ul className="list-none">
          {selfReminders.map((reminder, index) => (
            <li key={index} className="mb-2">
              <Link
                to={reminder.link}
                className="text-blue-600 hover:underline"
              >
                {reminder.task} - Due by {reminder.dueDate}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
