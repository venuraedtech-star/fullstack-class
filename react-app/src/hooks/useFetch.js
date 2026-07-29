import { useEffect, useState } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Request Failed!");
        const result = await response.json();
        setData(result);
      } catch (err) {
        if (err) setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [url]);
  return { data, loading, error };
}

export default useFetch;
