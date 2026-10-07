"use client";

import { useEffect } from "react";

export default function AOSProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        let mounted = true;

        import("aos").then((mod) => {
            if (!mounted) return;
            mod.default.init({
                duration: 800,
                once: true,
                offset: 100,
            });
        });

        return () => {
            mounted = false;
        };
    }, []);

    return <>{children}</>;
}