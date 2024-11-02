import { useEffect, useState } from "react";
import { HTTPmethods, categoryType, noteType } from "@/types";
import { useAuth } from "@/components/Auth/AuthContextProvider";

export function useFetch<T>(
  url: string,
  method: HTTPmethods,
  body?: categoryType | noteType,
  scroll?: boolean
): [T | null, T[], boolean, string, () => Promise<{} | undefined | null>] {
  const [response, setResponse] = useState<T | null>(null);
  const [responseList, setResponseList] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { currentUser } = useAuth();

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(url, {
        method: method,
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.ID_TOKEN}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error("HTTP Error");
      }

      const data: T | null = await response.json();
      if (scroll) {
        setResponseList((prev) => (data ? [...prev, data] : [...prev]));
      }
      setResponse(data);
      setLoading(false);
      return data;
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    if (method === "get") {
      fetchData();
    }
  }, [url, method]);

  return [response, responseList, loading, error, fetchData];
}
