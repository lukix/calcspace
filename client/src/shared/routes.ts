const routes = {
  home: { path: '/' },
  analyzer: { path: '/analyzer' },
  signUp: { path: '/sign-up' },
  logIn: { path: '/log-in' },
  newFile: { path: '/new-file' },
  file: { path: '/file/:fileId' },
  unitsList: { path: '/units-list' },
  sharedViewFile: { path: '/shared/view/:id' },
  sharedEditFile: { path: '/shared/edit/:id' },
};

export default routes;
