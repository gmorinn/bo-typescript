import { Grid, Box } from '@mui/material';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import FormLogin from './FormLogin';

const Login: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Grid container className="text-center justify-content-center">
          <Grid item sm={10} md={8} lg={6} sx={{ width: '100%' }}>
              <Box>
                  <h3 className="mb-3">Connexion</h3>
              </Box>
          </Grid>
      </Grid>
      <FormLogin />
      <span onClick={() => navigate('/check-email')} className="d-flex justify-content-center text-primary" style={{cursor: 'pointer'}}>Forgot password?</span>
    </>
    )
}

export default Login;