
import { gql } from '@apollo/client';

export const GAME_CREATED = gql`
  subscription GameCreated {
    gameCreated {
      gameId
      gameName
    }
  }
`;

export const STAGE_UPDATED = gql`
  subscription StageUpdated($stageId: ID) {
    stageUpdated(stageId: $stageId) {
      stageId
      stageName
    }
  }
`;

export const PLAYER_PERFORMANCE_CALCULATED = gql`
  subscription PlayerPerformanceCalculated($playerId: ID, $gameId: ID) {
    playerPerformanceCalculated(playerId: $playerId, gameId: $gameId) {
      playerId
      totalScore
      competenceDetails {
        competenceKey
        score
      }
    }
  }
`;
