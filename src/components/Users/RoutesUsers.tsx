import React, { lazy }  from "react";
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Users = lazy(() => import('./Users'));
const AddUser = lazy(() => import('./AddUser'));
const EditUser = lazy(() => import('./EditUser'));

const RoutesUsers = () => {
    const { user } = useAuth()

    return (
        <Routes>
			{user && usersRoutes.roles.includes(user.role) && <Route path="/users" element={<Users />} />}
			{user && usersRoutes.roles.includes(user.role) && <Route path="/user/add" element={<AddUser />} />}
			{user && usersRoutes.roles.includes(user.role) && <Route path="/user/edit/:id" element={<EditUser />} />}
		</Routes>
    )
}

export default RoutesUsers

export const usersRoutes = {
	name: 'Utilisateurs',
	to: '/users',
	exact: true,
	icon: 'home',
	roles: ["root", "admin"]
};