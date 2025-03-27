
import { gql } from '@apollo/client';

// Game Queries
export const GET_GAMES = gql`
  query GetGames {
    getGames {
      gameId
      gameName
      description
      active
      createdAt
      updatedAt
    }
  }
`;

export const GET_GAME_BY_ID = gql`
  query GetGameById($gameId: ID!) {
    getGameById(gameId: $gameId) {
      gameId
      gameName
      description
      active
      createdAt
      updatedAt
      constantParameters {
        constId
        constKey
        constName
        constValue
        constDescription
      }
    }
  }
`;

// Stage Queries
export const GET_STAGES_BY_GAME = gql`
  query GetStagesByGame($gameId: ID!) {
    getStagesByGame(gameId: $gameId) {
      stageId
      stageKey
      stageName
      stageOrder
      benchmark
      optimalTime
      description
      createdAt
      updatedAt
    }
  }
`;

export const GET_STAGE_BY_ID = gql`
  query GetStageById($stageId: ID!) {
    getStageById(stageId: $stageId) {
      stageId
      gameId
      stageKey
      stageName
      stageOrder
      benchmark
      optimalTime
      description
      createdAt
      updatedAt
      metrics {
        metricId
        metricKey
        metricName
        metricDescription
        benchmark
        formula
        weight
      }
      game {
        gameId
        gameName
      }
    }
  }
`;

// Competence Queries
export const GET_COMPETENCIES_BY_GAME = gql`
  query GetCompetenciesByGame($gameId: ID!) {
    getCompetenciesByGame(gameId: $gameId) {
      competenceId
      competenceKey
      competenceName
      description
      benchmark
      weight
      createdAt
      updatedAt
      metrics {
        metricId
        metricKey
        metricName
      }
    }
  }
`;

export const GET_COMPETENCE_BY_ID = gql`
  query GetCompetenceById($competenceId: ID!) {
    getCompetenceById(competenceId: $competenceId) {
      competenceId
      gameId
      competenceKey
      competenceName
      description
      benchmark
      weight
      formula
      createdAt
      updatedAt
      metrics {
        metricId
        metricKey
        metricName
        metricDescription
        benchmark
        formula
        weight
        createdAt
        updatedAt
        parameters {
          paramId
          paramKey
          paramName
          paramDescription
          paramType
          isRequired
          defaultValue
        }
      }
      game {
        gameId
        gameName
      }
    }
  }
`;

// Metric Queries
export const GET_METRICS_BY_GAME = gql`
  query GetMetricsByGame($gameId: ID!) {
    getMetricsByGame(gameId: $gameId) {
      metricId
      metricKey
      metricName
      metricDescription
      benchmark
      formula
      weight
      createdAt
      updatedAt
    }
  }
`;

export const GET_METRIC_BY_ID = gql`
  query GetMetricById($metricId: ID!) {
    getMetricById(metricId: $metricId) {
      metricId
      metricKey
      metricName
      metricDescription
      benchmark
      formula
      weight
      createdAt
      updatedAt
      parameters {
        paramId
        paramKey
        paramName
        paramDescription
        paramType
        isRequired
        defaultValue
      }
      competences {
        competenceId
        competenceKey
        competenceName
      }
      stages {
        stageId
        stageKey
        stageName
      }
    }
  }
`;

// Parameter Queries
export const GET_PARAMETERS_BY_METRIC = gql`
  query GetParametersByMetric($metricId: ID!) {
    getParametersByMetric(metricId: $metricId) {
      paramId
      paramKey
      paramName
      paramDescription
      paramType
      isRequired
      defaultValue
      createdAt
      updatedAt
    }
  }
`;

// Constants Queries
export const GET_CONSTANTS_BY_GAME = gql`
  query GetConstantsByGame($gameId: ID!) {
    getConstantsByGame(gameId: $gameId) {
      constId
      gameId
      constKey
      constName
      constDescription
      constValue
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONSTANT_BY_ID = gql`
  query GetConstantById($constId: ID!) {
    getConstantById(constId: $constId) {
      constId
      gameId
      constKey
      constName
      constDescription
      constValue
      createdAt
      updatedAt
    }
  }
`;

// Game Metrics Queries
export const GET_GAME_METRICS_BY_GAME = gql`
  query GetGameMetricsByGame($gameId: ID!) {
    getGameMetricsByGame(gameId: $gameId) {
      metricId
      gameId
      metricKey
      metricName
      metricDescription
      benchmark
      formula
      createdAt
      updatedAt
      parameters {
        paramId
        paramKey
        paramName
      }
    }
  }
`;

export const GET_GAME_METRIC_BY_ID = gql`
  query GetGameMetricById($metricId: ID!) {
    getGameMetricById(metricId: $metricId) {
      metricId
      gameId
      metricKey
      metricName
      metricDescription
      benchmark
      formula
      createdAt
      updatedAt
      parameters {
        paramId
        paramKey
        paramName
        paramDescription
        paramType
        isRequired
        defaultValue
      }
    }
  }
`;

// Analytics Queries
export const GET_PLAYER_PERFORMANCE = gql`
  query GetPlayerPerformance($playerId: ID!, $gameId: ID!) {
    getPlayerPerformance(playerId: $playerId, gameId: $gameId) {
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
