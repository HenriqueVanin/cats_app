import { create } from "zustand";

interface Activity { 
  title: string,
  type: string,
  timeStamp: string
}
export interface AlertStore {
  alertStatus: {
    waterTemperature: string,
    waterLevelAlert: string,
    snacksLevelAlert: string,
    temperatureAlert: string,
  };
  activities : Activity[],
  setAlertStatus: (a: any) => void;
  setActivities:(activities: Activity[]) => void;
  streamingState: boolean;
  setStreamingState: (streamingState: boolean) => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  streamingState: true,
  alertStatus: {
    waterTemperature: "-",
    waterLevelAlert: "-",
    snacksLevelAlert: "-",
    temperatureAlert: ""
  },
  activities: [],
  setStreamingState: (streamingState: boolean) => set(() => ({streamingState})),
  setActivities: (activities: Activity[]) => set(() => ({activities})),
  setAlertStatus: (alertStatus: any) => set((state) => ({ alertStatus })),
}));
