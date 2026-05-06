export default function ModuleCard({ title, subtitle, icon }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      {icon && <div>{icon}</div>}
    </div>
  );
}