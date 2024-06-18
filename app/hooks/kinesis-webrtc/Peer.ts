import { MediaStream, RTCPeerConnection } from 'react-native-webrtc';

export interface Peer {
    id: string;
    connection?: RTCPeerConnection;
    isWaitingForMedia?: boolean;
    media?: MediaStream;
}
