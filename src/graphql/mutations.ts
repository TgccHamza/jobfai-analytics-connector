
import { gql } from '@apollo/client';

// Admin Mutations
export const CREATE_GAME = gql`
  mutation CreateGame($input: GameInput!) {
    createGame(input: $input) {
      gameId
      gameName
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($input: GameUpdateInput!) {
    updateGame(input: $input) {
      gameId
      gameName
    }
  }
`;

export const CREATE_STAGE = gql`
  mutation CreateStage($input: StageInput!) {
    createStage(input: $input) {
      stageId
      stageName
    }
  }
`;

export const CREATE_COMPETENCE = gql`
  mutation CreateCompetence($input: CompetenceInput!) {
    createCompetence(input: $input) {
      competenceId
      competenceName
    }
  }
`;

export const ASSIGN_METRIC_TO_STAGE = gql`
  mutation AssignMetricToStage($input: StageMetricInput!) {
    assignMetricToStage(input: $input)
  }
`;

// Player Mutations
export const CALCULATE_PLAYER_PERFORMANCE = gql`
  mutation CalculatePlayerPerformance($input: PlayerPerformanceInput!) {
    calculatePlayerPerformance(input: $input) {
      playerId
      playerName
      totalScore
      competenceDetails {
        competenceKey
        score
      }
      stagePerformance {
        stageId
        stageName
        score
      }
    }
  }
`;
