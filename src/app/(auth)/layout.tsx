import React from "react";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <section className=" mt-12 pt-16 flex flex-1 flex-col items-center justify-center bg-white  sm:p-4  py-10 lg:justify-center">
            {children}
        </section>

    );
}