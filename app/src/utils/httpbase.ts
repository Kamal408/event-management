import axios from "axios";

const API_URL = "https://kamalkafle.pythonanywhere.com/api/";

export const httpBase = () => {
  const normalHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const api = axios.create({
    baseURL: `${API_URL}`,
    headers: normalHeaders,
    responseType: "json",
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

export function fetch(endpoint: string, params: unknown) {
  return httpBase().get(`/${endpoint}`, { params });
}

export function store(endpoint: string, data: object) {
  return httpBase().post(`/${endpoint}`, data);
}

export function update(endpoint: string, id: string, data: object) {
  return httpBase().put(`/${endpoint}/${id}`, data);
}

export function destroy(endpoint: string, id: string) {
  return httpBase().delete(`/${endpoint}/${id}`);
}
