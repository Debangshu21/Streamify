import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signup } from "../lib/api"

const useSignUp = () => {
    const queryClient = useQueryClient()
    const { mutate, isPending, error } = useMutation({
        mutationFn: signup, // inside lib/api.js
        // Used to refetch the authUser where queryKey: authUser so Signup page route is revalidated and hence redirected to onboarding page
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
    })
    return { isPending, error, signupMutation: mutate };
};

export default useSignUp;
