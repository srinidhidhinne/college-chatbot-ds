import { useState, useEffect } from "react";
import { Bell, AlertCircle, CheckCircle2, Info, BookOpen, Calendar } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8000/notifications");
      const result = await response.json();
      setNotifications(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="loading" />
      </div>
    );
  }

  const notifList = notifications || [];

  // Default notifications if none loaded
  const defaultNotifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Attendance Warning',
      message: 'Your attendance in PPS is below 75%. Please attend classes regularly.',
      timestamp: '2024-01-04 10:30 AM',
      read: false,
    },
    {
      id: 2,
      type: 'exam',
      title: 'Exam Scheduled',
      message: 'Your Maths exam is scheduled for 10-05 at 9:00 AM. Start preparation now!',
      timestamp: '2024-01-03 02:15 PM',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'Assignment Due',
      message: 'Your Data Structures assignment is due tomorrow at 5:00 PM.',
      timestamp: '2024-01-02 11:45 AM',
      read: true,
    },
    {
      id: 4,
      type: 'success',
      title: 'Marks Published',
      message: 'Marks for your Programming quiz have been published. Check your portal!',
      timestamp: '2024-01-01 09:20 AM',
      read: true,
    },
  ];

  const displayNotifications = notifList.length > 0 ? notifList : defaultNotifications;
  const unreadCount = displayNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'alert':
        return <AlertCircle size={20} style={{ color: 'var(--danger)' }} />;
      case 'success':
        return <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />;
      case 'exam':
        return <Calendar size={20} style={{ color: 'var(--warning)' }} />;
      case 'assignment':
        return <BookOpen size={20} style={{ color: 'var(--info)' }} />;
      default:
        return <Info size={20} style={{ color: 'var(--primary)' }} />;
    }
  };

  const getNotificationBg = (type) => {
    switch(type) {
      case 'alert':
        return 'rgba(255, 107, 107, 0.1)';
      case 'success':
        return 'rgba(79, 172, 254, 0.1)';
      case 'exam':
        return 'rgba(245, 158, 11, 0.1)';
      case 'assignment':
        return 'rgba(102, 126, 234, 0.1)';
      default:
        return 'var(--glass-hover)';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? displayNotifications.filter(n => !n.read)
    : displayNotifications;

  return (
    <div className="page-container">
      {/* HERO */}
      <div className="hero" style={{ background: 'var(--gradient-primary)', marginBottom: '20px' }}>
        <div>
          <h1>🔔 Notifications</h1>
          <p>Stay updated with your academic alerts and announcements</p>
        </div>
        {unreadCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--danger)',
            color: 'white',
            fontSize: '20px',
            fontWeight: '700',
          }}>
            {unreadCount}
          </div>
        )}
      </div>

      {/* STATISTICS */}
      <div className="grid">
        <div className="stat-card">
          <div className="stat-icon">📬</div>
          <div className="stat-label">Total</div>
          <div className="stat-value">{displayNotifications.length}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            All notifications
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📭</div>
          <div className="stat-label">Unread</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{unreadCount}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Need attention
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-label">Alerts</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>
            {displayNotifications.filter(n => n.type === 'alert').length}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Important
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-label">Read</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {displayNotifications.filter(n => n.read).length}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Viewed
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          className="btn btn-sm"
          style={{
            background: filter === 'all' ? 'var(--gradient-primary)' : 'var(--glass-hover)',
            color: filter === 'all' ? 'white' : 'var(--text-secondary)',
            border: filter === 'all' ? 'none' : '1px solid var(--border-color)',
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className="btn btn-sm"
          style={{
            background: filter === 'unread' ? 'var(--gradient-secondary)' : 'var(--glass-hover)',
            color: filter === 'unread' ? 'white' : 'var(--text-secondary)',
            border: filter === 'unread' ? 'none' : '1px solid var(--border-color)',
          }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredNotifications.length === 0 ? (
          <div className="card glass" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p style={{ color: 'var(--text-muted)' }}>No notifications to show</p>
          </div>
        ) : (
          filteredNotifications.map((notif, idx) => (
            <div
              key={notif.id || idx}
              className="card glass-sm"
              style={{
                padding: '16px',
                background: notif.read ? 'var(--glass-hover)' : getNotificationBg(notif.type),
                borderLeft: notif.read ? 'none' : `4px solid ${notif.type === 'alert' ? 'var(--danger)' : notif.type === 'success' ? 'var(--success)' : 'var(--warning)'}`,
                opacity: notif.read ? 0.7 : 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {getNotificationIcon(notif.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '6px',
                  }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--danger)',
                        flexShrink: 0,
                      }} />
                    )}
                  </div>

                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    margin: '0 0 8px 0',
                    lineHeight: '1.5',
                  }}>
                    {notif.message}
                  </p>

                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                  }}>
                    {notif.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* TIPS */}
      <div className="card glass" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Notification Tips</h3>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
              <li>✓ Check notifications regularly to stay updated</li>
              <li>✓ Act on alerts immediately to avoid missing deadlines</li>
              <li>✓ Enable push notifications for real-time updates</li>
              <li>✓ Mark important notifications for future reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}