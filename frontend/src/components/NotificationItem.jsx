export default function NotificationItem({
  icon: Icon,
  title,
  message,
  timestamp,
  type = 'info',
  isRead = false,
  onDelete,
  style,
  ...props
}) {
  const getColor = () => {
    const colors = {
      alert: 'var(--danger)',
      success: 'var(--success)',
      exam: 'var(--warning)',
      assignment: 'var(--info)',
      info: 'var(--primary)',
    };
    return colors[type] || colors.info;
  };

  return (
    <div
      className="card glass"
      style={{
        display: 'flex',
        alignItems: 'start',
        gap: '12px',
        padding: '16px',
        borderLeft: `4px solid ${isRead ? 'transparent' : getColor()}`,
        opacity: isRead ? 0.7 : 1,
        transition: 'all 0.3s ease',
        ...style,
      }}
      {...props}
    >
      {Icon && (
        <div
          style={{
            flexShrink: 0,
            color: getColor(),
            marginTop: '2px',
          }}
        >
          <Icon size={20} />
        </div>
      )}

      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
          {title}
        </h4>
        <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
          {message}
        </p>
        {timestamp && (
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
            {timestamp}
          </p>
        )}
      </div>

      {onDelete && (
        <button
          onClick={onDelete}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
