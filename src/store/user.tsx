import { atom } from "recoil";
import { User } from "../utils/types"

export const currentUserAtom = atom<User | null>({
    key: 'currentUserAtom',
    default: null
})
