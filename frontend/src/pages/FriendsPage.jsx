import { UsersIcon } from "lucide-react";
import { Link } from "react-router";
import { getUserFriends } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import NoFriendsFound from "../components/NoFriendsFound";
import FriendCard from "../components/FriendCard";


const FriendsPage = () => {
    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
    });

    return (
        <div className='p-4 sm:p-6 lg:p-8'>
            <div className='container mx-auto space-y-10'>

                {/* Heading Your friends and a button to take you to notifications page on top */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
                    <Link to="/notifications" className="btn btn-outline btn-sm">
                        <UsersIcon className="mr-2 size-4" />
                        Friend Requests
                    </Link>
                </div>

                {/* Section of page which contains authenticated user's current friends, their info and a button to chat with them */}
                {loadingFriends ? (
                    // fetch for query is in flight, same as isPending so display loading screen 
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : friends.length === 0 ? (
                    // If no friends found, displays no available
                    <NoFriendsFound />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {friends.map((friend) => (
                            <FriendCard key={friend._id} friend={friend} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendsPage;
