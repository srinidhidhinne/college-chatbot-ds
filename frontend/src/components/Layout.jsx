import { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  FileText,
  Calendar,
  BookOpen,
  Bell,
  User
} from "lucide-react";

import Dashboard from "../pages/Dashboard";
import Chatbot from "../pages/Chatbot";
import Attendance from "../pages/Attendance";
import Marks from "../pages/Marks";
import Exams from "../pages/Exams";
import Notes from "../pages/Notes";
import Notifications from "../pages/Notifications";
import Profile from "../pages/Profile";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Chatbot", icon: Bot },
  { name: "Attendance", icon: BarChart3 },
  { name: "Marks", icon: FileText },
  { name: "Exams", icon: Calendar },
  { name: "Notes", icon: BookOpen },
  { name: "Notifications", icon: Bell },
  { name: "Profile", icon: User }
];

export default function Layout() {
  const [active, setActive] = useState("Dashboard");

  const renderPage = () => {
    switch (active) {
      case "Dashboard": return <Dashboard />;
      case "Chatbot": return <Chatbot />;
      case "Attendance": return <Attendance />;
      case "Marks": return <Marks />;
      case "Exams": return <Exams />;
      case "Notes": return <Notes />;
      case "Notifications": return <Notifications />;
      case "Profile": return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">

      <div className="sidebar">
        <div className="logo">🎓 College AI</div>

        <div className="menu">
          {menu.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`menu-item ${active === item.name ? "active" : ""}`}
                onClick={() => setActive(item.name)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="main-content">
        {renderPage()}
      </div>

    </div>
  );
}