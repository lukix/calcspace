import { useState, useEffect, useCallback } from 'react';
import socketIO from 'socket.io-client';
import * as diff from 'diff';

import { SOCKETS_URL } from '../../config';

import findNewCursorPosition from './findNewCursorPosition';
import mergeChanges from './mergeChanges';

const useSharedFileChangeListener = ({
  socketSubscribePath,
  id,
  commit,
  code,
  selectionStart,
  selectionEnd,
  changeHandler,
}) => {
  const [socket, setSocket] = useState<any>(null);

  const handleSocketChangeMessage = useCallback(
    (data) => {
      const newCode = mergeChanges(commit.code, code, data.code);
      const diffResult = diff.diffChars(code, newCode);
      const newSelectionStart = findNewCursorPosition(diffResult, selectionStart);
      const newSelectionEnd = findNewCursorPosition(diffResult, selectionEnd);

      changeHandler({ data, newCode, newSelectionStart, newSelectionEnd });
    },
    [changeHandler, commit, code, selectionStart, selectionEnd]
  );

  useEffect(() => {
    const newSocket = socketIO(SOCKETS_URL);
    newSocket.emit(socketSubscribePath, { id });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [id, socketSubscribePath]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.on('change', handleSocketChangeMessage);
    return () => socket.off('change');
  }, [socket, handleSocketChangeMessage]);
};

export default useSharedFileChangeListener;
