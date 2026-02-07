import { jsx as _jsx } from "react/jsx-runtime";
import { AppRouter } from './providers/RouterProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AppRouter, {}) }));
}
export default App;
