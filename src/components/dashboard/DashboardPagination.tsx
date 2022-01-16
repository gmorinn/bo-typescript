// DO NOT TOUCH THIS FILE

import React, { SyntheticEvent } from "react";
import { TableFooter, TablePagination, TableRow, Box, IconButton } from "@mui/material";
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';

type TablePaginationActionsProps = {
  count: number,
  page: number,
  rowsPerPage: number,
  onPageChange: any
}

const TablePaginationActions = ({ count, page, rowsPerPage, onPageChange }:TablePaginationActionsProps) => {
    const theme = useTheme();

    const handleFirstPageButtonClick = (event:SyntheticEvent) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (event:SyntheticEvent) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event:SyntheticEvent) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event:SyntheticEvent) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
}

type DashboardPaginationProps = {
  rowsPerPage: number,
  page: number,
  total: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
}

const DashboardPagination = ({ setPage, rowsPerPage, setRowsPerPage, page, total }:DashboardPaginationProps) => {

    const handleChangePage = (event:any, newPage:number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event:any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

    return (
        <TableFooter>
            <TableRow >
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={12}
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                        inputProps: {
                            'aria-label': 'colonne par page',
                        },
                            native: true,
                        }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    />
          </TableRow>
    </TableFooter>
    )
}

export default DashboardPagination