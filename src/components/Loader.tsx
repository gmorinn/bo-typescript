import { CircularProgress } from '@mui/material';

const Loader = () => {
    return (
       <div style={{position:'fixed', top: '50%', left: '50%', transform: "translate(-50%, -50%)"}}>
            <CircularProgress />
        </div>
    )
}

export default Loader