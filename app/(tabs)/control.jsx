import { ReactNativeJoystick } from '@korsolutions/react-native-joystick';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import useMQTT from '../components/MQTT';
import { commandTopic } from '../components/MQTT/commands';
//import KinesisWebRTCViewer from '../components/VideoKinesis/KinesisWebRTCViewer';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useAlertStore } from '../components/MQTT/store';

const throttle = (func, delay) => {
    let throttling = false;

    return (...args) => {
        if (!throttling) {
            throttling = true;
            func(...args);
            setTimeout(() => {
                throttling = false;
            }, delay);
        }
    };
};

const Control = () => {
    const { PublishMessage } = useMQTT();
    const [count, setCount] = useState(0);
    const [disableSound, setDisableSound] = useState(false);
    const [disableBallLauncher, setDisableBallLauncher] = useState(false);
    const [disableSnackDispenser, setDisableSnackDispenser] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const {streamingState, setStreamingState} = useAlertStore();
    
    const publishTopic = (topic, msg) => {
        PublishMessage(topic, msg);
    };

    const AUDIO_DIR = FileSystem.cacheDirectory + '/Audio/';
    const [audioOptions, setAudioOptions] = useState([]);

    const handlePress = useCallback(
        throttle((pos, data) => {
            publishTopic(pos, data);
        }, 170),
        []
    );

    const getAllFilePathsFromFolder = async () => {
        const list = await FileSystem.readDirectoryAsync(AUDIO_DIR);
        setAudioOptions(list);
    };

    const pickerRef = useRef();

    function open() {
        pickerRef.current.focus();
        setCount(count + 1);
        if (count > 10) setCount(0);
    }
    useEffect(() => {
        // publishTopic(commandTopic.cameraOnOff, 'switch camera');
        getAllFilePathsFromFolder();
    }, []);
    useEffect(() => {
        getAllFilePathsFromFolder();
    }, [count]);

    const timer = ms => new Promise(res => setTimeout(res, ms));

    const handlePlaySound = async () => {
      setDisableSound(true);
      open();
      await timer(30000);
      setDisableSound(false);
    }

    const handleThrowBall = async () => {
        setDisableBallLauncher(true);
      publishTopic(
        commandTopic.ballLaunch,
        'request a ball'
      );
      await timer(30000);
      setDisableBallLauncher(false);
    }

    const handleServeSnack = async () => {
        setDisableSnackDispenser(true);
      publishTopic(
        commandTopic.dropSnacks,
        'request to drop some snacks'
      );
      await timer(30000);
      setDisableSnackDispenser(false);
    }
//<KinesisWebRTCViewer />
    return (
        <SafeAreaView className="flex-1 items-center bg-[#191C4A]">
            <View className="h-[280px] bg-gray-200 m-6 w-full overflow-hidden">
                
            </View>
            <View className="flex-1 w-full px-6">
            <View className="flex-row justify-between mt-1">
                <CustomButton
                    title={`CAMERA ${streamingState ? 'OFF' : 'ON'}`}
                    isLoading={false}
                    containerStyles={`w-[48%] ${streamingState ?'bg-terciary' : 'bg-secondary'} h-12 mb-2`}
                    handlePress={() =>
                        {publishTopic(commandTopic.streamingOnOff, !streamingState);
                        setStreamingState(!streamingState);}
                    }
                />
                <CustomButton
                    title="LASER ON/OFF"
                    isLoading={false}
                    containerStyles={'w-[48%] bg-terciary h-12'}
                    handlePress={() =>
                        publishTopic(commandTopic.laserOnOff, 'switch laser')
                    }
                /></View>
                <View className="flex-row justify-between mt-3">
                    <CustomButton
                        title="PLAY SOUND"
                        isLoading={disableSound}
                        containerStyles={'w-[30%] bg-terciary h-12'}
                        textStyles={'text-[12px]'}
                        handlePress={handlePlaySound}
                    />
                    <CustomButton
                        title="THROW BALL"
                        isLoading={disableBallLauncher}
                        containerStyles={'w-[30%] bg-terciary h-12'}
                        textStyles={'text-[12px]'}
                        handlePress={handleThrowBall}
                    />
                    <CustomButton
                        title="SERVE SNACK"
                        isLoading={disableSnackDispenser}
                        containerStyles={'w-[30%] bg-terciary h-12'}
                        textStyles={'text-[12px]'}
                        handlePress={handleServeSnack}
                    />
                </View>
            </View>
            <View className="mb-10">
                <ReactNativeJoystick
                    color="#09C3B8"
                    radius={50}
                    onMove={(data) =>
                        handlePress(
                            commandTopic.laserPosition,
                            JSON.stringify(data)
                        )
                    }
                />
            </View>
            <View className="h-0">
                <Picker
                    ref={pickerRef}
                    style={{ width: '0%', height: 0 }}
                    onValueChange={(itemValue) =>
                    {    PublishMessage(commandTopic.soundPlay, itemValue);
                        console.log(itemValue);}
                    }
                >
                    <Picker.Item
                        key={'p1'}
                        label="Predefined Audio 1"
                        value="sound_1"
                    />
                    <Picker.Item
                        key={'p2'}
                        label="Predefined Audio 2"
                        value="sound_2"
                    />
                    <Picker.Item
                        key={'p3'}
                        label="Predefined Audio 3"
                        value="sound_3"
                    />
                    <Picker.Item
                        key={'p4'}
                        label="Predefined Audio 4"
                        value="sound_4"
                    />
                    <Picker.Item
                        key={'p5'}
                        label="Predefined Audio 5"
                        value="sound_5"
                    />
                    {audioOptions?.map((sound, index) => (
                        <Picker.Item
                            key={index}
                            label={`Custom Audio ${index + 1}`}
                            value={sound}
                        />
                    ))}
                </Picker>
            </View>
        </SafeAreaView>
    );
};
export default Control;
