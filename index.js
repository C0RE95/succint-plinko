
// pages/index.js

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Head from "next/head";

const ROWS = 8;
const COLUMNS = 9;

const generateBoard = () => {
  const board = [];
  for (let i = 0; i < ROWS; i++) {
    const rowLength = i % 2 === 0 ? COLUMNS : COLUMNS - 1;
    const row = Array.from({ length: rowLength }, () => 0);
    board.push(row);
  }
  return board;
};

const getRandomScore = () => {
  const values = [2, 4, 8, 16, 32, 64];
  return values[Math.floor(Math.random() * values.length)];
};

export default function Home() {
  const [board, setBoard] = useState(generateBoard);
  const [ballX, setBallX] = useState(Math.floor(COLUMNS / 2));
  const [ballY, setBallY] = useState(0);
  const [zkp, setZkp] = useState(1000);
  const [dropping, setDropping] = useState(false);
  const dropInterval = useRef(null);

  useEffect(() => {
    if (dropping) {
      dropInterval.current = setInterval(() => {
        setBallY((prevY) => {
          if (prevY >= ROWS - 1) {
            clearInterval(dropInterval.current);
            const earned = getRandomScore();
            setZkp((s) => s + earned);
            setDropping(false);
            return 0;
          }
          const dir = Math.random() > 0.5 ? 1 : -1;
          setBallX((x) => Math.max(0, Math.min(COLUMNS - 1, x + dir)));
          return prevY + 1;
        });
      }, 300);
    }
    return () => clearInterval(dropInterval.current);
  }, [dropping]);

  const startDrop = () => {
    if (!dropping) {
      setBallX(Math.floor(COLUMNS / 2));
      setBallY(0);
      setDropping(true);
    }
  };

  return (
    <>
      <Head>
        <title>Succinct Plinko</title>
      </Head>
      <main className="min-h-screen bg-black text-pink-500 flex flex-col items-center justify-center p-4 relative">
        <h1 className="text-4xl font-bold mb-4">Succinct Plinko</h1>
        <div className="relative mb-4" style={{ height: `${ROWS * 24}px` }}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row?.map((_, colIndex) => (
                <div key={colIndex} className="w-4 h-4 rounded-full bg-pink-600"></div>
              ))}
            </div>
          ))}
          <motion.div
            className="absolute w-6 h-6 rounded-full bg-white"
            animate={{ x: `${ballX * 24}px`, y: `${ballY * 24}px` }}
            transition={{ type: "spring", stiffness: 100 }}
            style={{ left: 0, top: 0 }}
          />
        </div>
        <button
          onClick={startDrop}
          className="px-6 py-2 border border-pink-500 rounded hover:bg-pink-500 hover:text-black transition"
        >
          Drop Ball
        </button>
        <p className="mt-4 text-xl">Balance: {zkp} $ZKP</p>
      </main>
    </>
  );
}
