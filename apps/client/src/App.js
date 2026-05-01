import { jsx as _jsx } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
export function App() {
    return (_jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx("div", { className: "p-8 font-bold text-4xl", children: "OkilChai Client \u2014 coming soon" }) }) }));
}
