import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Attendance: undefined;
  Schedule: undefined;
  Leave: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};
