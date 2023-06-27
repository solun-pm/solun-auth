import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useFetchUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("jwt");

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/jwt_details", {
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
      setUserInfo(data);

      const detailsResponse = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/user/user_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: data.user_id,
        }),
      });

      if (!detailsResponse.ok) {
        localStorage.removeItem("jwt");
        router.push("/login");
        return;
      }
      const userDetailsData = await detailsResponse.json();
      setUserDetails(userDetailsData);
    };

    fetchUserInfo();
  }, []);

  return { userInfo, userDetails };
};