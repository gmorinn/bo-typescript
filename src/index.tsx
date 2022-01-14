import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from "./screens/errorBoundary";

import { QueryClient, QueryClientProvider } from 'react-query';
import Loader from './components/Loader';
import { ProvideAuth } from './hooks/useAuth';

const App = lazy(() => import('./App'))

const g = "color:#00000;font-weight:bold;font-size:18px;";
const hello = `%c 🤙 https://guillaume-morin.fr/`;
console.info(hello, g);

const queryClient = new QueryClient()

ReactDOM.render(
  <ErrorBoundary>
    <Suspense fallback={<Loader />}>
      <ProvideAuth>
        <RecoilRoot>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
        </BrowserRouter>
        </RecoilRoot>
      </ProvideAuth>
    </Suspense>
  </ErrorBoundary>,
  document.getElementById('root')
);

reportWebVitals();
