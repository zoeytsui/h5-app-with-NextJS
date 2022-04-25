import React from 'react';

const Circle = ({ color = 'transparent' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" stroke="#C4C4C4" fill={color} className="bi bi-circle-fill" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" />
  </svg>
)

export default Circle;
