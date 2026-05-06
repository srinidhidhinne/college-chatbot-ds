export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  style,
  ...props
}) {
  const variantClass = {
    primary: '',
    secondary: 'btn-secondary',
    success: 'btn-success',
    warning: 'btn-warning',
    danger: 'btn-danger',
    outline: 'btn-outline',
  }[variant] || '';

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  }[size] || '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
