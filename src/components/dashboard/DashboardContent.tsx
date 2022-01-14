import React, { ReactNode, SyntheticEvent } from "react";
import { Checkbox, IconButton, TableCell, TableRow } from "@mui/material";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from "react-router-dom";

type DashboardContentProps = {
  selected: string[],
  isItemSelected: boolean,
  row:any,
  labelId: string,
  key?: string,
  edit: string,
  setSelected: React.Dispatch<React.SetStateAction<any[]>>,
  children: ReactNode
}

const DashboardContent = ({ selected, isItemSelected, row, labelId, edit, setSelected, key, children }:DashboardContentProps) => {
    const navigate = useNavigate()
    const handleClick = (event:SyntheticEvent, id:string) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected:string[] = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
  
      setSelected(newSelected);
    };
  
    return (
      <TableRow
          hover
          onClick={(e) => handleClick(e, row.id)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.id}
          selected={isItemSelected}
        >
        <TableCell padding="checkbox">
        <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
            'aria-labelledby': labelId,
            }}
        />
        </TableCell>
        {children}
        <TableCell align="center">
            <IconButton
            aria-label="edit page"
            size="small"
            onClick={() => navigate(edit)}
            >
            <ModeEditIcon fontSize="small"/>
          </IconButton>
          </TableCell>
      </TableRow>
    )
  }

export default DashboardContent