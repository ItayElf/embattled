import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_API } from "../constants";
import User from "../interfaces/user";
import { ensureTokens, getFetchSafe } from "../utils/fetchUtils";

const useCurrentUser = (forceAuth: boolean) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const getUser = async () => {
      try {
        await ensureTokens();
        const res = await getFetchSafe(BASE_API + "auth/current_user");
        setUser(JSON.parse(await res.text()));
      } catch (e) {
        console.error(e);
        forceAuth && navigate("/signIn");
      }
    };
    getUser();
  }, [forceAuth, navigate]);

  return user;
};

export default useCurrentUser;
