"use client";

import { Provider } from "jotai";

interface jotaiProviderProps {
    children: React.ReactNode;
};

export const jotaiProvider = ({ children }: jotaiProviderProps) => {
    return (
        <Provider>
            {children}
        </Provider>
    );
};