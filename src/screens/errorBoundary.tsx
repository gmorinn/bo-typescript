import { Component, ErrorInfo, ReactNode } from "react";
import Error404 from '../assets/404.png'

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
        return <div className="position-relative h-50 w-50">
            <img src={Error404} alt="404" className="img-fluid" style={{position:'fixed', top: '50%', left:'50%', transform: 'translate(-50%, -50%)', width: '65%'}}/>
        </div>
    }
    return this.props.children
  }
}

export default ErrorBoundary;
