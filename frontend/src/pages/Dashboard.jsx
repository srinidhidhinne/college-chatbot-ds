import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Award, AlertCircle, Users } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/analytics");
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
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

  // Prepare chart data
  const attendanceData = data?.attendance?.subjects?.map(s => ({
    name: s.name,
    percentage: s.percentage,
  })) || [];

  const marksData = Object.entries(data?.marks?.data || {}).map(([subject, marks]) => ({
    subject: subject.toUpperCase(),
    marks: marks[0] || 0,
  }));

  const performanceData = [
    { month: 'Week 1', performance: 75 },
    { month: 'Week 2', performance: 78 },
    { month: 'Week 3', performance: 82 },
    { month: 'Week 4', performance: 85 },
  ];

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#00f2fe', '#4facfe'];

  return (
    <div className="page-container" style={{ gap: '24px' }}>
      {/* HERO SECTION */}
      <div className="hero" style={{ marginBottom: '20px' }}>
        <div>
          <h1>👋 Welcome back, {data?.profile?.name || 'Student'}</h1>
          <p style={{ marginTop: '8px' }}>Here's your academic overview for this semester</p>
        </div>
        <div style={{ fontSize: '48px' }}>📚</div>
      </div>

      {/* STATS GRID */}
      <div className="grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Attendance</div>
          <div className="stat-value">{data?.attendance?.overall || 0}%</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {data?.attendance?.overall >= 75 ? '✓ On Track' : '⚠️ Below 75%'}
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-label">Average Marks</div>
          <div className="stat-value">{data?.marks?.average?.toFixed(1) || 0}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Across {Object.keys(data?.marks?.data || {}).length} subjects
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-label">Year</div>
          <div className="stat-value">{data?.profile?.year || 'N/A'}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {data?.profile?.department || 'Department'}
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Upcoming Exams</div>
          <div className="stat-value">{data?.upcoming_exams || 0}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            This semester
          </p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid-2">
        {/* ATTENDANCE CHART */}
        <div className="card glass">
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>📊 Attendance by Subject</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
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

        {/* MARKS CHART */}
        <div className="card glass">
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>📈 Marks Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marksData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subject, marks }) => `${subject}: ${marks}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="marks"
              >
                {marksData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PERFORMANCE TREND */}
      <div className="card glass">
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>📉 Performance Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="var(--text-muted)" />
            <YAxis stroke="var(--text-muted)" />
            <Tooltip 
              contentStyle={{
                background: 'rgba(10, 14, 39, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="performance" 
              stroke="#667eea" 
              strokeWidth={3}
              dot={{ fill: '#667eea', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* QUICK INFO SECTION */}
      <div className="grid-3">
        <div className="card glass">
          <TrendingUp size={24} style={{ marginBottom: '12px', color: 'var(--success)' }} />
          <h3>Performance</h3>
          <p>Up 5% this month</p>
        </div>

        <div className="card glass">
          <Award size={24} style={{ marginBottom: '12px', color: 'var(--warning)' }} />
          <h3>Achievements</h3>
          <p>5 milestones reached</p>
        </div>

        <div className="card glass">
          <AlertCircle size={24} style={{ marginBottom: '12px', color: 'var(--danger)' }} />
          <h3>Alerts</h3>
          <p>2 pending tasks</p>
        </div>
      </div>
    </div>
  );
}