import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TransferRedirect() {
  const navigate = useNavigate();
  const { key } = useParams();

  useEffect(() => {
    if (!key) return;

    navigate(`/?tab=receive&key=${key}`, { replace: true });
  }, [key, navigate]);

  return null;
}