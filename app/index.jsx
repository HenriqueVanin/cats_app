import 'node-libs-react-native/globals';

import { Link } from 'expo-router';
import { LogBox, Text, View } from 'react-native';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
globalThis.ReadableStream = ReadableStream;

export default function Welcome() {
    return (
        <View className="flex-1 items-center justify-center bg-[#191C4A]">
            <Text className="text-white font-bold text-6xl">C.A.T.S.</Text>
            <Link
                href={'/home'}
                className="mt-2 font-bold text-1xl bg-secondary p-2 rounded-full px-5 text-white"
            >
                ENTER
            </Link>
        </View>
    );
}
