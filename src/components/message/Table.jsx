import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Thead = styled.thead`
  tr {
    border-bottom: 1px solid #ccc;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  empty-cells: show;
  td,
  th {
    padding: 0.5em 1em; /* cell padding */
  }
`;
function generateTable(value) {
  const header = value.schema.map(h =>
    (<th>
      {h.label}
    </th>),
  );
  const rows = value.rows.map(row =>
    (<tr>
      {value.schema.map(h =>
        (<td>
          {row[h.key]}
        </td>),
      )}
    </tr>),
  );
  return (
    <Table>
      <Thead>
        <tr>
          {header}
        </tr>
      </Thead>
      <tbody id="tbody">
        {rows}
      </tbody>
    </Table>
  );
}

export default function MessageTable({ value }) {
  return (
    <div>
      {generateTable(value)}
    </div>
  );
}

MessageTable.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
};
