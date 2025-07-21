import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
    Channel,
    ChannelHeader,
    Chat,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
    // Returns the id in the url of chat/:id
    const { id: targetUserId } = useParams();

    // Used to communicate with the stream by keeping track of certain things such as client, channel and loading
    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetches info of authenticated user
    const { authUser } = useAuthUser();

    // Fetching the stream token to communicate with a specific user
    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser // queryFn will only run when authUser is available, | !! converts it to boolean
    })

    useEffect(() => {
        // Initializing chat
        const initChat = async () => {
            // If token and authenticated user doesnt exist
            if (!tokenData?.token || !authUser) return;

            try {
                console.log("Initializing stream chat client...");
                // Initializes a client to use various functions and methods of streamchat
                const client = StreamChat.getInstance(STREAM_API_KEY);

                // Connection to connect and setting up the current user
                await client.connectUser({
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic
                }, tokenData.token);

                // Creating a channel id between the target user and authenticated user so they can chat || id is sorted so that same channel is created regardless of who initiates the chat
                const channelId = [authUser._id, targetUserId].sort().join("-");

                // initializing the channel with unique channel id
                //  A channel contains messages, a list of people that are watching the channel, and optionally a list of members
                const currChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, targetUserId]
                });
                // watch listens for any incoming changes
                await currChannel.watch();

                setChatClient(client);
                setChannel(currChannel);
            } catch (error) {
                console.error("Error initializing chat:", error);
                toast.error("Could not connect to chat. Please try again.");
            } finally {
                setLoading(false);
            }
        }

        initChat();
    }, [tokenData, authUser, targetUserId]); // Runs whenever tokendata,authUser or targetUser changes

    const handleVideoCall = () => {
        // Creates a url to video call the user if channel exists
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;

            // Message is sent with url link to join the video call
            channel.sendMessage({
                text: `I've started a video call. Join me here: ${callUrl}`,
            });

            toast.success("Video call link sent successfully!");
        }
    };

    // If query is still in flight or chatClient and channel doesn't exist then display chat loading
    if (loading || !chatClient || !channel) return <ChatLoader />;

    // UI is completely made through getStream's components
    // getStream io allows:
    // Works in real time
    // allows special functionality
    // shows if user is currently typing or msg is seen by a user or not
    // can send emojis and react to specific msgs with emojis
    // can send images
    // can edit msgs, delete msgs, unread msgs, mute msgs
    // scales to million users
    // and alot we can do
    return (
        <div className="h-[93vh]">

            {/* wrap your entire chat with it. initialize the StreamChat client with user information. provides this client instance via context to all child components, managing the connection to the Stream service */}
            <Chat client={chatClient}>

                {/* manages the state for a single, specific channel. It provides channel-specific context—like messages, members, and typing events—to the UI components inside it */}
                <Channel channel={channel}>
                    <div className="w-full relative">

                        {/* Button to video call the user */}
                        <CallButton handleVideoCall={handleVideoCall} />

                        {/* designed to hold the ChannelHeader, MessageList, and MessageInput together. helps manage the UI state, such as showing or hiding the thread view */}
                        <Window>

                            {/* renders the header at the top of the chat window. displays information about the active channel, such as its name, image, and the number of members */}
                            <ChannelHeader />

                            {/* efficiently handles displaying messages, grouping them by sender, showing read receipts, and managing user scrolling. It automatically listens for new messages and updates in real-time  */}
                            <MessageList />

                            {/* provides the text input field, attachment options (files, images), emoji picker, and the send button. It also automatically handles features like typing indicators */}
                            <MessageInput focus />
                        </Window>
                    </div>

                    {/* used to display and interact with a threaded conversation. When a user clicks to reply to a specific message, the Thread component is rendered */}
                    <Thread />
                </Channel>
            </Chat>
        </div>
    );
};

export default ChatPage;
