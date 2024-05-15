export default function Excalim() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1.2em"
        viewBox="0 0 64 512"
        style={{
          fill: 'black', // Default color
          transition: 'fill 0.3s ease', // Smooth transition for color change
          cursor: 'pointer', // Change cursor to pointer on hover
        }}
        onMouseOver={(e) => { e.target.style.fill = 'red'; }} // Change color to red on hover
        onMouseOut={(e) => { e.target.style.fill = 'black'; }} // Revert color on mouse out
      >
        <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
      </svg>
    </div>
  );
}
