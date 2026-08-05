import AvatarView from "@/components/ui/AvatarView";
import useAuth from "@/hooks/useAuth";
import colors from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { FC, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
};

type PeerProfile = {
  id: string;
  name: string;
  avatar?: string;
};

interface Props {}

const ChatWindow: FC<Props> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const { authState } = useAuth();
  const currentUserId = authState.profile?.id;

  const insets = useSafeAreaInsets();

  const { conversationId, peerProfile: peerProfileString } = useLocalSearchParams<{
    conversationId: string;
    peerProfile: string;
  }>();

  const peerProfile: PeerProfile | null = peerProfileString
    ? JSON.parse(peerProfileString)
    : null;

  const handleSend = () => {
    if (!inputText.trim() || !currentUserId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputText("");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <AvatarView size={36} uri={peerProfile?.avatar} />
              <Text style={styles.headerTitle}>
                {peerProfile?.name || "Chat"}
              </Text>
            </View>
          ),
        }}
      />

      {/* ✅ FIX: Set behavior={Platform.OS === 'ios' ? 'padding' : undefined} */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          data={messages}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isMe = item.senderId === currentUserId;
            return (
              <View
                style={[
                  styles.bubbleContainer,
                  isMe ? styles.myBubbleContainer : styles.peerBubbleContainer,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    isMe ? styles.myBubble : styles.peerBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMe ? styles.myText : styles.peerText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <View
          style={[
            styles.inputContainer,
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#94a3b8"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable
            onPress={handleSend}
            style={({ pressed }) => [
              styles.sendBtn,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="send" size={18} color="#ffffff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    paddingLeft: 5,
  },
  listContent: {
    paddingVertical: 10,
  },
  bubbleContainer: {
    paddingHorizontal: 14,
    marginVertical: 3,
  },
  myBubbleContainer: {
    alignItems: "flex-end",
  },
  peerBubbleContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: "80%",
  },
  myBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  peerBubble: {
    backgroundColor: "#f1f5f9",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: "#ffffff",
  },
  peerText: {
    color: "#0f172a",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
    color: "#0f172a",
  },
  sendBtn: {
    backgroundColor: colors.primary,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatWindow;