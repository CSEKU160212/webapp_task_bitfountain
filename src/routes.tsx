import React from "react";

const LoginComponent = React.lazy(() => import("./views/user/Login"));
const TheLayoutComponent = React.lazy(() => import("./containers/TheLayout"));

const DevicesModelComponent = React.lazy(() =>
    import("./views/devices/DevicesModelComponent")
);

export const publicRoutes = [
    {
        path: "/login",
        name: "Login",
        exact: true,
        component: LoginComponent,
    },
    {
        path: "/",
        name: "The Layout",
        exact: false,
        component: TheLayoutComponent,
    },
];

export const privateRoutes = [
    {
        path: "/medical_devices",
        exact: true,
        name: "Avavilable Devices",
        component: DevicesModelComponent,
    },
];
