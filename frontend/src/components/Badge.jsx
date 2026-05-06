export default function Badge({ children, variant = 'primary', style, ...props }) {
  const variantClass = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
  }[variant] || 'badge-primary';

  return (
    <span
      className={`badge ${variantClass}`}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
}
