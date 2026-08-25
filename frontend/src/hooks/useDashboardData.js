import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getDashboardStatus,
} from "../services/api/dashboardApi";


export function useDashboardData() {

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  const loadData =
    useCallback(async () => {

      try {

        const result =
          await getDashboardStatus();

        setData(result);

        setError(null);

      } catch (err) {

        console.error(
          "Dashboard API error:",
          err
        );

        setError(
          err?.message ||
          "Unable to load dashboard data"
        );

      } finally {

        setLoading(false);

      }

    }, []);


  useEffect(() => {

    loadData();

    const interval =
      setInterval(
        loadData,
        5000
      );

    return () => {

      clearInterval(
        interval
      );

    };

  }, [loadData]);


  return {
    data,
    loading,
    error,
  };
}