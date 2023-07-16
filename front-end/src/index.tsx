import React from 'react';
import ReactDOM from 'react-dom/client';
import {httpBatchLink} from '@trpc/client';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {QueryClient as ReactQueryClient, QueryClientProvider as ReactQueryClientProvider} from "react-query";

import App from './App';
import reportWebVitals from './reportWebVitals';
import {trpc} from "./utils/trpc";

import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity
        }
    }
});

const reactQueryClient = new ReactQueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity
        }
    }
});

const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: 'https://service.fs.examples.oleksiipopov.com/trpc-demo'
        })
    ]
});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ReactQueryClientProvider client={reactQueryClient}>
                    <App/>
                </ReactQueryClientProvider>
            </QueryClientProvider>
        </trpc.Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
