import { jsx as _jsx } from "react/jsx-runtime";
import { Route, Routes } from 'react-router-dom';
export function App() {
    return (_jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx("div", { className: "p-8 text-navy-900 font-bold text-gold text-3xl", children: "OkilChai Admin \u2014 coming soon" }) }) }));
}
