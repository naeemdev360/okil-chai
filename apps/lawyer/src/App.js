import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from './routes/dashboard';
export function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/", element: _jsx("div", { className: "p-8 font-sans text-navy", children: "OkilChai Lawyer Portal \u2014 coming soon" }) })] }));
}
