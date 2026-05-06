export default function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  label,
  showPercentage = true,
  style,
  ...props
}) {
  const percentage = (value / max) * 100;

  const variantClass = {
    primary: '',
    success: 'progress-success',
    warning: 'progress-warning',
    danger: 'progress-danger',
  }[variant] || '';

  return (
    <div style={{ width: '100%', ...style }} {...props}>
      {label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '6px',
          fontSize: '12px',
        }}>
          <span>{label}</span>
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={`progress ${variantClass}`}
        style={{
          width: `${percentage}%`,
        }}
      />
    </div>
  );
}
