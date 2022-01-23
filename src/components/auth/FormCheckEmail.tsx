import { Button } from '@mui/material';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from "../../hooks/useAuth";
import * as yup from "yup";
import useInput from "../../hooks/useInput";
import useRouter from "../../hooks/useRouter";
import Loader from '../Loader'
import UseFormGroup from "../../hooks/useForm";
import { displayError } from '../../utils/toastMessage';

type FormValues = {
    email: string
}

const FormCheckEmail = () => {
    const router = useRouter()
    const { checkMailAndSendCode, load } = useAuth()

    const schema = yup.object({
        email: yup.string().email().required(),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(schema)
    });

    const email = useInput("", "email", "email", "Email...", "w-100")

    const onSubmit: SubmitHandler<FormValues> = async ({ email }:FormValues):Promise<any> => {
        await checkMailAndSendCode(email)
            .then((res:any) => {
                if (res?.success && res?.exist) {
                    router.push('/forgot-password')
                }
                else {
                    displayError("Email doesn't exist!");
                }
            })
        }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column mt-5">
            <div className="mb-5 w-75 mx-auto">
                <UseFormGroup bind={email} control={control} />
                {errors.email?.type === 'required' && <span className="mb-2">Required</span>}
                {errors.email?.type === 'email' && <span className="mb-2">Wrong format</span>}
            </div>
            <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={load}>
                {load ? <Loader /> : "Reset Password"}
            </Button>
        </form>
    )
};

export default FormCheckEmail