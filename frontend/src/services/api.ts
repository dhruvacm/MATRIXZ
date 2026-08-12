import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "/api";

const DATA_CHANGED_EVENT = "matrixz:data-changed";
const DATA_CHANGED_STORAGE_KEY =
  "matrixz_data_changed";

/*
 * These are the backend resources that affect
 * public MATRIXZ content.
 */
const PUBLIC_DATA_ROUTES = [
  "/teams",
  "/team-members",
  "/events",
  "/achievements",
  "/gallery",
];

function notifyDataChanged() {
  /*
   * Update pages in the same browser tab.
   */
  window.dispatchEvent(
    new CustomEvent(DATA_CHANGED_EVENT)
  );

  /*
   * Update MATRIXZ public pages opened
   * in another browser tab/window.
   */
  try {
    localStorage.setItem(
      DATA_CHANGED_STORAGE_KEY,
      String(Date.now())
    );
  } catch {
    // Ignore storage errors.
  }
}

function isPublicDataMutation(
  method?: string,
  url?: string
) {
  if (!method || !url) return false;

  const normalizedMethod =
    method.toLowerCase();

  const isMutation =
    normalizedMethod === "post" ||
    normalizedMethod === "put" ||
    normalizedMethod === "patch" ||
    normalizedMethod === "delete";

  if (!isMutation) return false;

  return PUBLIC_DATA_ROUTES.some((route) =>
    url.includes(route)
  );
}

export const api = axios.create({
  baseURL: API_URL,
});

/*
 * Add admin JWT automatically.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(
    "matrixz_admin_token"
  );

  if (token && config.headers) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

/*
 * Handle successful API responses.
 */
api.interceptors.response.use(
  (response) => {
    const method =
      response.config.method;

    const url =
      response.config.url;

    /*
     * If admin successfully creates,
     * updates, duplicates or deletes
     * public content, notify every
     * mounted public page.
     */
    if (
      isPublicDataMutation(method, url)
    ) {
      notifyDataChanged();
    }

    return response;
  },

  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes(
        "/admin/login"
      )
    ) {
      localStorage.removeItem(
        "matrixz_admin_token"
      );

      localStorage.removeItem(
        "matrixz_admin_info"
      );

      window.location.href =
        "/admin/login";
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(
  err: unknown
): string {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
}