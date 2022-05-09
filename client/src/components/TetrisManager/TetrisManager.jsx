import React from "react";

// Components
import Tetris from "../Tetris/Tetris";
import StartMenu from "../StartMenu/StartMenu";
// utils
import Events from "../../utils/Events";
import ConnectionManager from "../../utils/ConnectionManager";
// styled components
import { StyledTetrisManager } from "./TetrisManager.styles";

class TetrisManager extends React.Component {
  constructor() {
    super();
    this.state = {
      players: new Map(),
      highscores: [],
      isStartGame: true,
    };
  }

  componentDidMount() {
    this.createPlayer();
    this.connectionManager = new ConnectionManager(this);
    this.connectionManager.connect("ws://localhost:8080");
    // this.connectionManager.connect("wss://react-tetris-api.herokuapp.com/");
  }

  connectToServer = () => {};

  setHighscore = (newHighscore) => this.setState({ highscores: newHighscore });

  onSubmitHighscore = (newHighscoreArr) => {
    this.sendDataToServer({
      type: "update-highscore",
      list: newHighscoreArr,
    });
  };

  sendDataToServer = (data) => {
    if (this.connectionManager) {
      this.connectionManager.send(data);
    }
  };

  createPlayer = (playerId = "localPlayer", gameState = {}) => {
    const events = new Events();
    const isLocalPlayer = this.state.players.size === 0 ? true : false;
    this.setState((prev) =>
      prev.players.set(playerId, { events, isLocalPlayer, gameState })
    );
  };

  removePlayer = (id) => {
    this.setState((prev) => prev.players.delete(id));
  };

  sortPlayers = (players) => {
    // console.log("woop", this.state.players)
  };

  updateTetrisState = (id, newState) => {
    const player = this.state.players.get(id);
    player.gameState = {
      ...player.gameState,
      [newState.prop]: newState.value,
    };
    this.setState((prev) => prev.players.set(id, player));
  };

  render() {
    return (
      <StyledTetrisManager>
        {!this.state.isStartGame ? (
          <StartMenu />
        ) : (
          [...this.state.players.entries()].map(
            ([playerId, { events, isLocalPlayer, gameState }]) => (
              <Tetris
                key={playerId}
                events={events}
                isLocalPlayer={isLocalPlayer}
                gameState={gameState}
                highscores={this.state.highscores}
                handleHighscore={this.onSubmitHighscore}
                nPlayers={this.state.players.size}
              />
            )
          )
        )}
      </StyledTetrisManager>
    );
  }
}

export default TetrisManager;
