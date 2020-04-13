import React from 'react';
import MoonLoader from 'react-spinners/MoonLoader';

interface SpinnerProps {
  size?: number;
  show?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 100, show = true }) => {
  return <MoonLoader size={size} color={'#DBD5A9'} loading={show} />;
};

export default Spinner;
