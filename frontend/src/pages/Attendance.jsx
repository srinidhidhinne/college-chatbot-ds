import { useEffect, useState } from "react";
import { ClipboardCheck, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Attendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch("http://localhost:8000/attendance");
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading attendance:", error);
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

  const subjects = data?.subjects || [];

  const getStatusColor = (percent) => {
    if (percent >= 75) return { color: 'var(--success)', label: '✓ Safe' };
    if (percent >= 65) return { color: 'var(--warning)', label: '⚠️ At Risk' };
    return { color: 'var(--danger)', label: '✗ Critical' };
  };

  const chartData = subjects.map(s => ({
    name: s.name,
    percentage: s.percentage,
    attended: s.attended,
    total: s.total,
  }));

  const overallStatus = getStatusColor(data?.overall || 0);

  return (
    <div className="page-container">
      {/* HERO */}
      <div className="hero" style={{ background: 'var(--gradient-secondary)', marginBottom: '20px' }}>
        <div>
          <h1>📅 Attendance Tracker</h1>
          <p>Monitor your subject-wise attendance and track your status</p>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Overall Attendance</div>
          <div className="stat-value">{data?.overall || 0}%</div>
          <div style={{ 
            marginTop: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '13px'
          }}>
            <span style={{ color: overallStatus.color }}>{overallStatus.label}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-label">Attendance Required</div>
          <div className="stat-value">75%</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Minimum regulation
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-label">Subjects</div>
          <div className="stat-value">{subjects.length}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Total enrolled
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-label">Average</div>
          <div className="stat-value">
            {(subjects.reduce((a, b) => a + b.percentage, 0) / subjects.length || 0).toFixed(1)}%
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Across subjects
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="card glass">
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>📊 Attendance by Subject</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip 
              contentStyle={{
                background: 'rgba(10, 14, 39, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="percentage" fill="#667eea" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* DETAILED BREAKDOWN */}
      <div className="card glass">
        <h2 style={{ marginBottom: '24px', fontSize: '18px' }}>📘 Subject-Wise Breakdown</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {subjects.map((sub, i) => {
            const status = getStatusColor(sub.percentage);
            const attendancePercentage = (sub.attended / sub.total * 100).toFixed(0);

            return (
              <div
                key={i}
                className="card glass-sm"
                style={{
                  padding: '16px',
                  borderLeft: `4px solid ${status.color}`,
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '12px',
                }}>
                  <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{sub.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {sub.attended} / {sub.total} classes attended
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '700',
                        color: status.color,
                      }}>
                        {sub.percentage}%
                      </div>
                      <span style={{ fontSize: '11px', color: status.color }}>
                        {status.label.split(' ')[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div style={{
                  height: '8px',
                  borderRadius: '10px',
                  background: 'var(--glass-active)',
                  overflow: 'hidden',
                  marginBottom: '12px',
                }}>
                  <div
                    style={{
                      width: `${sub.percentage}%`,
                      height: '100%',
                      background: status.color,
                      borderRadius: '10px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                {/* STATUS MESSAGE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  {sub.percentage >= 75 ? (
                    <>
                      <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                      <span style={{ color: 'var(--text-muted)' }}>
                        On track - {sub.percentage >= 80 ? 'Excellent!' : 'Keep it up!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={14} style={{ color: status.color }} />
                      <span style={{ color: 'var(--text-muted)' }}>
                        Need {Math.ceil((75 * sub.total / 100) - sub.attended)} more classes
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TIPS */}
      <div className="card glass">
        <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <div>
            <h3 style={{ marginBottom: '8px' }}>Pro Tips</h3>
            <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              <li>✓ Maintain at least 75% attendance to remain eligible for exams</li>
              <li>✓ Compensatory attendance may be granted for medical reasons</li>
              <li>✓ Check with your department for attendance policies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;