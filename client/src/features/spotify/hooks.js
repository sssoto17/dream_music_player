import { useEffect, useState } from "react";
import { mountScript, createPlayerInstance } from "./sdk";

export function useWebPlayer(token) {
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    mountScript();

    window.onSpotifyWebPlaybackSDKReady = () =>
      createPlayerInstance(token, setPlayer);
  }, [token]);

  return player;
}

export function usePlayback() {}
