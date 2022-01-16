import { FormControl, TextField } from '@mui/material';
import { UUID } from "../utils/types"
import { useApi } from '../hooks/useApi';
import { useState } from 'react';
import Err from './humanResp';
import { displayError } from './toastMessage';

type FileProps = {
    id: UUID,
    limit?: number,
    value: string,
    w?: number,
	accept: string
    h?: number,
    set: React.Dispatch<React.SetStateAction<string>>,
    className?: string
}

type FileResult = {
    url: string
}

type SuccessResult = {
    success: boolean,
    file: FileResult,
}

const InputFileBrowser = ({ id, limit, value, w, h, set, className, accept }: FileProps) => {

    const { Fetch } = useApi()
	const [err, setErr] = useState<String>("")

    const uploadFile = async (e: React.ChangeEvent<any>): Promise<any> => {
		const files = e.target.files

		const formData = new FormData()
		formData.append('content', files[0])
		formData.append('size', files[0].size)

		if (w && h) {
			formData.append('w', String(w))
			formData.append('h', String(h))
		}
	
		if (limit) {
			let fileSize = 0
			if (files && files[0]) {
				fileSize = files[0].size
			}
			if (fileSize > limit) {
				displayError("Error size of file");
			} else {
				return Fetch(`/v1/bo/files/add`, "POST", formData, false).then((res:SuccessResult) => res?.success && res.success && set(res.file?.url))
			}
		} else {
			return Fetch(`/v1/bo/files/add`, "POST", formData, false).then((res:any) => res?.success && res.success ? set(res.file?.url) : setErr(Err(res)))
		}
	}

    const removeFile = async () => {
		return Fetch(`/v1/bo/files/remove`, "PATCH", { url: value })
			.then((res:SuccessResult) => res?.success && res.success && set(""))
	}

    return (
        <FormControl className="mt-5 w-100">
			<TextField id={id} className={className} inputProps={{ accept: accept }} type="file" onChange={uploadFile} />
            {value !== "" && <small onClick={removeFile} className="text-danger text-center" style={{cursor: 'pointer'}}>Supprimer l'image actuelle</small>}
			{err && err !== "" && <small className="text-danger text-center">{err}</small>}
			{value !== "" && value.substring(0, 4) !== "http" && <img alt="logo" width={'50%'} className='mx-auto mt-3' src={process.env.REACT_APP_API_URL + value}/>}
		</FormControl>
    )
}

export default InputFileBrowser