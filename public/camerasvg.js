import { useState } from 'react';

export default function Camera() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1.2em"
        viewBox="0 0 512 512"
        className="camera-icon"
        style={{ cursor: "pointer" }} // Inline CSS for cursor
        onMouseEnter={() => setIsHovered(true)} // Event handler for mouse enter
        onMouseLeave={() => setIsHovered(false)} // Event handler for mouse leave
      >
        <path 
          xmlns="http://www.w3.org/2000/svg"
          d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z     M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9    v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z     M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z     M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z"
          style={{ fill: isHovered ? "red" : "black", transition: "fill 0.3s" }} // Inline CSS for fill color and transition
        />
        <circle fill="#FFC107" cx="392" cy="128" r="24" />
      </svg>
    </div>
  );
}
