export default function DataTable({
  headers = [],
  rows = [],
  className = 'glass',
  style,
  ...props
}) {
  return (
    <div
      className={`card ${className}`}
      style={{ overflow: 'auto', ...style }}
      {...props}
    >
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
      }}>
        <thead>
          <tr style={{
            borderBottom: '2px solid var(--border-color)',
            background: 'var(--glass-hover)',
          }}>
            {headers.map((header, idx) => (
              <th
                key={idx}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              style={{
                borderBottom: '1px solid var(--border-color)',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--glass-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
