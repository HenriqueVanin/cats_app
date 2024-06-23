/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
//import '../shim'
import { CognitoIdentityCredentials } from "@aws-sdk/credential-provider-cognito-identity/dist-types/fromCognitoIdentity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { toUtf8 } from "@aws-sdk/util-utf8-browser";
import { auth, iot, mqtt5 } from "aws-iot-device-sdk-v2";
import { once } from "events";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
// @ts-ignore
import ActivityRepository, {
  Activity,
} from "../../database/ActivityRepository";
import { alertTitle, alertTopic, alertType } from "./commands";
import {
  AWS_COGNITO_IDENTITY_POOL_ID,
  AWS_IOT_ENDPOINT,
  AWS_REGION,
} from "./settings";
import { useAlertStore } from "./store";

function log(msg: string) {
  let now = new Date();
  // console.log(`${now.toString()}: ${msg}`);
}

/**
 * AWSCognitoCredentialOptions. The credentials options used to create AWSCongnitoCredentialProvider.
 */
interface AWSCognitoCredentialOptions {
  IdentityPoolId: string;
  Region: string;
}

const repository = new ActivityRepository();
/**
 * AWSCognitoCredentialsProvider. The AWSCognitoCredentialsProvider implements AWS.CognitoIdentityCredentials.
 *
 */
class AWSCognitoCredentialsProvider extends auth.CredentialsProvider {
  private options: AWSCognitoCredentialOptions;
  private cachedCredentials?: CognitoIdentityCredentials;

  constructor(
    options: AWSCognitoCredentialOptions,
    expire_interval_in_ms?: number
  ) {
    super();
    this.options = options;

    setInterval(async () => {
      await this.refreshCredentials();
    }, expire_interval_in_ms ?? 3600 * 1000);
  }

  getCredentials() {
    return {
      aws_access_id: this.cachedCredentials?.accessKeyId ?? "",
      aws_secret_key: this.cachedCredentials?.secretAccessKey ?? "",
      aws_sts_token: this.cachedCredentials?.sessionToken,
      aws_region: this.options.Region,
    };
  }

  async refreshCredentials() {
    log("Fetching Cognito credentials");
    this.cachedCredentials = await fromCognitoIdentityPool({
      // Required. The unique identifier for the identity pool from which an identity should be
      // retrieved or generated.
      identityPoolId: this.options.IdentityPoolId,
      clientConfig: { region: this.options.Region },
    })();
    // console.log(this.cachedCredentials);
  }
}

function createClient(
  provider: AWSCognitoCredentialsProvider
): mqtt5.Mqtt5Client {
  let wsConfig: iot.WebsocketSigv4Config = {
    credentialsProvider: provider,
    region: AWS_REGION,
  };

  let builder: iot.AwsIotMqtt5ClientConfigBuilder =
    iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
      AWS_IOT_ENDPOINT,
      wsConfig
    );

  let client: mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());

  client.on("error", (error) => {
    log("Error event: " + error.toString());
  });

  client.on(
    "messageReceived",
    (eventData: mqtt5.MessageReceivedEvent): void => {
      log("Message Received event: " + JSON.stringify(eventData.message));
      if (eventData.message.payload) {
        log("  with payload: " + toUtf8(eventData.message.payload as Buffer));
      }
    }
  );

  client.on("attemptingConnect", (eventData: mqtt5.AttemptingConnectEvent) => {
    log("Attempting Connect event");
  });

  client.on("connectionSuccess", (eventData: mqtt5.ConnectionSuccessEvent) => {
    log("Connection Success event");
    log("Connack: " + JSON.stringify(eventData.connack));
    log("Settings: " + JSON.stringify(eventData.settings));
  });

  client.on("connectionFailure", (eventData: mqtt5.ConnectionFailureEvent) => {
    log("Connection failure event: " + eventData.error.toString());
  });

  client.on("disconnection", (eventData: mqtt5.DisconnectionEvent) => {
    log("Disconnection event: " + eventData.error.toString());
    if (eventData.disconnect !== undefined) {
      log("Disconnect packet: " + JSON.stringify(eventData.disconnect));
    }
  });

  client.on("stopped", (eventData: mqtt5.StoppedEvent) => {
    log("Stopped event");
  });

  return client;
}

function useMQTT() {
  var client: mqtt5.Mqtt5Client;
  const [count, setCount] = useState(0);
  const [actual, setActual] = useState(0);
  const qos0Topic = "/teste";
  const alertStore = useAlertStore();

  const create = async (title: string, type: string) => {
    const date = String(Date.now());
    Toast.show({
      type: alertType[type],
      text1: title,
      text2: String(new Date(Number(date))),
    });
    updateAll();
    const recentUpdate = alertStore.activities.some(
      (item) =>
        new Date(item.timeStamp).getMinutes() === new Date(date).getMinutes() &&
        new Date(item.timeStamp).getHours() === new Date(date).getHours() &&
        item.title === title &&
        item.type === type
    );
    if (!recentUpdate) {
      await repository.create({
        title: title,
        type: type,
        timeStamp: date,
      });
    }
  };

  const updateAll = async () => {
    const activities: Activity[] = await repository.all();
    alertStore.setActivities(activities);
  };

  async function testSuccessfulConnection() {
    /** Set up the credentialsProvider */
    const provider = new AWSCognitoCredentialsProvider({
      IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
      Region: AWS_REGION,
    });
    /** Make sure the credential provider fetched before setup the connection */
    await provider.refreshCredentials();

    client = createClient(provider);

    const attemptingConnect = once(client, "attemptingConnect");
    const connectionSuccess = once(client, "connectionSuccess");

    client.start();

    await attemptingConnect;
    await connectionSuccess;
    console.log("Deu bom");
    const suback = await client.subscribe({
      subscriptions: [{ qos: mqtt5.QoS.AtLeastOnce, topicFilter: qos0Topic }],
    });
    log("Suback result: " + JSON.stringify(suback));

    const qos0PublishResult = await client.publish({
      qos: mqtt5.QoS.AtLeastOnce,
      topicName: qos0Topic,
      payload: "This is a qos 0 payload",
    });
    log("QoS 0 Publish result: " + JSON.stringify(qos0PublishResult));
    /*
        let unsuback = await client.unsubscribe({
            topicFilters: [
                qos0Topic
            ]
        });
        log('Unsuback result: ' + JSON.stringify(unsuback));*/
    console.log("S");
    ListenMessage();
    initialSubscribeConfig();
  }

  async function SubscribeToTopic(topic: string) {
    return await client.subscribe({
      subscriptions: [{ qos: mqtt5.QoS.AtLeastOnce, topicFilter: topic }],
    });
  }

  function initialSubscribeConfig() {
    Object.values(alertTopic).map((topic: string) => SubscribeToTopic(topic));
  }

  async function ListenMessage() {
    if (client)
      client.on(
        "messageReceived",
        (eventData: mqtt5.MessageReceivedEvent): void => {
          log("Message Received event: " + JSON.stringify(eventData.message));
          const msg = toUtf8(eventData.message.payload as Buffer);
          const eventTopic = eventData.message.topicName;
          if (
            Object.values(alertTopic).some((command) => command === eventTopic)
          ) {
            const tMsg = JSON.stringify(msg)?.replaceAll(/"/g, "");
            if (tMsg !== "" && tMsg) {
              let newStatus = alertStore.alertStatus;
              newStatus[eventTopic?.replace("/", "")] = tMsg;
              alertStore.setAlertStatus(newStatus);
              setCount(count + 1);
              create(
                alertTitle[eventTopic?.replace("/", "")] + tMsg,
                eventTopic?.replace("/", "")
              );
              updateAll();
            }
          }
          if (eventData.message.payload) {
            log(
              "  with payload: " + toUtf8(eventData.message.payload as Buffer)
            );
          }
        }
      );
  }

  async function PublishMessage(topicName: string, msg: string) {
    testSuccessfulConnection().then(async () => {
      const publishResult = await client
        .publish({
          qos: mqtt5.QoS.AtLeastOnce,
          topicName: topicName,
          payload: {
            msg,
          },
        })
        .then(() => {
          console.log(
            "Button Clicked, Publish result: " + JSON.stringify(publishResult)
          );
          log(
            "Button Clicked, Publish result: " + JSON.stringify(publishResult)
          );
        })
        .catch((error) => {
          log(`Error publishing: ${error}`);
        });
    });
  }

  useEffect(() => {
    testSuccessfulConnection(); //initial execution
    PublishMessage("/onOffVideoStreaming", "off");
  }, []);

  async function CloseConnection() {
    const disconnection = once(client, "disconnection");
    const stopped = once(client, "stopped");

    client.stop();

    await disconnection;
    await stopped;
  }

  return { ListenMessage, PublishMessage, SubscribeToTopic };
}

export default useMQTT;
