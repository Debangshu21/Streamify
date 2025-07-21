import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";

const useLogin = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: login,
        // Used to refetch the authUser where queryKey: authUser so login page route is revalidated and hence redirected to home page
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
    });
    return { error, isPending, loginMutation: mutate };
};

export default useLogin;
