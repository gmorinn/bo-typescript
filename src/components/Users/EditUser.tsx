import { lazy, useEffect, useState } from "react";
import { Button, Card, CardContent, Box } from "@mui/material";
import useRouter from "../../hooks/useRouter";
import { useApi } from "../../hooks/useApi";
import { useParams } from "react-router";
import { FormCreateUser } from "./FormUser";

const FormUser = lazy(() => import('./FormUser'))
const ChangeUserPassword = lazy(() => import('./ChangeUserPassword'))

const EditUser = () => {
    const router = useRouter()
	let { id } = useParams<{id: string}>();
    const [data, setData] = useState<FormCreateUser | null>(null)
    const { Fetch } = useApi()

    useEffect(() => {
		!data && Fetch(`/v1/bo/user/${id}`, "GET").then(res => res?.success && setData(res.user))
		return () => setData(null)
		// eslint-disable-next-line
	}, [])
	
    return (
        <>
            <Card className="mb-5">
                <Box className="d-flex justify-content-between p-4">
					<h5>Edit User</h5>
					<Button className="mx-2" variant="contained" onClick={() => router.navigate('/users')}>
						Go back
					</Button>
				</Box>
				<CardContent>
					{data && <FormUser edit formData={data} />}
				</CardContent>
			</Card>
			<Card className="mb-3">
                <Box className="d-flex justify-content-between p-4">
					<h5>Edit Password</h5>
					<Button className="mx-2" variant="contained" onClick={() => router.navigate('/users')}>
						Go back
					</Button>
				</Box>
				<CardContent>
					{id && <ChangeUserPassword />}
				</CardContent>
			</Card>
        </>
    )
}

export default EditUser