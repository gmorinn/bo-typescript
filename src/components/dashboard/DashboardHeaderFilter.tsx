// DO NOT TOUCH THIS FILE

import { Toolbar, Typography, Tooltip, IconButton, Button } from "@mui/material";
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate } from "react-router-dom";

type DashboardHeaderFilterProps = {
  numSelected: number,
  title: string,
  deleteItems: () => void,
  add: string
}

const DashboardHeaderFilter = ({ numSelected, title, deleteItems, add }:DashboardHeaderFilterProps) => {
  const navigate = useNavigate()
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>
        )}
        <Button variant="contained" onClick={() => navigate(add)}>
          Add
        </Button>
        {numSelected > 0 ? (
          <Tooltip title="Delete" onClick={deleteItems}>
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
}

export default DashboardHeaderFilter