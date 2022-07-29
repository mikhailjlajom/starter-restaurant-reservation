import React from "react";

function TableList({tables,finishHandler}) {
    return tables.map((table) => {
        return (
            
            <tr key={table.table_id}>
              <td>{table.table_id}</td>
              <td>{table.table_name}</td>
              <td>{table.capacity}</td>
              <td data-table-id-status={table.table_id}>
                {table.reservation_id ? <p>Occupied</p> : <p>Free</p>}
              </td>
              <td>
                {table.reservation_id ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    data-table-id-finish={table.table_id}
                    onClick={finishHandler}
                  >
                    Finish
                  </button>
                ) : null}
              </td>
            </tr>
            
          );
    })
}

export default TableList