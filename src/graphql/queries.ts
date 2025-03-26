
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
      stages {
        stageId
        stageKey
        stageName
        stageOrder
        benchmark
        optimalTime
        description
      }
      competencies {
        competenceId
        competenceKey
        competenceName
        benchmark
        weight
        description
      }
      gameMetrics {
        metricId
        metricKey
        metricName
        metricDescription
      }
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

export const GET_COMPETENCIES_BY_GAME = gql`
  query GetCompetenciesByGame($gameId: ID!) {
    getCompetenciesByGame(gameId: $gameId) {
      competenceId
      competenceKey
      competenceName
      benchmark
      weight
      description
      metrics {
        metricId
        metricKey
        metricName
        metricDescription
        benchmark
        formula
        weight
      }
    }
  }
`;

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
      metrics {
        metricId
        metricKey
        metricName
      }
    }
  }
`;

export const GET_METRICS_BY_STAGE = gql`
  query GetMetricsByStage($stageId: ID!) {
    getMetricsByStage(stageId: $stageId) {
      metricId
      metricKey
      metricName
      formula
      benchmark
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

// Player Queries
export const GET_GAME_CONFIGURATION = gql`
  query GetGameConfiguration($gameId: ID!) {
    getGameConfiguration(gameId: $gameId) {
      gameId
      gameName
      stages {
        stageId
        stageName
        stageOrder
      }
    }
  }
`;

export const GET_REQUIRED_PARAMETERS_FOR_STAGE = gql`
  query GetRequiredParametersForStage($stageId: ID!) {
    getRequiredParametersForStage(stageId: $stageId) {
      paramId
      paramKey
      paramName
      paramType
      isRequired
      defaultValue
    }
  }
`;

export const GET_PLAYER_PERFORMANCE = gql`
  query GetPlayerPerformance($playerId: ID!, $gameId: ID!) {
    getPlayerPerformance(playerId: $playerId, gameId: $gameId) {
      playerId
      playerName
      profileType
      gameDate
      totalScore
      totalTimeTaken
      competenceDetails {
        competenceKey
        competenceName
        score
        benchmark
      }
      stagePerformance {
        stageId
        stageName
        score
        timeTaken
        optimalTime
      }
      globalMetrics {
        efficiency
        accuracy
        speed
      }
      benchmarkComparison {
        overall
        byCompetence {
          competenceKey
          percentile
        }
      }
    }
  }
`;
