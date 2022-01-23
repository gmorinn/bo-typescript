import { useState } from "react";
import { useAuth } from './useAuth';
import { Header, Method } from "../utils/types";

const api = process.env.REACT_APP_API_URL

export const useApi = () => {
    const [loading, setLoading] = useState<boolean>(false)

	const { getOAuthToken, getAccessToken, getAuthorization } = useAuth()


    const Fetch = async (route:string, method:Method = 'GET', payload?:any, json:Boolean = true):Promise<any> => {
        setLoading(true)
        const headers:Header = {
			Authorization: `Bearer ${getOAuthToken()}`,
			jwtToken: getAccessToken()
		}
        if (json) {
			headers['Content-Type'] = 'application/json'
		}

        return await fetch(`${api}${route}`, {
			headers: { ...headers },
			method: method,
			body: json ? JSON.stringify(payload) : payload
		})
			.then(async (response) => {
				if (!response.ok) {
					if (response.status === 403) {
						return await getAuthorization().then(() => Fetch(route, method = 'GET', payload, json = true))
					}
				}
				return await response.json()
			})
			.then(async (data) => {
				setLoading(false)
				return await data
			})
			.catch((error) => {
                console.log(error)
				setLoading(false)
			});
    }

    return { Fetch, loading }
};