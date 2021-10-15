import axios from "axios";

export default function authInit(setauth, setIsUser) {
  axios("/api/authenticate", {
    method: "POST",
    "Content-Type": "application/json",
    withCredentials: true,
  })
    .then((res) => {
      console.log(res.data);

      if (res.data.authenticated && res.data.accessToken !== undefined) {
        setauth(true);
        setIsUser(localStorage.getItem("isUser"));
        localStorage.setItem("accessToken", res.data.accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;
      }
    })
    .catch(console.error);
}
