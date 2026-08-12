import { useState, useEffect, useCallback } from "react";
import { getApiErrorMessage } from "@/services/api";

const DATA_CHANGED_EVENT = "matrixz:data-changed";
const DATA_CHANGED_STORAGE_KEY = "matrixz_data_changed";

export function useFetch<T>(
  fetcher: () => Promise<{ data: { data: T } }>,
  deps: unknown[] = [],
  refreshInterval = 0
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
      }

      setError(null);

      fetcher()
        .then((res) => {
          setData(res.data.data);
        })
        .catch((err) => {
          setError(getApiErrorMessage(err));
        })
        .finally(() => {
          if (showLoading) {
            setLoading(false);
          }
        });

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    deps
  );

  /*
   * Initial page load.
   * Only this request shows the loading screen.
   */
  useEffect(() => {
    load(true);
  }, [load]);

  /*
   * Update immediately when another MATRIXZ page/tab
   * changes admin-managed content.
   */
  useEffect(() => {
    const handleDataChanged = () => {
      load(false);
    };

    window.addEventListener(
      DATA_CHANGED_EVENT,
      handleDataChanged
    );

    const handleStorage = (event: StorageEvent) => {
      if (event.key === DATA_CHANGED_STORAGE_KEY) {
        load(false);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        DATA_CHANGED_EVENT,
        handleDataChanged
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, [load]);

  /*
   * Automatic background polling.
   * Data updates silently without showing the loading screen.
   */
  useEffect(() => {
    if (!refreshInterval || refreshInterval <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      load(false);
    }, refreshInterval);

    return () => {
      window.clearInterval(interval);
    };
  }, [load, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: () => load(false),
  };
}