import { getReducer, getCardActions, actions } from '../state';

const generateId = () => '99';

const commonTestState = {
  cards: [
    {
      id: '1',
      code: '123',
      evaluatedCode: '123',
    },
  ],
};

describe('state reducer', () => {
  it('should add a card', () => {
    // given
    const prevState = commonTestState;
    const addCardAction = actions.addCard();

    // when
    const newState = getReducer(generateId)(prevState, addCardAction);

    // then
    expect(newState.cards.length).toEqual(2);
  });

  it('should delete a card', () => {
    // given
    const prevState = commonTestState;

    const cardId = '1';
    const deleteCardAction = getCardActions(cardId).deleteCard();

    // when
    const newState = getReducer(generateId)(prevState, deleteCardAction);

    // then
    expect(newState.cards.length).toEqual(0);
  });

  it('should update code', () => {
    // given
    const prevState = commonTestState;

    const cardId = '1';
    const newValue = '5';

    const updateAction = getCardActions(cardId).updateCode(newValue);

    // when
    const newState = getReducer(generateId)(prevState, updateAction);

    // then
    expect(newState).toEqual({
      cards: [
        {
          id: '1',
          code: '5',
          evaluatedCode: '5',
        },
      ],
    });
  });

  it('should reorder cards', () => {
    // given
    const prevState = {
      cards: [
        { id: '0', code: '', evaluatedCode: '' },
        { id: '1', code: '', evaluatedCode: '' },
        { id: '2', code: '', evaluatedCode: '' },
        { id: '3', code: '', evaluatedCode: '' },
      ],
    };

    const sourceCardIndex = 2;
    const destinationCardIndex = 0;

    const updateAction = actions.reorderCards(
      sourceCardIndex,
      destinationCardIndex
    );

    // when
    const newState = getReducer(generateId)(prevState, updateAction);

    // then
    expect(newState).toEqual({
      cards: [
        { id: '2', code: '', evaluatedCode: '' },
        { id: '0', code: '', evaluatedCode: '' },
        { id: '1', code: '', evaluatedCode: '' },
        { id: '3', code: '', evaluatedCode: '' },
      ],
    });
  });
});
