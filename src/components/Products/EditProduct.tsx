import React, { lazy, useEffect, useState } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import useRouter from "../../hooks/useRouter";
import { useApi } from "../../hooks/useApi";
import { useParams } from "react-router-dom";
import { FormCreateProduct } from "./FormProduct";

const FormProduct = lazy(() => import('./FormProduct'))

const EditProduct = () => {
    const router = useRouter()
	let { id } = useParams<{id: string}>();
    const [data, setData] = useState<FormCreateProduct | null>(null)
    const { Fetch } = useApi()

    useEffect(() => {
		!data && Fetch(`/v1/bo/product/${id}`, "GET").then(res => res?.success && setData(res.product))
		return () => setData(null)
		// eslint-disable-next-line
	}, [])

    return (
        <>
            <Card className="mb-3">
                <Box className="d-flex justify-content-between p-4">
					<h5>Edit Product</h5>
					<Button className="mx-2" variant="contained" onClick={() => router.push('/products')}>
						Go back
					</Button>
				</Box>
				<CardContent>
					{data && <FormProduct edit formData={data} />}
				</CardContent>
			</Card>
        </>
    )
}

export default EditProduct