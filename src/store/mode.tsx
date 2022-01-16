import { atom } from "recoil";

export const darkModeAtom = atom<boolean>({
    key: 'darkModeAtom',
    default: JSON.parse(localStorage.getItem("isDark") || 'false')
})
