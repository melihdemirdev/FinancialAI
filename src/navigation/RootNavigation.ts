import React, { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: any) {
  navigationRef.current?.navigate(name, params);
}

export function reset(state: any) {
  navigationRef.current?.reset(state);
}

export function goBack() {
  navigationRef.current?.goBack();
}