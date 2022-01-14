import Err from "./humanResp";

type SigninMailProps = {
    email: string,
    password: string,
    loginBo: (email: string, password: string) => Promise<any>
}

export const SigninWithMailAndPassword = async ({ email, password, loginBo }: SigninMailProps) => {
    await loginBo(email, password)
        .then((res:any) => {
            if (res?.success) console.log("succeed!")
            else { throw Err(res) }
        })
};