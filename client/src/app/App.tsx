import React, { useReducer } from 'react';
import { FaPlus } from 'react-icons/fa';
import bindDispatch from '../shared/bindDispatch';
import NoteCard from '../noteCard/NoteCard';
import { reducer, getInitialState, actions } from './state';
import styles from './App.module.scss';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const { expressions } = state;

  const {
    updateExpression,
    backspaceDeleteExpression,
    enterAddExpression,
  } = bindDispatch(actions, dispatch);

  return (
    <div>
      <div className={styles.headerBar}>
        <div className={styles.headerTitle}>Math Notes</div>
        <div className={styles.icons}>
          <FaPlus className={styles.addNewCardIcon} title="Add new card" />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <NoteCard
          expressions={expressions}
          updateExpression={updateExpression}
          backspaceDeleteExpression={backspaceDeleteExpression}
          enterAddExpression={enterAddExpression}
        />
      </div>
    </div>
  );
};

export default App;
