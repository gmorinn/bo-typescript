import { useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom'

const useRouter = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    return useMemo(() => {
        return {
            push: navigate, // Change Url
            pathname: location.pathname, // Path of URL
            query: {
                ...params, // useParam :id
            },
            location,
            navigate,
        }
    }, [params, location, navigate])
}

export default useRouter
