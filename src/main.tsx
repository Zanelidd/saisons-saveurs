import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {queryClient} from "@/lib/queryClients.ts";
import "@/lib/i18n"; // initialise i18next avant le premier render
import App from "./App";
import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App/>
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false}/>}
        </QueryClientProvider>
    </StrictMode>,
);