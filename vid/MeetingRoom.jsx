import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "your_agora_app_id";

const MeetingRoom = ({ channelName, token, role }) => {
  const [rtcClient] = useState(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));
  const [localTrack, setLocalTrack] = useState(null);

  useEffect(() => {
    const joinMeeting = async () => {
      await rtcClient.join(APP_ID, channelName, token, null);
      const localTrack = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTrack(localTrack);

      await rtcClient.publish(localTrack);
    };

    joinMeeting();

    return () => {
      localTrack?.stop();
      localTrack?.close();
      rtcClient.leave();
    };
  }, [rtcClient, channelName, token]);

  return (
    <div>
      <h2>Meeting Room: {channelName}</h2>
      <button onClick={() => rtcClient.leave()}>Leave Meeting</button>
    </div>
  );
};

export default MeetingRoom;
