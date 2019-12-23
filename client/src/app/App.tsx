import React, { useReducer } from 'react';
import { FaPlus } from 'react-icons/fa';
import bindDispatch from '../shared/bindDispatch';
import NoteCard from '../noteCard/NoteCard';
import { reducer, getInitialState, getCardActions, actions } from './state';
import styles from './App.module.scss';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const { cards } = state;

  const { addCard } = bindDispatch(actions, dispatch);

  const cardsComponents = cards.map(({ id, expressions }) => {
    const {
      updateExpression,
      backspaceDeleteExpression,
      enterAddExpression,
      deleteCard,
    } = bindDispatch(getCardActions(id), dispatch);

    return (
      <NoteCard
        key={id}
        expressions={expressions}
        updateExpression={updateExpression}
        backspaceDeleteExpression={backspaceDeleteExpression}
        enterAddExpression={enterAddExpression}
        deleteCard={deleteCard}
      />
    );
  });

  return (
    <div>
      <div className={styles.headerBar}>
        <div className={styles.headerTitle}>Math Notes</div>
        <div className={styles.icons}>
          <FaPlus
            className={styles.addNewCardIcon}
            title="Add new card"
            onClick={() => addCard()}
          />
        </div>
      </div>
      <div className={styles.contentContainer}>{cardsComponents}</div>
    </div>
  );
};

export default App;
