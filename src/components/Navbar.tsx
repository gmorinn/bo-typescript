import { withStyles } from '@mui/styles';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { useNavigate } from "react-router-dom";

type PropsIcon = {
  text: string,
  redirect: () => void,
  icon: any
}

type PropsNavBar = {
  toggleDrawerHandler?: () => void,
  classes?: any,
  open: boolean
}

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
}

const Icon = ({ icon, text, redirect }: PropsIcon) => {
  return (
      <ListItemButton onClick={redirect}>
          <ListItemIcon>
              {icon}
          </ListItemIcon>
          <ListItemText primary={text}/>
      </ListItemButton>
  )
}

const Navbar =({ classes, toggleDrawerHandler, open }:PropsNavBar) => {
  const navigate = useNavigate()

  return (
    <Drawer open={open} onClose={toggleDrawerHandler}>
      <div
        className={classes.list}
        onKeyDown={toggleDrawerHandler}
        onClick={toggleDrawerHandler}
      >
      <List>
        <Icon text="Users" icon={<GroupIcon />} redirect={() => navigate("/users")} />
        <Icon text="Products" icon={<ProductionQuantityLimitsIcon />} redirect={() => navigate("/products")} />
      </List>
    </div>
    </Drawer>
  );
};

export default withStyles(styles)(Navbar);
