import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import { Link } from 'react-router';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import FriendCard, { getLanguageFlag } from '../components/FriendCard';
import NoFriendsFound from "../components/NoFriendsFound";
import { capitialize } from "../lib/utils";

const HomePage = () => {
    const queryClient = useQueryClient();
    // Used to keep track of if friend request already sent (disables send friend req button if yes) despite refreshing page
    const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

    // Used to fetch info on friends of authenticated user
    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
    });

    // Used to fetch info on other users not friend of authenticated user to send req to
    const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: getRecommendedUsers,
    });

    // Used to fetch info on friend requests already sent to other users by authenticated user
    // Helpful in disabling button to send friend req again
    const { data: outgoingFriendReqs } = useQuery({
        queryKey: ["outgoingFriendReqs"],
        queryFn: getOutgoingFriendReqs
    });

    // Used to send friend request to other users by linking frontend and backend
    const { mutate: sendRequestMutation, isPending } = useMutation({
        mutationFn: sendFriendRequest,
        // outgoingFriendReqs is revalidated again so it's updated after authenticated user sends a request
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] })
    });

    // Used to put all the individual friend req ids in a set so that we can disable the button to send friend req to those users again 
    useEffect(() => {
        const outgoingIds = new Set();
        if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
            outgoingFriendReqs.forEach((req) => {
                outgoingIds.add(req.recipient._id);
            });
            setOutgoingRequestsIds(outgoingIds);
        }
    }, [outgoingFriendReqs]);

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

                {/* Section of page which shows recommended users for the authenticated user to send them friend requests */}
                <section>
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                                <p className="opacity-70">
                                    Discover perfect language exchange partners based on your profile
                                </p>
                            </div>
                        </div>
                    </div>

                    {loadingUsers ? (
                        <div className="flex justify-center py-12">
                            <span className="loading loading-spinner loading-lg" />
                        </div>
                    ) : recommendedUsers.length === 0 ? (
                        <div className="card bg-base-200 p-6 text-center">
                            <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
                            <p className="text-base-content opacity-70">
                                Check back later for new language partners!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedUsers.map((user) => {
                                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                                return (
                                    <div
                                        key={user._id}
                                        className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="card-body p-5 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar size-16 rounded-full">
                                                    <img src={user.profilePic} alt={user.fullName} />
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold text-lg">{user.fullName}</h3>
                                                    {user.location && (
                                                        <div className="flex items-center text-xs opacity-70 mt-1">
                                                            <MapPinIcon className="size-3 mr-1" />
                                                            {user.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Languages with flags */}
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="badge badge-secondary">
                                                    {getLanguageFlag(user.nativeLanguage)}
                                                    Native: {capitialize(user.nativeLanguage)}
                                                </span>
                                                <span className="badge badge-outline">
                                                    {getLanguageFlag(user.learningLanguage)}
                                                    Learning: {capitialize(user.learningLanguage)}
                                                </span>
                                            </div>

                                            {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                                            {/* Action button */}
                                            <button
                                                className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                                                    } `}
                                                onClick={() => sendRequestMutation(user._id)}
                                                disabled={hasRequestBeenSent || isPending}
                                            >
                                                {hasRequestBeenSent ? (
                                                    <>
                                                        <CheckCircleIcon className="size-4 mr-2" />
                                                        Request Sent
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlusIcon className="size-4 mr-2" />
                                                        Send Friend Request
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
