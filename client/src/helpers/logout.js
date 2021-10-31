import axios from "axios";

export const logout = (setauth, setIsUser) => {
  axios("/api/logout", { method: "POST" })
    .then((res) => {
      console.log(res.data);
      if (res.data.authenticated === false) {
        localStorage.removeItem("isUser");
        setauth(res.authenticated);
        setIsUser(null);
      }
    })
    .catch(console.error);
};
