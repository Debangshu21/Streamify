import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

// function to get recommended users for authenticated user to add
export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { isOnboarded: true },
            ],
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Function to get the info of user's friends
export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        // prevent sending request to yourself
        if (myId === recipientId) {
            return res.status(400).json({ message: "You can't send friend request to yourself" });
        }

        // Checking if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        // Checking if already friends with recipient
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // check if a req already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });
        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "A friend request already exists between you and this user" });
        }


        // Create friend request if every condition above is fine
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);


        // Checking if friend request exists
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // Verify the current user is the recipient
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user to the other's friends array
        // $addToSet: adds elements to an array only if they do not already exist. 
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        // Fetching the pending friend requests sent to authenticated user
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        //Fetching accepted friend requests sent by authenticated user
        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        console.log("Error in getPendingFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        // Fetching pending requests sent by authenticated user
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log("Error in getOutgoingFriendReqs controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}