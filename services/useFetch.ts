import { useEffect, useState } from "react";


//fetchFunction will be a prop from another componenet
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await fetchFunction();
            setData(result);

        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    };

    // automatically fetch data on component load if autoFetch is true
    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }

    },[]);

    return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
