import { useCallback, useState } from "react";

const useArray = (value:any) => {
    const [array, setArray] = useState<any>(value)

    const push = useCallback(
        element => setArray((arr:any) => [...arr, element]),
    [])

    const pushBegin = useCallback(
        element => setArray((arr:any) => [element, ...arr]),
    [])

    const filter = useCallback(
        callback => setArray((arr:any) => arr.filter(callback)),
    [])

    const update = useCallback(
        (index, element) => setArray((arr:any) => [
            ...arr.slice(0, index),
            element,
            ...arr.slice(index + 1, arr.length)
        ]),
    [])

    const removeFirstItem = useCallback(
        () => setArray((arr:any) => arr.slice(1, arr.length)),
    [])

    const removeLastItem = useCallback(
        () => setArray((arr:any) => arr.splice(0, arr.length - 1)),
    [])

    const removeAtIndex = useCallback((index = 0) => 
        setArray((arr:any) => [...arr.slice(0, index), ...arr.slice(index + 1)]),
    [])

    const clear = useCallback(
        () => setArray([]),
    [])

    return {
        array,
        set: setArray,
        push,
        pushBegin,
        filter,
        update,
        removeAtIndex,
        removeFirstItem,
        removeLastItem,
        clear
    }
}

export default useArray