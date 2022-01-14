import { Container } from "@mui/material";
import { FC, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useRecoilState } from "recoil";
import { useApi } from "./hooks/useApi";
import { useAuth } from "./hooks/useAuth";
import { currentUserAtom } from "./store/user";

// const Home = lazy(() => import("./screens/homepage"))
const CheckEmail = lazy(() => import("./screens/checkEmail"))
const ForgotPassword = lazy(() => import("./screens/forgotPassword"))
const Sign = lazy(() => import("./screens/sign"))

toast.configure();

const App: FC = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom)
  const { user, logout } = useAuth()
  const { Fetch } = useApi()

  useEffect(() => {
    user && user.id ? Fetch(`/v1/bo/user/${user.id}`).then(res => {
        if (res?.success && res.user) {
          setCurrentUser(res.user)
        } else {
          setCurrentUser(null)
          logout()
        }
    }) : setCurrentUser(null)
    return () => setCurrentUser(null)
    // eslint-disable-next-line
  }, [user])

  return (
    <Container className="mt-5" maxWidth="xl">
      <Routes>
        <Route path="/sign" element={<RedirectRoute component={Sign} isObject={currentUser} />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/" element={<PrivateRoute component={<Home />}/>} /> */}
      </Routes>
    </Container>
  );
}

const PrivateRoute = ({ component: Component }:any) => {
	const auth = useAuth()
	const user = auth.loggedIn() && auth.user
  const location = useLocation()

  if (user) {
    return  <Component />
  }

  return <Navigate to="/sign" state={{ from: `?next=${location.pathname}` }} />
};

const RedirectRoute = ({ component: Component, isObject }:any) => {
    return !isObject ? <Component /> : <Navigate to="/" />
}

export default App;