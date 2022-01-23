import { useEffect, useState } from "react";
import { Button, Grid } from '@mui/material';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../hooks/useInput";
import Loader from '../Loader'
import { displaySuccess } from '../../utils/toastMessage'
import useRouter from "../../hooks/useRouter";
import Err from '../../utils/humanResp'
import { useAuth } from "../../hooks/useAuth";
import UseFormGroup from "../../hooks/useForm";

type FormValues = {
    confirm: string,
    password: string,
}

const defaultForm = {
    confirm: "",
    password:"",
}

const ChangeUserPassword = () => {
    const { newPassword, load } = useAuth()
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const schema = yup.object({
        password: yup.string().required().min(7),
        confirm: yup.string().required().min(7)
            .oneOf([yup.ref('password'), null], 'Password is different.'),
      });

    const { handleSubmit, control, reset, formState: { errors, isSubmitSuccessful } } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: defaultForm
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
          reset(defaultForm);
        }
      }, [isSubmitSuccessful, reset]);

    const password = useInput("", "password", "password", "Password...", "w-100")
    const confirm = useInput("", "confirm", "password", "Confirm password...", "w-100")

    const onSubmit:SubmitHandler<FormValues> = async ({ password, confirm }:FormValues):Promise<any> => {
        await newPassword(password, confirm, router.query?.id)
            .then((res:any) => {
                if (res?.success) {
                    displaySuccess("Success !");
                    router.push('/users')
                }
                else setError(Err(res))
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
            <Grid container rowSpacing={5} columnSpacing={{ xs: 2, sm: 5, md: 10, xl: 20 }}>
                <Grid item md={6}>
                    <UseFormGroup css={"mb-5 mt-5 w-100"} bind={password} control={control}/>
                    {errors.password?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.password?.type === 'min' && <span className="text-danger">Too small</span>}
                </Grid>
                <Grid item md={6}>
                    <UseFormGroup css={"mb-5 mt-5 w-100"} bind={confirm} control={control}/>
                    {errors.confirm?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.confirm?.type === 'min' && <span className="text-danger">Too small</span>}
                    {errors.confirm?.type === 'oneOf' && <span className="text-danger">Wrong password</span>}
                </Grid>
            </Grid>

            <Button size="small" className="w-50 mx-auto px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={load}>
                {load ? <Loader /> : <>Change Password</>}
            </Button>
            {error && <span className="text-danger text-center">{error}</span>}
        </form>
    )
}

export default ChangeUserPassword