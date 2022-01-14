import React from "react";
import { Button } from '@mui/material';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from "react-query";
import { toast } from 'react-toastify';
import { useAuth } from "../../hooks/useAuth";
import * as yup from "yup";
import useInput from "../../hooks/useInput";
import useRouter from "../../hooks/useRouter";
import Loader from '../Loader'
import UseFormGroup from "../../hooks/useForm";

type FormValues = {
    email: string
}

export const FormCheckEmail = () => {

    const router = useRouter()
    const { lost } = useAuth()

    const checkMail = async (data:FormValues):Promise<any> => {
        await lost(data)
            .then((res:any) => {
                if (res?.success && res.exist) console.log("succeed!")
                else { throw new Error("Email doesn't exist") }
            })
    }

    const { isLoading, mutate } = useMutation(checkMail, {
        onSuccess: () => {
            router.push('/forgot-password')
        },
        onError: () => {
            toast.error("Email doesn't exist!", {
                position: "top-left",
                autoClose: 3000,
                theme: "dark",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    })

    const schema = yup.object({
        email: yup.string().email().required(),
      }).required();

    const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(schema)
    });

    const email = useInput("", "email", "email", "Email...", "w-100")

    const onSubmit: SubmitHandler<FormValues> = data => mutate(data);

    return (
        <>
        <div className="mt-5">
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                <div className="mb-5 w-75 mx-auto">
                    <UseFormGroup bind={email} control={control} />
                    {errors.email?.type === 'required' && <span className="mb-2">Required</span>}
                    {errors.email?.type === 'email' && <span className="mb-2">Wrong format</span>}
                </div>
                <Button size="small" className="w-100 px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={isLoading}>
                    {isLoading ? <Loader /> : "Reset Password"}
                </Button>
            </form>
        </div>
        </>
    )
};