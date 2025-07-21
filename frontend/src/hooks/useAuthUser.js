import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

// This separate hook helps in reusing it in multiple pages without having to rewrite it again in every page

// useQuery is from TanStack which replaces use of useEffect in linking our frontend and backend
// It makes the code simpler and shorter
const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false, // auth check since tanstack attempts 4 times to send request to server if true
    });

    return {
        isLoading: authUser.isLoading,
        authUser: authUser.data?.user,
    };
};

export default useAuthUser;
