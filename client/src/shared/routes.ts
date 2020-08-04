const routes = {
  home: { path: '/' },
  landing: { path: '/landing' },
  logIn: { path: '/log-in' },
  signUp: { path: '/sign-up' },
  newFile: { path: '/new-file' },
  file: { path: '/file/:fileId' },
  unitsList: { path: '/units-list' },
  sharedViewFile: { path: '/shared/view/:id' },
  sharedEditFile: { path: '/shared/edit/:id' },
};

export default routes;
