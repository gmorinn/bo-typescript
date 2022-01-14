import { useState } from "react";
import { TypeFile } from "../utils/types";

const useInput = (initialValue:any, name:string, type:TypeFile, placeholder:string, className:string, other:Object | null = {}) => {
    const [value, setValue] = useState<any | null>(initialValue);

    const reset = () => setValue(null);

    const bindInput = {
        placeholder,
        type,
        className: className,
        other
    }

    const bindHookForm = {
        defaultValue: value,
        name: name,
    }

    const bindFile = {
        className: className,
        set: setValue,
        value,
        ...other
    }

    return {bindInput, reset, bindHookForm, value, setValue, bindFile}
};

export default useInput