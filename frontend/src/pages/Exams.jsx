import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Exams() {
  const [exams, setExams] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch("http://localhost:8000/exams");
      const result = await response.json();
      setExams(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading exams:", error);
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

  const examList = exams || [];
  const upcomingCount = examList.length;

  // Parse exam dates (assuming format "DD-MM")
  const getExamStatus = (dateStr) => {
    const [day, month] = dateStr.split('-');
    const today = new Date();
    const examDate = new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day));
    
    if (examDate < today) return 'completed';
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7) return 'urgent';
    if (daysLeft <= 30) return 'upcoming';
    return 'scheduled';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return { color: 'var(--success)', label: '✓ Completed', bg: 'rgba(79, 172, 254, 0.2)' };
      case 'urgent':
        return { color: 'var(--danger)', label: '⚠️ Urgent', bg: 'rgba(255, 107, 107, 0.2)' };
      case 'upcoming':
        return { color: 'var(--warning)', label: '📅 Upcoming', bg: 'rgba(245, 158, 11, 0.2)' };
      default:
        return { color: 'var(--primary)', label: '📎 Scheduled', bg: 'rgba(102, 126, 234, 0.2)' };
    }
  };

  return (
    <div className="page-container">
      {/* HERO */}
      <div className="hero" style={{ background: 'var(--gradient-warning)', marginBottom: '20px', color: '#000' }}>
        <div>
          <h1>📝 Exam Schedule</h1>
          <p style={{ color: 'rgba(0, 0, 0, 0.7)' }}>Stay prepared and on top of your exam dates</p>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-label">Total Exams</div>
          <div className="stat-value">{upcomingCount}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            This semester
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-label">Urgent</div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>
            {examList.filter(e => getExamStatus(e.date) === 'urgent').length}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Within 7 days
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-label">Preparation</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>
            {Math.round((examList.filter(e => getExamStatus(e.date) !== 'completed').length / Math.max(upcomingCount, 1)) * 100)}%
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Pending
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-label">Completed</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {examList.filter(e => getExamStatus(e.date) === 'completed').length}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Already taken
          </p>
        </div>
      </div>

      {/* EXAM LIST */}
      <div className="card glass">
        <h2 style={{ marginBottom: '24px', fontSize: '18px' }}>📋 All Exams</h2>
        
        {examList.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
            <p>No exams scheduled at the moment</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {examList.map((exam, idx) => {
              const status = getExamStatus(exam.date);
              const badge = getStatusBadge(status);

              return (
                <div
                  key={idx}
                  className="card glass-sm"
                  style={{
                    padding: '16px',
                    borderLeft: `4px solid ${badge.color}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '16px', flex: 1 }}>
                    <div style={{ fontSize: '32px' }}>📝</div>
                    <div>
                      <h3 style={{ fontSize: '16px', marginBottom: '8px', fontWeight: '600' }}>
                        {exam.subject}
                      </h3>
                      <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} />
                          {exam.date}
                        </div>
                        {exam.time && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} />
                            {exam.time}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: badge.bg,
                    color: badge.color,
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}>
                    {badge.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PREPARATION TIPS */}
      <div className="grid-2">
        <div className="card glass">
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <AlertCircle size={20} style={{ color: 'var(--warning)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <h3 style={{ marginBottom: '8px' }}>Study Tips</h3>
              <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li>✓ Create a study schedule 2 weeks before</li>
                <li>✓ Practice previous year papers</li>
                <li>✓ Join study groups for difficult topics</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card glass">
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <CheckCircle2 size={20} style={{ color: 'var(--success)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <h3 style={{ marginBottom: '8px' }}>Exam Day Checklist</h3>
              <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                <li>✓ Check admit card & venue</li>
                <li>✓ Reach 15 mins early</li>
                <li>✓ Bring required documents</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* LEGEND */}
      <div className="card glass">
        <h3 style={{ marginBottom: '16px' }}>📌 Status Legend</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {[
            { status: 'Urgent', color: 'var(--danger)', label: '⚠️ Within 7 days' },
            { status: 'Upcoming', color: 'var(--warning)', label: '📅 Within 30 days' },
            { status: 'Scheduled', color: 'var(--primary)', label: '📎 Beyond 30 days' },
            { status: 'Completed', color: 'var(--success)', label: '✓ Already taken' },
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--glass-hover)',
              borderLeft: `4px solid ${item.color}`,
            }}>
              <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}>
                {item.status}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}