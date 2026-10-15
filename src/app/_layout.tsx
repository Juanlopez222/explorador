import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Root() {
  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}