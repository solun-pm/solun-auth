import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useFetchUserApiToken = () => {
  const [userApiDetails, setUserApiDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/get_api_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      });

      if (!response.ok) {
        localStorage.removeItem("jwt");
        router.push("/login");
        return;
      }

      const data = await response.json();
      setUserApiDetails(data.data);
    };

    fetchUserInfo();
  }, []);

  return { userApiDetails };
};