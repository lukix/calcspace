import { getReducer, getCardActions, actions } from '../state';

const generateId = () => '99';

const commonTestState = {
  cards: [
    {
      id: '1',
      expressions: [
        { id: '1', value: '123', result: 123, error: null, showResult: false },
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
    const newState = getReducer(generateId)(prevState, updateAction);

    // then
    expect(newState).toEqual({
      cards: [
        {
          id: '1',
          expressions: [
            { id: '1', value: '5', result: 5, error: null, showResult: false },
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
    const newState = getReducer(generateId)(
      prevState,
      enterAddExpressionAction
    );

    // then
    expect(newState).toEqual({
      cards: [
        {
          id: '1',
          expressions: [
            {
              id: '1',
              value: '12',
              result: 12,
              error: null,
              showResult: false,
            },
            { id: '99', value: '3', result: 3, error: null, showResult: false },
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
            {
              id: '1',
              value: '123',
              result: 123,
              error: null,
              showResult: false,
            },
            {
              id: '2',
              value: '456',
              result: 456,
              error: null,
              showResult: false,
            },
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
    const newState = getReducer(generateId)(
      prevState,
      backspaceDeleteExpressionAction
    );

    // then
    expect(newState).toEqual({
      cards: [
        {
          id: '1',
          expressions: [
            {
              id: '1',
              value: '123456',
              result: 123456,
              error: null,
              showResult: false,
            },
          ],
        },
      ],
    });
  });
});
