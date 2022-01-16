import { lazy }  from "react";
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotFound from '../../screens/notFound'

const Users = lazy(() => import('./Users'));
const AddUser = lazy(() => import('./AddUser'));
const EditUser = lazy(() => import('./EditUser'));

const RoutesUsers = () => {
    const { user } = useAuth()

    return (
        <Routes>
			{
				user && usersRoutes.roles.includes(user.role) && 
				<>
					<Route path="/" element={<Users />} />
					<Route path="add" element={<AddUser />} />
					<Route path="edit/:id" element={<EditUser />} />
					<Route path="*" element={<NotFound />} />
				</>
			}
		</Routes>
    )
}

export default RoutesUsers

export const usersRoutes = {
	roles: ["root", "admin"]
};