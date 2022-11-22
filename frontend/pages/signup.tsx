import React from 'react';
import Signup from '../components/signup';

const Index = () => {
  return (
    <Signup
      onSuccess={function (): void {
        throw new Error('Function not implemented.');
      }}
    />
  );
};
