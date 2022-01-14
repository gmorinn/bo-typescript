import { useState } from 'react';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import useRouter from '../hooks/useRouter'
import { useAuth } from '../hooks/useAuth'
import MenuIcon from '@mui/icons-material/Menu';
import { toast } from 'react-toastify';
import { currentUserAtom } from '../store/user';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { darkModeAtom } from '../store/mode';

const Header = () => {
  const router = useRouter()
  const { logout } = useAuth()
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom)
  const mode = useRecoilValue(darkModeAtom)

  const [isDrawerOpen, setDrawerOpen] = useState<Boolean>(false);

  const Logout = () => {
    setCurrentUser(null)
    logout()
    toast.info('Disconnected!', {
      position: "top-left",
      theme: "dark",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    router.push('/sign')
  }

  return (
      <AppBar position="fixed" className={`${!mode && "bg-white"}`}>
        <Toolbar  sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Typography component="div" sx={{ cursor: 'pointer' }}>
              <IconButton
                edge="start"
                className=""
                color="default"
                aria-label="open navbar"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              {/* <Navbar open={isDrawerOpen} toggleDrawerHandler={() => setDrawerOpen(false)} /> */}
            </Typography>
              <LocalFireDepartmentIcon sx={{ color: `${!mode && "black"}`, cursor: 'pointer' }} onClick={() => router.push('/')}/>
              {
                currentUser && <div className={`${!mode ? "text-dark" : "text-white"}`} style={{cursor: 'pointer'}} onClick={Logout}>Logout</div>
              }
        </Toolbar>
      </AppBar>
  );
}

export default Header;