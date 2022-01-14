import { atom } from "recoil";

export const darkModeAtom = atom<string>({
    key: 'darkModeAtom',
    default: JSON.parse(localStorage.getItem("isDark") || 'false')
})
