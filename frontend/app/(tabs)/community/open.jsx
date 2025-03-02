import React, { useState } from "react";
import { 
  View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Modal 
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function CommunityPage() {
  const { discussion } = useLocalSearchParams();
  const BG_COLOR = "#0a0f1a";
  const SURFACE_COLOR = "#131d2a";
  const PRIMARY_COLOR = "#00b890";

  const parsedDiscussion = discussion ? JSON.parse(discussion) : null;

  if (!parsedDiscussion) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: BG_COLOR }}>
        <Text className="text-lg font-pmedium text-gray-400">No Discussion Found</Text>
      </SafeAreaView>
    );
  }

  const { title, description, createdBy, votes, comments } = parsedDiscussion;

  // Comments data and state management remains the same
  const commentBank = {
    "Fixing Potholes in Downtown": [
      { id: 1, author: "John Doe", text: "How can we report potholes?", likes: 5, liked: false, replies: [{ id: 1, author: "Sarah Lee", text: "@John Doe Try the city's website.", likes: 2, liked: false }] },
      { id: 2, author: "Sarah Lee", text: "Should we start a petition?", likes: 3, liked: false, replies: [] }
    ],
    "Community Cleanup Initiative": [
      { id: 1, author: "Liam Johnson", text: "How to organize a cleanup event?", likes: 6, liked: false, replies: [{ id: 1, author: "Olivia Carter", text: "@Liam Johnson We can make a signup form!", likes: 4, liked: false }] },
      { id: 2, author: "Sophia Adams", text: "Can local businesses sponsor cleanup drives?", likes: 8, liked: false, replies: [] }
    ],
    "Streetlight Safety Concerns": [
      { id: 1, author: "Ethan Wright", text: "Why are so many streetlights broken?", likes: 4, liked: false, replies: [{ id: 1, author: "Daniel Smith", text: "@Ethan Wright Budget cuts could be a reason.", likes: 2, liked: false }] },
      { id: 2, author: "Nina Patel", text: "How often are streetlights inspected?", likes: 5, liked: false, replies: [] }
    ],
    "Public Transport Delays Discussion": [
      { id: 1, author: "James Miller", text: "Why are buses always late?", likes: 9, liked: false, replies: [{ id: 1, author: "Emma Davis", text: "@James Miller Traffic is a big issue.", likes: 3, liked: false }] },
      { id: 2, author: "Lucas Green", text: "Should the city increase metro frequency?", likes: 7, liked: false, replies: [] }
    ],
  };
  const [commentsList, setCommentsList] = useState(commentBank[title] || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (newComment.trim() === "") return;
    
    if (replyTo) {
      setCommentsList((prev) =>
        prev.map((comment) =>
          comment.id === replyTo.id
            ? {
                ...comment,
                replies: [
                  { id: comment.replies.length + 1, author: "You", text: `@${replyTo.author} ${newComment}`, likes: 0, liked: false },
                  ...comment.replies,
                ],
              }
            : comment
        )
      );
    } else {
      setCommentsList([
        { id: commentsList.length + 1, author: "You", text: newComment, likes: 0, liked: false, replies: [] },
        ...commentsList
      ]);
    }

    setNewComment("");
    setReplyTo(null);
    setModalVisible(false);
  };

  // Like toggle for comments & replies
  const toggleLike = (commentId, isReply = false, replyId = null) => {
    setCommentsList((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? isReply
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === replyId
                    ? { ...reply, liked: !reply.liked, likes: reply.liked ? reply.likes - 1 : reply.likes + 1 }
                    : reply
                ),
              }
            : { ...comment, liked: !comment.liked, likes: comment.liked ? comment.likes - 1 : comment.likes + 1 }
          : comment
      )
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: BG_COLOR }}>
      <ScrollView 
        className="flex-1 mt-8" 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        
        {/* Header Section - Fixed with proper margins */}
        <View 
          className="mx-4 mt-4 mb-8 px-4 pt-6 pb-8 rounded-3xl" 
          style={{ backgroundColor: SURFACE_COLOR }}
        >
          <View className="flex-row items-start">
            <View 
              className="p-3 rounded-full mr-4" 
              style={{ backgroundColor: PRIMARY_COLOR + '20' }}
            >
              <MaterialIcons name="forum" size={28} color={PRIMARY_COLOR} />
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-pbold">{title}</Text>
              <Text className="text-[#94a3b8] text-base font-pregular mt-2">{description}</Text>
              <Text className="text-[#64748b] text-sm font-plight mt-2">Started by {createdBy}</Text>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View className="px-6 mt-2">
          <Text className="text-xl font-pbold text-white mb-6">Discussion</Text>

          {commentsList.map((comment) => (
            <View key={comment.id} className="p-4 rounded-xl mb-4" style={{ backgroundColor: SURFACE_COLOR }}>
              <Text className="text-white font-pmedium">{comment.author}</Text>
              <Text className="text-[#94a3b8] font-pregular mt-1">{comment.text}</Text>

              <View className="flex-row justify-between items-center mt-4">
                <TouchableOpacity className="flex-row items-center" onPress={() => toggleLike(comment.id)}>
                  <Ionicons 
                    name={comment.liked ? "heart" : "heart-outline"} 
                    size={20} 
                    color={comment.liked ? PRIMARY_COLOR : "#64748b"} 
                  />
                  <Text className={`ml-2 ${comment.liked ? 'text-[#00b890]' : 'text-[#64748b]'}`}>
                    {comment.likes}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setReplyTo(comment); setModalVisible(true); }}>
                  <Text className="text-[#00b890] font-pmedium">Reply</Text>
                </TouchableOpacity>
              </View>

              {comment.replies.map((reply) => (
                <View key={reply.id} className="ml-6 mt-4 p-3 rounded-lg" style={{ backgroundColor: BG_COLOR }}>
                  <Text className="text-white font-pmedium">{reply.author}</Text>
                  <Text className="text-[#94a3b8] font-pregular">{reply.text}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ 
          backgroundColor: PRIMARY_COLOR,
          shadowColor: PRIMARY_COLOR,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
        onPress={() => {
          setReplyTo(null);
          setNewComment('');
          setModalVisible(true);
        }}
      >
        <MaterialIcons name="chat" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal for Adding Comment/Reply */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl p-6" style={{ backgroundColor: SURFACE_COLOR }}>
            {/* Modal Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-pbold">
                {replyTo ? `Reply to ${replyTo.author}` : 'Add Comment'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  setReplyTo(null);
                  setNewComment('');
                }}
                className="p-2"
              >
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Reply Context */}
            {replyTo && (
              <View className="p-4 rounded-xl mb-4" style={{ backgroundColor: BG_COLOR }}>
                <Text className="text-[#64748b] text-sm font-plight mb-1">Replying to:</Text>
                <Text className="text-white font-pregular">{replyTo.text}</Text>
              </View>
            )}

            {/* Input Area */}
            <View className="rounded-xl mb-4" style={{ backgroundColor: BG_COLOR }}>
              <TextInput
                placeholder={replyTo ? "Write your reply..." : "Share your thoughts..."}
                placeholderTextColor="#64748b"
                value={newComment}
                onChangeText={setNewComment}
                className="min-h-[100] p-4 text-white font-pregular"
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  setReplyTo(null);
                  setNewComment('');
                }}
                className="px-6 py-3 rounded-xl"
                style={{ backgroundColor: BG_COLOR }}
              >
                <Text className="text-[#94a3b8] font-pmedium">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={addComment}
                className={`px-6 py-3 rounded-xl ${
                  newComment.trim() ? 'opacity-100' : 'opacity-50'
                }`}
                style={{ backgroundColor: PRIMARY_COLOR }}
                disabled={!newComment.trim()}
              >
                <Text className="text-white font-pmedium">
                  {replyTo ? 'Reply' : 'Post'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Safe Area Spacer */}
            <View className="h-6" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}