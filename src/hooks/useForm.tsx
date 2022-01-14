import { DatePicker, LocalizationProvider } from "@mui/lab";
import { FormControl, Input, MenuItem, Select, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import PhoneInput from "react-phone-input-2";
import { EnumProps } from "../utils/types";

type InputProps = {
    bind: any,
    control: any,
    other?: Object | null,
    format?: string,
    label?: string,
    enums?: EnumProps[]
}

type FormProps = {
    bind: any,
    phone?: boolean,
    select?: boolean,
    date?: boolean,
    number?: boolean,
    file?: boolean,
    control?: any,
    format?: string | undefined,
    label?: string | undefined,
    enums?: EnumProps[] | undefined,
    other?: any | undefined,
}

const UseFormGroup = ({ bind, phone, select, date, number, file, control, ...other }:FormProps) => {
    return (
        <FormControl className="mt-5 w-100">
            {
                phone  ?  <InputPhone bind={bind} control={control} /> :
                select ?  <InputSelect bind={bind} control={control} {...other} /> :
                date   ?  <InputDate bind={bind} control={control} {...other} /> :
                number ?  <InputNumber bind={bind} control={control} {...other} />
                       :  <InputText bind={bind} control={control} />
            }
        </FormControl>
    )
};

const InputPhone = ({ bind, control }:InputProps) => {
    return (
        <Controller
            {...bind.bindHookForm}
            country={'fr'}
            onlyCountries={['fr', 're', 'be', 'yt', 'gf', 'pf', 'tf', 'mu']}
            control={control}
            render={({ field }) => <PhoneInput {...field} {...bind.bindInput} />}
        />
    )
}

const InputText = ({ bind, control }:InputProps) => {
    return (
        <Controller
            {...bind.bindHookForm}
            control={control}
            render={({ field }) => <Input {...field} {...bind.bindInput} />}
        />
    )
}

const InputNumber = ({ bind, control, ...other }:InputProps) => {
    return (
        <Controller
            {...bind.bindHookForm}
            {...other}
            control={control}
            render={({ field }) => <TextField {...field} autoComplete='off' {...bind.bindInput} />}
        />
    )
}

// const InputFile = ({ bind, control }) => {
//     return (
//         <Controller
//             control={control}
//             render={({ field }) => <InputFileBrowser value={bind.value} set={bind.setValue} {...field} {...bind.bindInput} />}
//         />
//     )
// }

const InputDate = ({ bind, format, label }:InputProps) => {
    return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
            {...bind.bindHookForm}
            label={label}
            value={bind.value}
            type="date"
            inputFormat={format}
            onChange={v => bind.setValue(v)}
            renderInput={(params) => <TextField {...params} />}
        />
    </LocalizationProvider>
    )
}

const InputSelect = ({ bind, control, enums }:InputProps) => {
    return (
        <Controller
            id="demo-simple-select-standard"
            {...bind.bindHookForm}
            control={control}
            render={({ field }) => 
                <Select {...field} {...bind.bindInput}>
                    {
                        enums?.map((v, i) => {
                            return (
                                <MenuItem key={i} value={v.value}>{v.display}</MenuItem>
                            )
                        })
                    }
                </Select>
            }
        />
    )
}

export default UseFormGroup