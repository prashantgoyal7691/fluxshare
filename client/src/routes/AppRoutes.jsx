import { Routes, Route } from "react-router-dom";
import TransferRedirect from "../pages/TransferRedirect";

export default function AppRoutes({ home }) {
  return (
    <Routes>
      <Route path="/" element={home} />
      <Route path="/transfer/:key" element={<TransferRedirect />} />
    </Routes>
  );
}