import { ReactNativeJoystick } from '@korsolutions/react-native-joystick';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import useMQTT from '../components/MQTT';
import { commandTopic } from '../components/MQTT/commands';
import KinesisWebRTCViewer from '../components/VideoKinesis/KinesisWebRTCViewer';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useAlertStore } from '../components/MQTT/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
      await timer(10000);
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

    return (
        <SafeAreaView className="flex-1 items-center bg-[#121434]">
            <View className="flex-row justify-between items-center p-5 pr-5 w-full">
            <Text className="font-bold text-white text-3xl">C.A.T.S.</Text>
            <TouchableHighlight className="flex-row w-32 rounded-lg justify-center items-center py-1 bg-primary pr-2" onPress={()=>publishTopic(commandTopic.systemOnOff, "system turn on/off")}>
           <View className="flex flex-row gap-1 items-center">
            <MaterialCommunityIcons name="power" color={'#880808'} size={20} />
            <Text className="font-semibold text-white text-lg">Turn Off</Text>
           </View>
        </TouchableHighlight>
           </View>
            <View className="h-[280px] bg-gray-200 m-6 mt-0 w-full overflow-hidden">
                <KinesisWebRTCViewer />
            </View>
            <View className="flex-1 w-full px-6">
            <View className="flex-row justify-between mt-1">
                {/* <CustomButton
                    title={`CAMERA ${streamingState ? 'OFF' : 'ON'}`}
                    isLoading={false}
                    containerStyles={`w-[48%] ${streamingState ?'bg-terciary' : 'bg-secondary'} h-12 mb-2`}
                    handlePress={() =>
                        {publishTopic(commandTopic.streamingOnOff, !streamingState);
                        setStreamingState(!streamingState);}
                    }
                /> */}
                <CustomButton
                    title="PUMP ON/OFF"
                    icon={<MaterialCommunityIcons name="water-outline" color={'#40e0d0'} size={20} />}
                    isLoading={false}
                    containerStyles={'w-[48%] bg-terciary h-12'}
                    handlePress={() =>
                        publishTopic(commandTopic.pumpOnOff, "pump turn on/off")
                    }
                />
                <CustomButton
                    title="LASER ON/OFF"
                    icon={<MaterialCommunityIcons name="laser-pointer" color={'#40e0d0'} size={20} />}
                    isLoading={false}
                    containerStyles={'w-[48%] bg-terciary h-12'}
                    handlePress={() =>
                        publishTopic(commandTopic.laserOnOff, 'switch laser')
                    }
                /></View>
                <View className="flex-row justify-between mt-3">
                    <CustomButton
                        title="PLAY SOUND"
                        icon={<MaterialCommunityIcons name="volume-high" color={'#40e0d0'} size={20} />}
                        isLoading={disableSound}
                        containerStyles={'w-[32%] bg-terciary h-12'}
                        textStyles={'text-[12px]'}
                        handlePress={handlePlaySound}
                    />
                    <CustomButton
                        title="THROW BALL"
                        isLoading={disableBallLauncher}
                        icon={<MaterialCommunityIcons name="tennis-ball" color={'#40e0d0'} size={20} />}
                        containerStyles={'w-[32%] bg-terciary h-12'}
                        textStyles={'text-[12px]'}
                        handlePress={handleThrowBall}
                    />
                    <CustomButton
                        title="SERVE SNACK"
                        isLoading={disableSnackDispenser}
                        icon={<MaterialCommunityIcons name="food-apple-outline" color={'#40e0d0'} size={20} />}
                        containerStyles={'w-[32%] bg-terciary h-12'}
                        textStyles={'text-[12px]'}
                        handlePress={handleServeSnack}
                    />
                </View>
            </View>
            <View className="mb-10">
                <ReactNativeJoystick
                    color="#09C3B8"
                    radius={70}
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
                        value="1"
                    />
                    <Picker.Item
                        key={'p2'}
                        label="Predefined Audio 2"
                        value="2"
                    />
                    <Picker.Item
                        key={'p3'}
                        label="Predefined Audio 3"
                        value="3"
                    />
                    <Picker.Item
                        key={'p4'}
                        label="Predefined Audio 4"
                        value="4"
                    />
                    <Picker.Item
                        key={'p5'}
                        label="Predefined Audio 5"
                        value="5"
                    />
                    {audioOptions?.map((sound, index) => (
                        <Picker.Item
                            key={index}
                            label={`Custom Audio ${index + 1}`}
                            value={index + 6}
                        />
                    ))}
                </Picker>
            </View>
        </SafeAreaView>
    );
};
export default Control;
