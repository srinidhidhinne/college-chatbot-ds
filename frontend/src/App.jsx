import React, { useState } from "react";
import "./index.css";

// Pages / Modules
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import Exams from "./pages/Exams";
import Notes from "./pages/Notes";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Clubs from "./pages/Clubs";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "chatbot", label: "Chatbot", icon: "🤖" },
  { key: "attendance", label: "Attendance", icon: "📅" },
  { key: "marks", label: "Marks", icon: "📈" },
  { key: "exams", label: "Exams", icon: "📝" },
  { key: "notes", label: "Notes", icon: "📚" },
  { key: "clubs", label: "Clubs", icon: "🎭" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "profile", label: "Profile", icon: "👤" },
];

export default function App() {
  const [active, setActive] = useState("dashboard");

  const renderPage = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard />;
      case "chatbot":
        return <Chatbot currentUser="student" />;
      case "attendance":
        return <Attendance />;
      case "marks":
        return <Marks />;
      case "exams":
        return <Exams />;
      case "notes":
        return <Notes />;
      case "clubs":
        return <Clubs />;
      case "notifications":
        return <Notifications />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar glass">
        <div className="logo">🎓 College Portal</div>
        <nav className="menu">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`menu-item ${active === item.key ? "active" : ""}`}
              onClick={() => setActive(item.key)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>Smart AI Dashboard</p>
        </div>
      </aside>
      <main className="main-content">
        <div className="topbar glass">
          <h2 className="page-title">{menuItems.find((m) => m.key === active)?.label}</h2>
        </div>
        {renderPage()}
      </main>
    </div>
  );
}
