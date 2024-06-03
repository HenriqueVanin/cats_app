// import React, { useEffect, useRef } from "react";
// import { useViewer } from "react-kinesis-webrtc";
// import Video from 'react-native-video';
// import { AWS_ARN_CHANNEL, AWS_REGION } from "../MQTT/settings";
// import "react-native-get-random-values";
// import { v4 as uuidv4 } from "uuid";

// const Viewer = () => {
//   const config = {
//     credentials: {
//       accessKeyId: "AKIAVKGMV3KQIOBOOTGY",
//       secretAccessKey: "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",
//     },
//     channelARN: AWS_ARN_CHANNEL,
//     region: AWS_REGION,
//     media: {
//       audio: true,
//       video: true,
//     },
//   };

//   const {
//     error,
//     peer: { media } = {},
//   } = useViewer(config);

//   const videoRef = useRef(null);

//   // Assign the peer media stream to a video source
//   useEffect(() => {
//     if (videoRef.current) {
//       videoRef.current.srcObject = media;
//     }
//   }, [media, videoRef]);

//   // Display the peer media stream
//   return <Video ref={videoRef} />;
// }

// export default Viewer();