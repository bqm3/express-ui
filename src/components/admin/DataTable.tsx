'use client';

import { Fragment } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export interface DataTableColumn<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  emptyMessage?: string;
  stickyHeader?: boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  /** Optional extra row(s) after each data row (e.g. expand panel) */
  renderAfterRow?: (row: T) => React.ReactNode;
}

export default function DataTable<T>({
  columns,
  rows,
  getRowId,
  emptyMessage = 'Không có dữ liệu',
  stickyHeader = true,
  minHeight = 360,
  maxHeight = 'calc(100vh - 280px)',
  renderAfterRow,
}: DataTableProps<T>) {
  return (
    <TableContainer
      sx={{
        minHeight,
        maxHeight,
        overflow: 'auto',
      }}
    >
      <Table size="small" stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || 'left'}
                sx={{
                  fontWeight: 700,
                  minWidth: col.minWidth,
                  bgcolor: 'background.paper',
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    py: 3,
                    textAlign: 'center',
                  }}
                >
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <Fragment key={getRowId(row)}>
                <TableRow hover>
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align || 'left'}>
                      {col.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
                {renderAfterRow?.(row)}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
