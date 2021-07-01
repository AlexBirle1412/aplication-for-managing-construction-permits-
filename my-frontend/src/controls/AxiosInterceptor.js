import axios from "axios";
axios.defaults.params = {};
const axiosInterceptor = axios.interceptors.request.use((req) => {
  const idToken = localStorage.getItem("id_token");
  if (idToken) req.headers.Authorization = idToken;
  const _id = localStorage.getItem("_id");
  if (_id) req.params["UserId"] = _id;

  return req;
});

export default axiosInterceptor;
