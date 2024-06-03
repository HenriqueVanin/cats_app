// import { KinesisVideoClient, GetSignalingChannelEndpointCommand } from "@aws-sdk/client-kinesis-video"; // ES Modules import
// import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
// import "react-native-get-random-values";
// import { v4 as uuidv4 } from "uuid";

// import React, {useEffect, useState} from 'react';
// import {
//   SafeAreaView,
//   StatusBar,
//   Text,
//   TouchableHighlight,
//   View,
// } from 'react-native';
// import { AWS_ARN_CHANNEL, AWS_COGNITO_IDENTITY_POOL_ID, AWS_REGION } from "../MQTT/settings";
// const { CognitoIdentityClient, GetIdCommand } = require("@aws-sdk/client-cognito-identity");


// const VideoStream = () => {
//   let client = null;
//   const getCredentials = async () => {
//     const cognitoidentity = new CognitoIdentityClient({
//          credentials : fromCognitoIdentityPool({
//              clientConfig: { region: AWS_REGION },
//             //  client : new CognitoIdentityClient({ region: AWS_REGION }),
//              identityPoolId : AWS_COGNITO_IDENTITY_POOL_ID,
//           }),
//      });
//      const credentials = await cognitoidentity.config.credentials()
//      console.log('credentials: ', credentials)
//      client = new KinesisVideoClient(({ region: AWS_REGION, credentials: credentials }));
// }
    
//   const [stream, setStream] = useState(null);

//   useEffect(() => {
//     getCredentials();
//   },[]);
  
//   const input = { // GetSignalingChannelEndpointInput
//     ChannelARN: AWS_ARN_CHANNEL, // required
//     SingleMasterChannelEndpointConfiguration: { // SingleMasterChannelEndpointConfiguration
//         Protocols: "WEBRTC",
//         Role: "VIEWER",
//     },
//   };

//   const getVideoEndpoint = async () => {
//     if(client) {
//       const command = new GetSignalingChannelEndpointCommand(input);
//       console.log("command:",command);
//       const res = await client?.send(command.input);
//       console.log(res);
//       return res;
//     }
//   }
  
//   const start = async () => {
//     if (client && !stream) {
//       try {
//         const s = await getVideoEndpoint();
//         console.log("s:", s);
//         setStream(s.ResourceEndpoint);
//       } catch(e) {
//         console.error(e);
//       }
//     }
//   };
//   return (
//     <View>
//     </View>
//   );
// };


// export default VideoStream;