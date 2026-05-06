import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Award, Zap } from "lucide-react";

export default function Marks() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const response = await fetch("http://localhost:8000/marks");
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading marks:", error);
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

  // Convert marks data to chart format
  const chartData = Object.entries(data || {}).map(([subject, marks]) => ({
    subject: subject.toUpperCase(),
    marks: marks[0] || 0,
  }));

  // Calculate statistics
  const allMarks = chartData.map(d => d.marks);
  const average = allMarks.length > 0 ? (allMarks.reduce((a, b) => a + b, 0) / allMarks.length).toFixed(1) : 0;
  const highest = Math.max(...allMarks, 0);
  const lowest = Math.min(...allMarks, 0);

  const getGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    return 'F';
  };

  const getPerformanceColor = (marks) => {
    if (marks >= 90) return 'var(--success)';
    if (marks >= 80) return 'var(--primary)';
    if (marks >= 70) return 'var(--warning)';
    if (marks >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="page-container">
      {/* HERO */}
      <div className="hero" style={{ background: 'var(--gradient-success)', marginBottom: '20px' }}>
        <div>
          <h1>📈 Marks & Performance</h1>
          <p>Track your academic performance across all subjects</p>
        </div>
      </div>

      {/* KEY STATISTICS */}
      <div className="grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Average Marks</div>
          <div className="stat-value">{average}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Grade: <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{getGrade(average)}</span>
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-label">Highest Marks</div>
          <div className="stat-value">{highest}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Grade: <span style={{ fontWeight: '600', color: 'var(--success)' }}>{getGrade(highest)}</span>
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📉</div>
          <div className="stat-label">Lowest Marks</div>
          <div className="stat-value">{lowest}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Grade: <span style={{ fontWeight: '600', color: getPerformanceColor(lowest) }}>{getGrade(lowest)}</span>
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-label">Subjects</div>
          <div className="stat-value">{chartData.length}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Total assessed
          </p>
        </div>
      </div>

      {/* MARKS CHART */}
      <div className="card glass">
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>📊 Subject-wise Marks</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="subject" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip 
              contentStyle={{
                background: 'rgba(10, 14, 39, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="marks" fill="#667eea" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* DETAILED BREAKDOWN */}
      <div className="card glass">
        <h2 style={{ marginBottom: '24px', fontSize: '18px' }}>📋 Detailed Breakdown</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '12px' }}>Subject</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Marks</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Grade</th>
                <th style={{ textAlign: 'center', padding: '12px' }}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: '500' }}>{item.subject}</td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: '600' }}>
                    {item.marks}
                  </td>
                  <td style={{ 
                    textAlign: 'center', 
                    padding: '12px',
                    color: getPerformanceColor(item.marks),
                    fontWeight: '700',
                  }}>
                    {getGrade(item.marks)}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <div style={{
                      display: 'inline-block',
                      width: '100px',
                      height: '6px',
                      borderRadius: '10px',
                      background: 'var(--glass-active)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${(item.marks / 100) * 100}%`,
                        height: '100%',
                        background: getPerformanceColor(item.marks),
                      }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TIPS SECTION */}
      <div className="grid-2">
        <div className="card glass">
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <TrendingUp size={20} style={{ color: 'var(--success)', marginTop: '2px' }} />
            <div>
              <h3 style={{ marginBottom: '8px' }}>Strong Areas</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Your consistent performance in {chartData.filter(d => d.marks >= 80).length} subjects shows excellent understanding. Keep focusing on these!
              </p>
            </div>
          </div>
        </div>

        <div className="card glass">
          <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
            <Award size={20} style={{ color: 'var(--warning)', marginTop: '2px' }} />
            <div>
              <h3 style={{ marginBottom: '8px' }}>Improvement Areas</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Focus on strengthening {chartData.filter(d => d.marks < 70).length} subject(s). Consider extra sessions or study groups.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GRADING SCALE */}
      <div className="card glass">
        <h3 style={{ marginBottom: '16px' }}>📏 Grading Scale</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          {[
            { grade: 'A+', range: '90-100' },
            { grade: 'A', range: '80-89' },
            { grade: 'B+', range: '70-79' },
            { grade: 'B', range: '60-69' },
            { grade: 'C', range: '50-59' },
            { grade: 'F', range: 'Below 50' },
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--glass-hover)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>
                {item.grade}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {item.range}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}