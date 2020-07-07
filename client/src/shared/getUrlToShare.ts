const getUrlToShare = (path, id) => `${window.location.origin}${path.replace(':id', id)}`;

export default getUrlToShare;
