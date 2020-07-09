const SharedFilesManager = ({ io }) => {
  const filesMemory = new Map<string, Array<{ commitId: string; date: Date; code: string }>>();
  let connectedUsers = 0;
  io.on('connection', (socket) => {
    connectedUsers++;
    console.log(`users connected: ${connectedUsers}`);

    socket.on('subscribe-to-file/by-edit-id', (data) => {
      socket.join(`shared/edit/${data.id}`);
    });

    socket.on('subscribe-to-file/by-view-id', (data) => {
      socket.join(`shared/view/${data.id}`);
    });

    socket.on('subscribe-to-file/by-main-id', (data) => {
      socket.join(`shared/main/${data.id}`);
    });

    socket.on('disconnect', () => {
      connectedUsers--;
      console.log(`users connected: ${connectedUsers}`);
    });
  });

  return {
    getFileCommits: (id) => filesMemory.get(id),
    setFileCommits: (id, commits) => filesMemory.set(id, commits),
    emitChange: ({ newCommit, sharedEditId, sharedViewId, fileId }) => {
      const payload = {
        code: newCommit.code,
        commitId: newCommit.commitId,
      };

      if (sharedEditId) {
        io.to(`shared/edit/${sharedEditId}`).emit('change', payload);
      }
      if (sharedViewId) {
        io.to(`shared/view/${sharedViewId}`).emit('change', payload);
      }
      if (fileId) {
        io.to(`shared/main/${fileId}`).emit('change', payload);
      }
    },
  };
};

export default SharedFilesManager;
