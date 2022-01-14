import { Button, Grid } from '@mui/material';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useMutation } from "react-query";
import { toast } from 'react-toastify';
import { useAuth } from "../../hooks/useAuth";
import useInput from "../../hooks/useInput";
import Loader from '../Loader'
import useRouter from "../../hooks/useRouter";
import UseFormGroup from "../../hooks/useForm";
import { FC } from 'react';

type FormValues = {
    email: string,
    password: string,
    code: string,
    confirm_password: string;
}

const FormResetPassword: FC = () => {

    const router = useRouter()
    const { resetPassword } = useAuth()

    const resetPasswordWithCode = async (data:FormValues):Promise<any> => {
        await resetPassword(data)
            .then((res:any) => {
                if (res?.success && res.success) console.log("succeed!")
                // eslint-disable-next-line
                else { throw "Email or code doesn't exist" }
            })
    }

    const {isError, isLoading, mutate, error } = useMutation(resetPasswordWithCode, {
        onSuccess: () => {
            toast.success("Password change!", {
                position: "top-left",
                autoClose: 3000,
                theme: "dark",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
            router.push('/sign')
        },
    })

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

    const onSubmit: SubmitHandler<FormValues> = data => mutate(data);

    return (
        <>
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
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
                {isError && <span className="text-danger">{typeof error === 'string' ? error : ''}</span>}
                <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={isLoading}>
                    {isLoading ? <Loader /> : "Reset Password"}
                </Button>
            </form>
        </div>
        </>
    )
}

export default FormResetPassword