import "./styles.css";
import { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

export default function Anni() {
  const ref = useRef(null);

  useAnimationFrame((t) => {
    const rotate = Math.sin(t / 10000) * 200;
    const y = (1 + Math.sin(t / 1000)) * -50;
    ref.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
  });

  return (
    <div className="anni-container">
      <div className="cube" ref={ref}>
        <div className="side front">Transfer employee</div>
        <div className="side left">Join Employee after transfer</div>
        <div className="side right">Check Depot wise vacancy</div>
        <div className="side top">Transfer history and other report</div>
        <div className="side bottom">All maser Entery</div>
        <div className="side back">Emloyee and Depot skill base rating</div>
      </div>
    </div>
  );
}
