export default function Card({ children, className = 'glass', style, ...props }) {
  return (
    <div
      className={`card ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
