import { useEffect, useRef } from "react";

const useUpdateEffect = (callback:any,  dependencies:any = []) => {
    const firstRender = useRef(true)

    useEffect(() =>{
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        return callback()
    // eslint-disable-next-line
    }, dependencies)
}

export default useUpdateEffect