import { useEffect, useState } from "react";
import { Button, Grid } from '@mui/material';
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useInput from "../../hooks/useInput";
import Loader from '../Loader'
import { useApi } from "../../hooks/useApi";
import Err from '../../utils/humanResp'
import useRouter from "../../hooks/useRouter";
import UseFormGroup from "../../hooks/useForm";
import { displaySuccess } from '../../utils/toastMessage'
import InputFileBrowser from "../../utils/InputFile";

export type FormCreateProduct = {
    name: string,
    cover: string,
    price: number,
    category: 'men' | 'women' | 'sneaker' | 'hat' | 'jacket'
}

type FormProductProps = {
    formData?: FormCreateProduct | null,
    add?: boolean,
    edit?: boolean
}

const defaultForm:FormCreateProduct = {
    name: "",
    category: "men",
    price: 0.0,
    cover: "",
}

type ProductPayload = {
    name: string,
    category: 'men' | 'women' | 'sneaker' | 'hat' | 'jacket'
    price:number
}

const FormProduct = ({ add, edit, formData }:FormProductProps) => {
    const { Fetch, loading } = useApi()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    const name = useInput(formData?.name || "", "name", "text", "Name...", "w-100")
    const category = useInput(formData?.category || "men", "category", "text", "Category...", "w-100")
    const price = useInput(formData?.price || 0.0, "price", "number", "Price", "w-100")
    const [cover, setCover] = useState<string>(formData?.cover || "")

    const schema = yup.object({
        name: yup.string().min(3).required(),
        price: yup.number().positive().required(),
        category: yup.string().oneOf(["men", "women", "jacket", "hat", "sneaker"]).required(),
    });

    const { handleSubmit, control, reset, formState: { errors, isSubmitSuccessful } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: formData || defaultForm
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
          reset(defaultForm);
        }
      }, [isSubmitSuccessful, reset]);


    const onSubmit:SubmitHandler<FormCreateProduct> = async ({name, category, price}:ProductPayload) => {
        if (add && !edit) {
            await Fetch('/v1/bo/product/add', "POST", {product: { name, category, price, cover: cover }}, true)
            .then(res => {
                if (res?.success) {
                    displaySuccess("Add !")
                    router.push('/products')
                }
                else setError(Err(res))
            })
        } else {
            await Fetch(`/v1/bo/product/${router.query?.id}`, "PUT", { product: { name, category, price, cover: cover } }, true)
                .then(res => {
                    if (res?.success) {
                        displaySuccess("Edit !")
                        router.push('/products')
                    }
                    else setError(Err(res))
                })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column mt-5">
            <Grid container rowSpacing={5} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup bind={name} control={control} />
                    {errors.name?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.name?.type === 'min' && <span className="text-danger">3 minimum</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup 
                        select
                        bind={category}
                        control={control}
                        enums={[
                            {value: "men", display: "Men"},
                            {value: "women", display: "Women"},
                            {value: "sneaker", display: "Sneaker"},
                            {value: "hat", display: "Hat"},
                            {value: "jacket", display: "Jacket"},
                        ]}
                    />
                    {errors.category?.type === 'required' && <span className="text-danger">Required</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <UseFormGroup bind={price} control={control} number />
                    {errors.price?.type === 'required' && <span className="text-danger">Required</span>}
                    {errors.price?.type === 'positive' && <span className="text-danger">Need to be more than 0</span>}
                </Grid>

                <Grid item md={6} className="mb-3 w-100">
                    <InputFileBrowser w={257} h={350} id="cover" value={cover} className="w-100" limit={1048576} set={setCover}
                        accept="image/png,image/jpeg,image/jpg" />
                </Grid>

            </Grid>
            <Button size="small" className="w-50 mx-auto px-5 pt-3 pb-3 mb-2" type='submit' variant="contained" disabled={loading}>
                {loading ? <Loader /> : <>{add ? "Add Product" : "Edit Product"}</>}
            </Button>
            {error && <span className="text-danger text-center">{error}</span>}
        </form>
    )
}

export default FormProduct