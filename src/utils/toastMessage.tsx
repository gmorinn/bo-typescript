import { toast, ToastOptions } from 'react-toastify';

export const displayError = (msg:string) => toast.error(msg, {
    position: "top-left",
    autoClose: 3000,
    theme: "dark",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
});

export const displaySuccess = (msg:string) => toast.success(msg, {
    position: "top-left",
    autoClose: 3000,
    theme: "dark",
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
});