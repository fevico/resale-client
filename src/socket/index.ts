import { runAxiosAsync } from "@/api/axiosAsync";
import client, { baseURL } from "@/api/client";
import { TokenResponse } from "@/hooks/useClient";
import { Profile, updateAuthState } from "@/store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const socket = io(baseURL, {
  path: "/socket-message",
  autoConnect: false,
  transports: ["websocket"],
});

export const handleSocketConnection = (
  profile: Profile,
  dispatch: Dispatch<UnknownAction>,
) => {
  socket.auth = { token: profile.accessToken };
  socket.connect();
  socket.on("connect_error", async (error) => {
    if (error.message === "jwt expired") {
      const refreshToken = await AsyncStorage.getItem("refresh-token");
      const res = await runAxiosAsync<TokenResponse>(
        client.post(`${baseURL}/auth/refresh-token`, { refreshToken }),
      );
      if (res) {
        await AsyncStorage.setItem("access-token", res.tokens.access);
        await AsyncStorage.setItem("refresh-token", res.tokens.refresh);
        dispatch(
          updateAuthState({
            profile: { ...profile!, accessToken: res.tokens.access },
            pending: false,
          }),
        );
        socket.auth = { token: res.tokens.access };
        socket.connect();
      }
    }
  });
};
export default socket;
