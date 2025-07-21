import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAuthUser from '../hooks/useAuthUser';
import { getStreamToken } from '../lib/api';
import { useQuery } from '@tanstack/react-query';

import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    CallControls,
    SpeakerLayout,
    StreamTheme,
    CallingState,
    useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;


const CallPage = () => {
    // Saving the call id obtained from the url
    const { id: callId } = useParams();

    // Used to communicate with the stream by keeping track of certain things such as client, call, isConnecting
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);

    // fetching authenticated user's info
    const { authUser, isLoading } = useAuthUser();

    // Fetching stream token
    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser,
    });

    useEffect(() => {
        // Initializing call function
        const initCall = async () => {
            // if token or authUser or calLId doesn't exist then return
            if (!tokenData.token || !authUser || !callId) return;

            try {
                console.log("Initializing stream video client...");

                // Making a user object with user details
                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic,
                };

                // Creating videoclient to use various functions and methods of streamvideoclient to make video chat functional
                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token
                });

                // Creates a new call
                const callInstance = videoClient.call("default", callId);

                // Initiate a call session with the server
                await callInstance.join({ create: true }); // create:true creates a call if it doesn't exist

                console.log("Joined call successfully");

                setClient(videoClient);
                setCall(callInstance);
            } catch (error) {
                console.error("Error joining call:", error);
                toast.error("Could not join the call. Please try again.");
            } finally {
                setIsConnecting(false);
            }
        };

        initCall(); // Initializes call
    }, [tokenData, authUser, callId]); // Calls whenever tokenData, authUser or callId changes

    // if query is in flight then display page is still loading
    if (isLoading || isConnecting) return <PageLoader />;

    // StreamVideo and StreamCall component is used to allow functionality of video calling
    // Allows realtime video call with video and audio
    // Allows mute, turn off cam, emoji reaction, share screen, record screen features
    // Allows further functionality of specific functions such as pin, unpin, block, mute share screen and etc
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="relative">

                {/* If client and call exists then allow video call else show error message */}
                {client && call ? (

                    // StreamVideo wraps streamCall component along with passing the client, It sets the stage for everything else to happen
                    <StreamVideo client={client}>

                        {/* StreamCall designed to manage the state and context of a single, specific call. use this component when a user is about to join, is currently in, or is interacting with a particular call */}
                        <StreamCall call={call}>
                            <CallContent />
                        </StreamCall>
                    </StreamVideo>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>Could not initialize call. Please refresh or try again later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const CallContent = () => {
    // useCallStateHooks Allows use of bunch of different useful hooks where we specifically use the useCallCallingState
    const { useCallCallingState } = useCallStateHooks();
    // Initializing useCallCallingState which provides state of current call such as ringing or joined
    const callingState = useCallCallingState();

    // Lets you navigate programmatically in the browser in response to user interactions or effects
    const navigate = useNavigate();

    // If we click on leave button then navigate to homescreen
    if (callingState === CallingState.LEFT) return navigate("/"); // LEFT means the call has been left

    return (
        // StreamTheme applies a consistent theme, including colors, fonts, and other visual elements, across all the video components
        <StreamTheme>
            {/* highlight the current speaker. Typically, the active speaker is shown in a larger, more prominent view, while other participants are displayed in smaller thumbnails */}
            <SpeakerLayout />

            {/* Contains functional buttons such as mute, turn cam off, emoji, share screen, screenrecord, leave videocall */}
            <CallControls />
        </StreamTheme>
    );
};

export default CallPage;
