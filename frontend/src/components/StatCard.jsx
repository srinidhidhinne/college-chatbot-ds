export default function StatCard({ icon, label, value, description, onClick, style }) {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      style={style}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {description && (
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
          {description}
        </p>
      )}
    </div>
  );
}
