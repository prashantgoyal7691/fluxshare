"use client";

import { useEffect } from "react";

import {
  useRouter,
  useParams,
} from "next/navigation";

export default function TransferPage() {

  const router = useRouter();

  const params = useParams();

  useEffect(() => {

    if (!params?.key) return;

    router.push(
      `/?tab=receive&key=${params.key}`
    );

  }, [params, router]);

  return null;
}