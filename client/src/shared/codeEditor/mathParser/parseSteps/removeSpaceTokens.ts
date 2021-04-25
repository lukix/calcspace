import tokens from '../tokens';

const removeSpaceTokens = (tokensList) => tokensList.filter((token) => token.type !== tokens.SPACE);

export default removeSpaceTokens;
