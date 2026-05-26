export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const storedUser = localStorage.getItem("user");
  let token = "";

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      token = parsedUser.token || "";
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    }
  }

  const headers = new Headers(options.headers || {});
  
  // Si tenemos token, lo agregamos como Bearer Token
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Agregamos el header de Content-Type por defecto si no es FormData
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
