import { reducer, getCardActions, actions } from '../state';

const commonTestState = {
  cards: [
    {
      id: '1',
      expressions: [
        { value: '123', result: 123, error: null, showResult: false },
      ],
    },
  ],
};

describe('state reducer', () => {
  it('should add a card', () => {
    // given
    const prevState = commonTestState;
    const addCardAction = actions.addCard();

    // when
    const newState = reducer(prevState, addCardAction);

    // then
    expect(newState.cards.length).toEqual(2);
  });

  it('should delete a card', () => {
    // given
    const prevState = commonTestState;

    const cardId = '1';
    const deleteCardAction = getCardActions(cardId).deleteCard();

    // when
    const newState = reducer(prevState, deleteCardAction);

    // then
    expect(newState.cards.length).toEqual(0);
  });

  it('should update expression', () => {
    // given
    const prevState = commonTestState;

    const cardId = '1';
    const expressionIndex = 0;
    const newValue = '5';

    const updateAction = getCardActions(cardId).updateExpression(
      expressionIndex,
      newValue
    );

    // when
    const newState = reducer(prevState, updateAction);

    // then
    expect(newState).toEqual({
      cards: [
        {
          id: '1',
          expressions: [
            { value: '5', result: 5, error: null, showResult: false },
          ],
        },
      ],
    });
  });

  it('should enter add expression', () => {
    // given
    const prevState = commonTestState;

    const cardId = '1';
    const expressionIndex = 0;
    const textLeft = '12';
    const textRight = '3';

    const enterAddExpressionAction = getCardActions(cardId).enterAddExpression(
      expressionIndex,
      textLeft,
      textRight
    );

    // when
    const newState = reducer(prevState, enterAddExpressionAction);

    // then
    expect(newState).toEqual({
      cards: [
        {
          id: '1',
          expressions: [
            { value: '12', result: 12, error: null, showResult: false },
            { value: '3', result: 3, error: null, showResult: false },
          ],
        },
      ],
    });
  });

  it('should backspace delete expression', () => {
    // given
    const prevState = {
      cards: [
        {
          id: '1',
          expressions: [
            { value: '123', result: 123, error: null, showResult: false },
            { value: '456', result: 456, error: null, showResult: false },
          ],
        },
      ],
    };

    const cardId = '1';
    const expressionIndex = 1;
    const text = '456';

    const backspaceDeleteExpressionAction = getCardActions(
      cardId
    ).backspaceDeleteExpression(expressionIndex, text);

    // when
    const newState = reducer(prevState, backspaceDeleteExpressionAction);

    // then
    expect(newState).toEqual({
      cards: [
        {
          id: '1',
          expressions: [
            { value: '123456', result: 123456, error: null, showResult: false },
          ],
        },
      ],
    });
  });
});
