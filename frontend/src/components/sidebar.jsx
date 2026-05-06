import {
  Bell,
  Settings,
  Search,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

function Topbar() {

  const [modal, setModal] = useState(null);
  // null | "notifications" | "settings" | "profile"

  // =========================
  // CLOSE ON ESC KEY
  // =========================
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setModal(null);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // =========================
  // CLOSE MODAL ON OUTSIDE CLICK
  // =========================
  const closeModal = () => setModal(null);

  return (
    <div className="topbar">

      {/* SEARCH */}
      <div className="search-box">
        <Search size={20} />
        <input type="text" placeholder="Search..." />
      </div>

      {/* ACTIONS */}
      <div className="topbar-actions">

        {/* NOTIFICATIONS */}
        <button className="icon-btn" onClick={() => setModal("notifications")}>
          <Bell size={22} />
        </button>

        {/* SETTINGS */}
        <button className="icon-btn" onClick={() => setModal("settings")}>
          <Settings size={22} />
        </button>

        {/* PROFILE */}
        <div className="profile-mini" onClick={() => setModal("profile")}>
          <div className="profile-circle">N</div>
          <div>
            <h4>Nidhi</h4>
            <p>Student</p>
          </div>
        </div>

      </div>

      {/* =========================
          MODAL WRAPPER
      ========================= */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>

          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">

              <h2>
                {modal === "notifications" && "Notifications"}
                {modal === "settings" && "Settings"}
                {modal === "profile" && "Student Profile"}
              </h2>

              <X size={22} className="close-icon" onClick={closeModal} />

            </div>

            {/* =========================
                NOTIFICATIONS
            ========================= */}
            {modal === "notifications" && (
              <div className="modal-content">
                <div className="notification-item">📢 Robotics Club meeting tomorrow</div>
                <div className="notification-item">📚 New Notes Uploaded</div>
                <div className="notification-item">📝 Mid Exams start next week</div>
              </div>
            )}

            {/* =========================
                SETTINGS
            ========================= */}
            {modal === "settings" && (
              <div className="modal-content">

                <div className="setting-row">
                  <span>Dark Mode</span>
                  <button className="small-btn">ON</button>
                </div>

                <div className="setting-row">
                  <span>AI Voice</span>
                  <button className="small-btn">ENABLE</button>
                </div>

                <div className="setting-row">
                  <span>Notifications</span>
                  <button className="small-btn">ACTIVE</button>
                </div>

              </div>
            )}

            {/* =========================
                PROFILE
            ========================= */}
            {modal === "profile" && (
              <div className="profile-modal">

                <div className="big-avatar">N</div>

                <h2>Nidhi Sharma</h2>
                <p>CSE - AI & ML</p>

                <div className="profile-info">
                  <div>📧 nidhi@gmail.com</div>
                  <div>📱 +91 9876543210</div>
                  <div>🎓 3rd Year</div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Topbar;