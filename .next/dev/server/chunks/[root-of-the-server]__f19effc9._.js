module.exports = [
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Desktop/avtotest/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/avtotest/node_modules/@supabase/ssr/dist/module/index.js [middleware] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/avtotest/node_modules/@supabase/ssr/dist/module/createServerClient.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/avtotest/node_modules/next/server.js [middleware] (ecmascript)");
;
;
// #region agent log
fetch('http://127.0.0.1:7242/ingest/deddb419-d5fa-4d5c-b0af-a92b16ae4dd2', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        location: 'proxy.ts:4',
        message: 'File proxy.ts exports proxy function - correct match',
        data: {
            fileName: 'proxy.ts',
            exportName: 'proxy',
            match: 'correct'
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        runId: 'post-fix',
        hypothesisId: 'A'
    })
}).catch(()=>{});
async function proxy(request) {
    try {
        let response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
            request: {
                headers: request.headers
            }
        });
        // Check if environment variables are set
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://lgacbbewpuzeyxijzfii.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnYWNiYmV3cHV6ZXl4aWp6ZmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NDE4MzcsImV4cCI6MjA4MjIxNzgzN30.P-CO-3mUHX0Pcrf1jgNcGqEXPiQEILnyGq9-340FLKc"), {
            cookies: {
                getAll () {
                    return request.cookies.getAll();
                },
                setAll (cookiesToSet) {
                    cookiesToSet.forEach(({ name, value })=>request.cookies.set(name, value));
                    response = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
                        request
                    });
                    cookiesToSet.forEach(({ name, value, options })=>response.cookies.set(name, value, options));
                }
            }
        });
        let user = null;
        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
            if (authError) {
                console.error("Auth error in proxy:", authError.message);
            // Continue without user if auth fails
            } else {
                user = authUser;
            }
        } catch (error) {
            console.error("Error getting user in proxy:", error);
        // Continue without user if there's an error
        }
        // 🔒 Admin route protection
        if (request.nextUrl.pathname.startsWith("/admin") && user) {
            try {
                const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", user.id).single();
                if (userError) {
                    console.error("Error fetching user data:", userError.message);
                    // If we can't verify admin status, redirect to dashboard for safety
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", request.url));
                }
                if (userData?.role !== "admin") {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", request.url));
                }
            } catch (error) {
                console.error("Error in admin check:", error);
                // On error, redirect to dashboard for safety
                return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", request.url));
            }
        }
        // 🚫 Auth userlarni login/registerdan chiqarish
        if (user && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", request.url));
        }
        // 🚫 Login qilmaganlarni himoyalangan sahifalardan chiqarish
        if (!user && (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/test") || request.nextUrl.pathname.startsWith("/settings") || request.nextUrl.pathname.startsWith("/tickets"))) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", request.url));
        }
        return response;
    } catch (error) {
        // If anything goes wrong, allow the request to proceed
        // This prevents the proxy from blocking all requests on error
        console.error("Proxy error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$avtotest$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next({
            request: {
                headers: request.headers
            }
        });
    }
}
const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/test/:path*",
        "/settings/:path*",
        "/tickets/:path*",
        "/login",
        "/register"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f19effc9._.js.map