'use client'

export default function Table({ headers, data, onEdit, onDelete }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
          {(onEdit || onDelete) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 ? (
          data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
              {(onEdit || onDelete) && (
                <td>
                  {onEdit && (
                    <button onClick={() => onEdit(row)}>Edit</button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)}>Delete</button>
                  )}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length + (onEdit || onDelete ? 1 : 0)}>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
