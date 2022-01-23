import { Button, Grid } from '@mui/material';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import useInput from "../../hooks/useInput";
import Loader from '../Loader'
import useRouter from "../../hooks/useRouter";
import UseFormGroup from "../../hooks/useForm";
import { FC, useState } from 'react';
import { displaySuccess } from '../../utils/toastMessage';

type FormValues = {
    email: string,
    password: string,
    code: string,
    confirm_password: string;
}

const FormResetPassword: FC = () => {

    const router = useRouter()
    const { resetPassword, load } = useAuth()
    const [error, setError] = useState<string | null>(null)

    const schema = yup.object({
        password: yup.string().required().min(7),
        email: yup.string().email().required(),
        code: yup.string().required().length(5),
        confirm_password: yup.string().required().min(7)
            .oneOf([yup.ref('password'), null], 'Password is different.'),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(schema)
    });

    const email = useInput("", "email", "email", "Email...", "w-100")
    const password = useInput("", "password", "password", "Password...", "w-100")
    const confirm_password = useInput("", "confirm_password", "password", "Confirm password...", "w-100")
    const code = useInput("", "code", "text", "Secret code...", "w-100")

    const onSubmit: SubmitHandler<FormValues> = async (data:FormValues):Promise<any> => {
        await resetPassword(data)
        .then((res:any) => {
            if (res?.success && res.success) {
                displaySuccess("Password change!");
                router.push('/sign')
            }
            else setError("Email or code doesn't exist")
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column mt-5">
            <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
                <Grid item md={12} className="mb-1">
                    <UseFormGroup bind={email} control={control} />
                    {errors.email?.type === 'required' && <span className="mb-2">Required</span>}
                    {errors.email?.type === 'email' && <span className="mb-2">Wrong format</span>}
                </Grid>

                <Grid item md={12} className="mb-1">
                    <UseFormGroup bind={password} control={control} />
                    {errors.password?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.password?.type === 'min' && <span className="text-danger">Too small</span>}
                </Grid>

                <Grid item md={12} className="mb-1">
                    <UseFormGroup bind={confirm_password} control={control} />
                    {errors.confirm_password?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.confirm_password?.type === 'min' && <span className="text-danger">Too small</span>}
                    {errors.confirm_password?.type === 'oneOf' && <span className="text-danger">Wrong password</span>}
                </Grid>

                <Grid item md={12} className="mb-5">
                    <UseFormGroup bind={code} control={control} />
                    {errors.code?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.code?.type === 'length' && <span className="text-danger">Wrong code</span>}
                </Grid>

            </Grid>
            {error && <span className="text-danger">{error}</span>}
            <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={load}>
                {load ? <Loader /> : "Reset Password"}
            </Button>
        </form>
    )
}

export default FormResetPassword