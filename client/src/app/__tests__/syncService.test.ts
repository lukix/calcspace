import { compareStates } from '../syncService';

const cards = {
  A1: { id: 'A', expressions: [] },
  A2: { id: 'A', expressions: ['a = 5'] },
  B1: { id: 'B', expressions: [] },
  B2: { id: 'B', expressions: ['b = 5'] },
  C1: { id: 'C', expressions: [] },
  C2: { id: 'C', expressions: ['c = 5'] },
};

describe('syncService > compareStates', () => {
  it('should return info about deleted card', () => {
    // given
    const prevCards = [cards.A1, cards.B1, cards.C1];
    const newCards = [cards.A1, cards.C1];

    // when
    const change = compareStates(prevCards, newCards);

    // then
    expect(change).toEqual({ type: 'DELETE', data: { id: 'B' } });
  });

  it('should return info about added card', () => {
    // given
    const prevCards = [cards.A1, cards.B1];
    const newCards = [cards.C1, cards.A1, cards.B1];

    // when
    const change = compareStates(prevCards, newCards);

    // then
    expect(change).toEqual({ type: 'ADD', data: { id: 'C' } });
  });

  it('should return info about modified card', () => {
    // given
    const prevCards = [cards.A1, cards.B1, cards.C1];
    const newCards = [cards.A1, cards.B2, cards.C1];

    // when
    const change = compareStates(prevCards, newCards);

    // then
    expect(change).toEqual({ type: 'CHANGE', data: cards.B2 });
  });

  it('should return info about reordered cards when moving card up', () => {
    // given
    const prevCards = [cards.A1, cards.B1, cards.C1];
    const newCards = [cards.C1, cards.A1, cards.B1];

    // when
    const change = compareStates(prevCards, newCards);

    // then
    expect(change).toEqual({
      type: 'CHANGE_ORDER',
      data: { sourceIndex: 2, destinationIndex: 0 },
    });
  });

  it('should return info about reordered cards when moving card down', () => {
    // given
    const prevCards = [cards.A1, cards.B1, cards.C1];
    const newCards = [cards.B1, cards.C1, cards.A1];

    // when
    const change = compareStates(prevCards, newCards);

    // then
    expect(change).toEqual({
      type: 'CHANGE_ORDER',
      data: { sourceIndex: 0, destinationIndex: 2 },
    });
  });
});
