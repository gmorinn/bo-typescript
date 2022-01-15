import { lazy }  from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Products = lazy(() => import('./Products'));
const AddProduct = lazy(() => import('./AddProduct'));
const EditProduct = lazy(() => import('./EditProduct'));

const RoutesProducts = () => {
    const { user } = useAuth()

    return (
		<Routes>
		{
			user && productsRoutes.roles.includes(user.role) && 
			<>
				<Route path="/" element={<Products />} />
				<Route path="add" element={<AddProduct />} />
				<Route path="edit/:id" element={<EditProduct />} />
				<Route path="*" element={<Navigate to={"/404"}/>} />
			</>
		}
		</Routes>
    )
}

export default RoutesProducts

export const productsRoutes = {
	roles: ["root", "admin"]
};