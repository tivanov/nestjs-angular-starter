import { Signal, signal } from '@angular/core';
import { ISignInResponse } from './auth.service';
import { UserDto } from '@app/contracts';

export interface ISessionState {
  isAuthenticated: boolean;
  token?: string;
  refreshToken?: string;
  user?: UserDto;
};

const localStorageKey = 'app_sessionState';

const blankState: ISessionState = {
  isAuthenticated: false,
};

let initialState = blankState;

let stateFromStorage = localStorage.getItem(localStorageKey);
if (stateFromStorage) {
  initialState = JSON.parse(stateFromStorage);
}

const writableSignal = signal<ISessionState>({ ...initialState });

export const AuthSignal: Signal<ISessionState> = writableSignal.asReadonly();

export const updateAuth = (newSessionState: ISessionState) => {
  writableSignal.set(newSessionState);
  localStorage.setItem(localStorageKey, JSON.stringify(newSessionState));
}

export const logOut = () => {
  updateAuth(blankState);
}

export const logIn = (response: ISignInResponse) => {
  const sessionState: ISessionState  = {
    isAuthenticated: true,
    token: response.token,
    refreshToken: response.refreshToken,
    user: response.user,
  };

  updateAuth(sessionState);
}
