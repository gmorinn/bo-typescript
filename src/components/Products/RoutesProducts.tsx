import { lazy }  from "react";
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotFound from '../../screens/notFound'

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
				<Route path="*" element={<NotFound />} />
			</>
		}
		</Routes>
    )
}

export default RoutesProducts

export const productsRoutes = {
	roles: ["root", "admin"]
};