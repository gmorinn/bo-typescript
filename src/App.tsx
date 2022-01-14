import { Container } from "@mui/material";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const CheckEmail = lazy(() => import("./screens/checkEmail"))

const App = () => {

  return (
    <Container className="mt-5" maxWidth="xl">
     <Routes>
        <Route path="/check-email" element={<CheckEmail />} />
      </Routes>
    </Container>
  );
}

export default App