import React, { useState, useEffect } from "react";
import axios from "axios";
import Board from "@lourenci/react-kanban";
import "@lourenci/react-kanban/dist/styles.css";

const board = {
  columns: [
    { id: 1, title: "SUSPENDATE", cards: [] },

    { id: 2, title: "ACTIVE", cards: [] },

    { id: 3, title: "FINALIZATE", cards: [] },
  ],
};

function UncontrolledBoard() {
  const [controlledBoard, setControlledBoard] = useState(board);

  useEffect(() => {
    const fetchData = async () => {
      let result = await axios("http://localhost:9000/projects");

      let auxBoard = [];
      for (let i = 0; i < result.data.length; i++) {
        auxBoard.push({
          id: result.data[i]._id,
          title: result.data[i].description,
          description: result.data[i].coordinator,
          status: result.data[i].status,
        });
      }
      let newBoard = { ...board };
      for (let i = 0; i < auxBoard.length; i++) {
        if (auxBoard[i].status === "suspended")
          newBoard.columns[0].cards.push(auxBoard[i]);
        else if (auxBoard[i].status === "active")
          newBoard.columns[1].cards.push(auxBoard[i]);
        else if (auxBoard[i].status === "finalized")
          newBoard.columns[2].cards.push(auxBoard[i]);
        else console.log("STATUS NECUNOSCUT PENTRU PROIECT");
      }

      setControlledBoard(newBoard);
    };

    fetchData();
    return () => {
      board.columns[0].cards = [];
      board.columns[1].cards = [];
      board.columns[2].cards = [];
    };
  }, []);

  return (
    <>
      <Board
        allowRemoveLane
        allowRenameColumn
        allowRemoveCard
        onLaneRemove={console.log}
        onCardRemove={console.log}
        onLaneRename={console.log}
        initialBoard={controlledBoard}
        // allowAddCard={{ on: "top" }}
        onNewCardConfirm={(draftCard) => ({
          id: new Date().getTime(),
          ...draftCard,
        })}
        onCardNew={console.log}
      />
    </>
  );
}

export default function App() {
  return (
    <>
      <UncontrolledBoard />
    </>
  );
}
