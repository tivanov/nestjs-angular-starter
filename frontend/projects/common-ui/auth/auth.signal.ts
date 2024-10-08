import { inject, Signal, signal } from '@angular/core';
import { ISignInResponse } from './auth.service';
import { UserDto } from '@app/contracts';
import { EnvironmentService } from '../services/environment.service';

export interface ISessionState {
  isAuthenticated: boolean;
  token?: string;
  refreshToken?: string;
  user?: UserDto;
}

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
  const copyOf = { ...newSessionState };
  writableSignal.set(copyOf);
  localStorage.setItem(localStorageKey, JSON.stringify(newSessionState));
};

export const logOut = () => {
  updateAuth(blankState);
};

export const logIn = (response: ISignInResponse) => {
  const old = writableSignal();

  const sessionState: ISessionState = {
    ...old,
    isAuthenticated: true,
    token: response.token,
    refreshToken: response.refreshToken,
    user: response.user,
  };

  updateAuth(sessionState);
};
