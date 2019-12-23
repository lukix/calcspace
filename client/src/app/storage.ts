const appStateStorageKey = 'appState';

export const loadAppState = (localStorage, defaultState) => {
  const state = localStorage.getItem(appStateStorageKey);
  return (state && JSON.parse(state)) || defaultState;
};

export const persistAppState = (localStorage, state) => {
  localStorage.setItem(appStateStorageKey, JSON.stringify(state));
};
