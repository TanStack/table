import React, { useEffect, FC, MouseEvent, KeyboardEvent } from "react";

import MaUTable from "@material-ui/core/Table";
import PropTypes from "prop-types";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableToolbar from "./TableToolbar";
import ColumnSettingsModal from "./ColumnSettingsModal";

import {
  useGlobalFilter,
  useFilters,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
  useColumnOrder,
  Column,
  Cell,
  Row,
  HeaderGroup
} from "react-table";

import { TableProps, ColumnData } from "fraud-profiling";

const EnhancedTable: FC<TableProps> = ({
  columns,
  data,
  fetchData,
  skipPageReset
}) => {
  const {
    columns: cols,
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    preGlobalFilteredRows,
    setGlobalFilter,
    setFilter,
    setHiddenColumns,
    setColumnOrder,
    state: { selectedRowIds, globalFilter, sortBy, filters }
  } = useTable(
    {
      columns,
      data,
      manualSortBy: true,
      manualPagination: true,
      manualGlobalFilter: true,
      manualFilters: true,
      autoResetPage: !skipPageReset,
      autoResetSortBy: !skipPageReset
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    useColumnOrder
  );

  const [showColumnHideModal, setShowColumnHideModal] = React.useState(false);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [selectedCells, setSelectedCells] = React.useState([]);

  useEffect(() => {
    fetchData({ sortBy, globalFilter, filters });
  }, [sortBy, globalFilter, filters, fetchData]);

  const saveTableSettings = (cols: string[], columnOrder: string[]): void => {
    setHiddenColumns(cols);
    //Reorder columns
    setColumnOrder(columnOrder);
    setShowColumnHideModal(false);
  };

  const tableSettings = (event: MouseEvent) => {
    setShowColumnHideModal(true);
  };

  const onDblClick = (e: MouseEvent) => {
    console.log("dbl clicked", e.target.innerText);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    //handle action based on key pressed
    console.log("key pressed", e.key);
  };
  const onClick = (e: MouseEvent, cell: Cell) => {
    e.preventDefault();
    let newSelectedRows;
    if (e.metaKey || e.ctrlKey) {
      newSelectedRows = cell.row.isSelected
        ? selectedRows.filter(id => id !== cell.row.id)
        : selectedRows.concat([cell.row.id]);
    } else if (e.shiftKey) {
      //some logic for selection
    } else {
      newSelectedRows = [cell.row.id];
    }

    setSelectedRows(newSelectedRows);
    setSelectedCells(cell.column.id);
  };

  return (
    <TableContainer>
      <TableToolbar
        numSelected={Object.keys(selectedRowIds).length}
        tableSettings={tableSettings}
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={globalFilter}
        setFilter={setFilter}
        filter={filters}
        columns={cols.map((col: ColumnData) => {
          const { Header: title, id } = col;
          return { title, id };
        })}
      />

      <ColumnSettingsModal
        columns={cols.map((col: ColumnData) => {
          const { id, isVisible, Header } = col;
          return {
            id,
            isVisible,
            Header
          };
        })}
        open={showColumnHideModal}
        closeModalHandler={setShowColumnHideModal}
        saveSettings={saveTableSettings}
      />
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup: HeaderGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: Column) => (
                <TableCell
                  {...(column.id === "selection"
                    ? column.getHeaderProps()
                    : column.getHeaderProps(column.getSortByToggleProps()))}
                >
                  {column.render("Header")}
                  {column.id !== "selection" ? (
                    <TableSortLabel
                      active={column.isSorted}
                      // react-table has a unsorted state which is not treated here
                      direction={column.isSortedDesc ? "desc" : "asc"}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody onDoubleClick={onDblClick} onKeyDown={onKeyDown}>
          {page.map((row: Row, i: number) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                onClick={() => row.toggleRowSelected()}
                style={{
                  background: selectedRows.includes(row.id) ? "gold" : null
                }}
              >
                {row.cells.map((cell: Cell) => {
                  return (
                    <TableCell
                      {...cell.getCellProps()}
                      onClick={e => onClick(e, cell)}
                      tabIndex="0"
                      style={{
                        cursor: "pointer",
                        background:
                          selectedRows[selectedRows.length - 1] === row.id &&
                          selectedCells.includes(cell.column.id)
                            ? "silver"
                            : null
                      }}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MaUTable>
    </TableContainer>
  );
};

EnhancedTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  skipPageReset: PropTypes.bool.isRequired,
  fetchData: PropTypes.func.isRequired
};

export default EnhancedTable;
