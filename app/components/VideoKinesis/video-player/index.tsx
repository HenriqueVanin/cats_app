import React, { useRef, useEffect } from "react";

// This works
import { useViewer } from "../../VideoKinesis";
import Video from "react-native-video";
import { AWS_ARN_CHANNEL, AWS_REGION } from "../../MQTT/settings";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Text } from "react-native";

// This doesn't
// import { useViewer } from 'react-kinesis-webrtc';

function VideoFrame() {
  const config = {
    credentials: {
      accessKeyId: "AKIAVKGMV3KQIOBOOTGY",
      secretAccessKey: "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",
    },
    channelARN: AWS_ARN_CHANNEL,
    region: AWS_REGION,
    media: {
      audio: true,
      video: true,
    },
  };
  const {
    error,
    peer: { media } = { media: undefined},
  } = useViewer(config);

  const videoRef = useRef<any>();

  // Assign the peer media stream to a video source
  useEffect(() => {
    if (videoRef.current && media) {
      videoRef.current.srcObject = media;
    }
  }, [media, videoRef]);

  useEffect(() => {
    console.log(error?.message);
    if (error?.message === 'peer disconnected') {
      console.error(error.message);
    }
  },[error])

  // Display an error
  if (error) {
    return <Text>An error occurred: {error.message}</Text>;
  }

  if (!media) {
    return <Text>Connecting to the robot...</Text>
  }

  return <>
    <Video ref={videoRef} />
  </>
}
export default VideoFrame;