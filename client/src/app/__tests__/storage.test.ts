import { loadAppState, persistAppState } from '../storage';

describe('state reducer', () => {
  it('loadAppState should return app state when it exists in localStorage', () => {
    // given
    const localStorage = {
      getItem: jest.fn(() => `{"cards": [{ "id": "2" }] }`),
    };
    const defaultState = { cards: [{ id: '1', expressions: [] }] };

    // when
    const appState = loadAppState(localStorage, defaultState);

    // then
    expect(appState).toEqual({ cards: [{ id: '2' }] });
  });

  it("loadAppState should return default app state when it doesn't exist in localStorage", () => {
    // given
    const localStorage = {
      getItem: jest.fn(),
    };
    const defaultState = { cards: [{ id: '1', expressions: [] }] };

    // when
    const appState = loadAppState(localStorage, defaultState);

    // then
    expect(appState).toEqual(defaultState);
  });

  it('persistAppState should persist app state', () => {
    // given
    const localStorage = {
      setItem: jest.fn(),
    };
    const state = { cards: [] };

    // when
    persistAppState(localStorage, state);

    // then
    expect(localStorage.setItem).toHaveBeenCalledWith('appState', '{"cards":[]}');
  });
});
