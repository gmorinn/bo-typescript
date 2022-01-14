import jwtDecode, { JwtPayload } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ResetPasswordProps, ResultJwt, ResultSendCodeConfirmation, SignUpParams, SignWithSocialMediaParams, SuccessResult } from "../utils/types";


const authContext = createContext<any | null>(null);
const api = process.env.REACT_APP_API_URL

type ProvideAuthProps = {
    children: React.ReactNode
}

export const ProvideAuth = ({ children }:ProvideAuthProps) => {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth} >{children}</authContext.Provider>;
}

export const useAuth = () => {
	return useContext(authContext);
};

const setAccessToken = (token:string) => token && localStorage.setItem('accessToken', token)

const setRefreshToken = (token:string) => token && localStorage.setItem('refreshToken', token)

const setOAuthToken = (oAuth:string) => sessionStorage.setItem('oAuth', oAuth)

const getAccessToken = () => localStorage.getItem('accessToken')

const getRefreshToken = () => localStorage.getItem('refreshToken')

const getOAuthToken = () => sessionStorage.getItem('oAuth')

const getUser = (jwt?:string):any | null => {
	let token = jwt || getAccessToken()
	let user = token ? jwtDecode<JwtPayload>(token) : null
	return user;
};

const isTokenExpired = (token:string):Boolean => {
	try {
		const decoded = jwtDecode<JwtPayload>(token);
		if (decoded?.exp && decoded.exp < Date.now() / 1000) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		localStorage.removeItem("refreshToken")
		sessionStorage.removeItem("accessToken")
		return false;
	}
};


const loggedIn = ():Boolean => {
	const token = getAccessToken();
	if (!!token && !isTokenExpired(token)) {
		return true
	}
	return false
};


function useProvideAuth() {
	const [user, setUser] = useState<any | null>(null);
	const [load, setLoad] = useState<Boolean>(false);

	const [oAuth, setOAuth] = useState<String | null>(null)

	const getAuthorization = async ():Promise<any> => {
		setLoad(true);

		const response = await fetch(`${api}/authorization`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: 'POST',
			body: JSON.stringify({
				grant_type: "client_credentials",
				client_id: process.env.REACT_APP_CLIENT_ID,
				client_secret: process.env.REACT_APP_CLIENT_SECRET
			})
		});

		const body = await response.json();
		setOAuth(body.access_token);
		setOAuthToken(body.access_token);
		setLoad(false);
		return body.access_token;
	}

	useEffect(() => {
		!oAuth && getAuthorization()
		return () => {
			getOAuthToken()
		}
	}, [oAuth])

	const refreshToken = async (refresh_token?:string):Promise<ResultJwt | any> => {
		const r_token = refresh_token || getRefreshToken()

		if (!r_token) {
			return logout()
		}

		setLoad(true)
		return await fetch(`${api}/refresh`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getOAuthToken()}`,
			},
			method: "POST",
			body: JSON.stringify({
				refresh_token: getRefreshToken()
			})
		}).then(async resp => {
			if (resp.status === 403) {
				return await getAuthorization().then(async () => await refreshToken(refresh_token))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			setAccessToken(body.access_token);
			setRefreshToken(body.refresh_token);
			setUser(getUser(body.access_token));
			return body;
		})
	};

	const login = async (email:string, password:string):Promise<ResultJwt> => {
		setLoad(true)
		return await fetch(`${api}/signin`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getOAuthToken()}`,
			},
			method: "POST",
			body: JSON.stringify({
				email: email,
				password: password
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await login(email, password))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			setAccessToken(body.access_token);
			setRefreshToken(body.refresh_token);
			setUser(getUser(body.access_token));
			return body;
		})
		.catch(err => {
			console.error(err)
			return err
		})
	};

	const loginBo = async (email:string, password:string):Promise<ResultJwt> => {
		setLoad(true)
		return await fetch(`${api}/bo/signin`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getOAuthToken()}`,
			},
			method: "POST",
			body: JSON.stringify({
				email: email,
				password: password
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await login(email, password))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			setAccessToken(body.access_token);
			setRefreshToken(body.refresh_token);
			setUser(getUser(body.access_token));
			return body;
		})
		.catch(err => {
			console.error(err)
			return err
		})
	};

	const signWithProvider = async (payload:SignWithSocialMediaParams):Promise<ResultJwt> => {
		setLoad(true)
		return await fetch(`${api}/sign-providers`, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${getOAuthToken()}`,
			},
			method: "POST",
			body: JSON.stringify({
				...payload
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await signWithProvider(payload))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			setAccessToken(body.access_token);
			setRefreshToken(body.refresh_token);
			setUser(getUser(body.access_token));
			return body;
		})
	};


	const signup = async (reqBody:SignUpParams):Promise<ResultJwt> => {
		setLoad(true)
		let res = await fetch(`${api}/signup`, {
			headers: {
				Authorization: `Bearer ${getOAuthToken()}`,
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify({
				...reqBody
			})
		})
		if (res.status === 403) {
			return await getAuthorization().then(res => res && signup(reqBody))
		}
		setLoad(false)
		return await res.json().then((resp) => {
			setAccessToken(resp.access_token);
			setRefreshToken(resp.refresh_token);
			setUser(getUser(resp.access_token));
			return resp
		})
		.catch(err => {
			console.error(err)
			return err
		})
	}

	const logout = () => {
		localStorage.removeItem("refreshToken")
		localStorage.removeItem("accessToken")
		setUser(() => null)
	};

	const lost = async (data:string):Promise<ResultSendCodeConfirmation> => {
		setLoad(true)
		return await fetch(`${api}/v1/lost`, {
			headers: {
				"Authorization": `Bearer ${getOAuthToken()}`,
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify({
				data
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await lost(data))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			return body
		})
	};

	const newPassword = async (password:string, confirm:string, id:string):Promise<SuccessResult> => {
		setLoad(true)
        const requestHeaders: any = new Headers();
        requestHeaders.set('Authorization', `Bearer ${getOAuthToken()}`);
        requestHeaders.set('jwtToken', getAccessToken());
        requestHeaders.set('Content-Type', 'application/json');

		return await fetch(`${api}/v1/bo/user/change/password/${id}`, {
			headers: requestHeaders,
			method: "PATCH",
			body: JSON.stringify({
				password,
				confirm,
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await newPassword(password, confirm, id))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			return body
		})
	};

	const resetPassword = async (data:ResetPasswordProps):Promise<SuccessResult> => {
		setLoad(true)
		return await fetch(`${api}/v1/reset-password`, {
			headers: {
				"Authorization": `Bearer ${getOAuthToken()}`,
				"Content-Type": "application/json"
			},
			method: "PUT",
			body: JSON.stringify({
				data
			})
		}).then(async resp => {
			if (resp.status === 403) {
				await getAuthorization().then(async () => await resetPassword(data))
			}
			return await resp.json()
		}).then(body => {
			setLoad(false)
			return body
		})
	};

	useEffect(() => {
		if (loggedIn()) {
			setUser(getUser())
		} else {
			refreshToken()
		}
		// eslint-disable-next-line
	}, []);

	// Return the user object and auth methods
	return {
		getAuthorization,
		getOAuthToken,
		getAccessToken,
		loggedIn,
		refreshToken,
		signWithProvider,
		load,
		user,
		loginBo,
		signup,
		login,
		logout,
		resetPassword,
		lost,
		newPassword,
	};
}