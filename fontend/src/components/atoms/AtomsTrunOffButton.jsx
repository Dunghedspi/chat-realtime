import React from 'react';
import { Button } from './AtomsButton';

export const AtomsTurnOffButton = ({ onTurnOff }) => {
  return <Button onClick={() => onTurnOff()}>TurnOff</Button>;
};
