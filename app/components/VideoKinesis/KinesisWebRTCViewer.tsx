import React from 'react';
import { Text } from 'react-native';

import { RTCView } from 'react-native-webrtc';
import { useViewer } from '../../hooks/kinesis-webrtc';
import {
    ACCESS_KEY_ID,
    AWS_ARN_CHANNEL,
    AWS_REGION,
    SECRET_ACCESS_KEY,
} from '../MQTT/settings';

const KinesisWebRTCViewer = () => {
    const config = {
        credentials: {
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY,
        },
        channelARN: AWS_ARN_CHANNEL,
        region: AWS_REGION,
    };

    const { error, peer } = useViewer(config);

    if (error) {
        return <Text>{error.message}</Text>;
    }

    // Display the peer media stream
    return (
        <RTCView
            objectFit="cover"
            streamURL={peer.media?.toURL()}
            zOrder={100}
            style={{ flex: 1 }}
        />
    );
};

export default KinesisWebRTCViewer;
