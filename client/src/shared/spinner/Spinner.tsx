import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

interface SpinnerProps {
  size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 100 }) => {
  return <MoonLoader size={size} color={'#DBD5A9'} loading={true} />;
};

export default Spinner;
