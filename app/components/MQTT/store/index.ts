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
}

export const useAlertStore = create<AlertStore>((set) => ({
  alertStatus: {
    waterTemperature: "-",
    waterLevelAlert: "-",
    snacksLevelAlert: "-",
    temperatureAlert: ""
  },
  activities: [],
  setActivities: (activities: Activity[]) => set(() => ({activities})),
  setAlertStatus: (alertStatus: any) => set((state) => ({ alertStatus })),
}));
