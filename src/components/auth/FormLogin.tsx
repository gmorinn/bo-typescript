import { Button, Box } from '@mui/material';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import * as api from '../../utils/api'
import useInput from "../../hooks/useInput";
import useRouter from "../../hooks/useRouter";
import UseFormGroup from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth'
import Loader from '../Loader'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import { FC, useState } from 'react';
import { displaySuccess } from '../../utils/toastMessage';

type FormValues = {
    email: string,
    password: string,
}

const FormLogin: FC = () => {

    const router = useRouter()
    const { loginBo, load } = useAuth()
    const [error, setError] = useState<string | null>(null)

    const schema = yup.object({
        email: yup.string().email().required(),
        password: yup.string().required().min(7),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(schema)
    });

    const email = useInput("", "email", "email", "Email...", "w-100")
    const password = useInput("", "password", "password", "Password...", "w-100")

    const onSubmit:SubmitHandler<FormValues> = async data => {
        api.SigninWithMailAndPassword({ email: data.email, password: data.password, loginBo })
            .then(() => {
                displaySuccess("You're connected!")
                router.push('/')
            })
            .catch((err) => setError(err))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column mt-5">

            <UseFormGroup bind={email} control={control} css="mb-5 mt-5 mx-auto" sx={{ width: '60%' }} />
            {errors.email?.type === 'required' && <span className="mb-2">Required</span>}
            {errors.email?.type === 'email' && <span className="mb-2">Wrong format</span>}

            <UseFormGroup bind={password} control={control} css="mb-5 mt-5 mx-auto" sx={{ width: '60%' }}/>
            {errors.password?.type === 'required' && <span className="mb-2">Required</span>}
            {errors.password?.type === 'min' && <span className="mb-2">Too small</span>}

            <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={load}>
                {load ? <Loader /> : <><Box component="i" marginRight="1rem"><AlternateEmailIcon /></Box>Login by mail</>}
            </Button>
            {error && <span className="text-danger text-center mb-4">{error}</span>}
        </form>
    )
}

export default FormLogin