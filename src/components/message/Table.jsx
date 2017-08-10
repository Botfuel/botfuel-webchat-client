import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

const Thead = styled.thead`
  tr {
    border-bottom: 1px solid;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  empty-cells: show;
  max-width: 100%;
  display: block;
  overflow-x: auto;
  overflow-y: hidden;

  td,
  th {
    padding: 5px 5px;
    border-right: 1px solid;
    &:last-of-type {
      border-right: 0;
    }
  }
`;

function generateTable(value) {
  const header = value.schema.map(h =>
    (<th key={h.key}>
      {h.label}
    </th>),
  );
  const rows = value.rows.map(row =>
    (<tr key={uuidv4()}>
      {value.schema.map(h =>
        (<td key={h.key}>
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
  value: PropTypes.shape({
    schema: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
  }),
};
