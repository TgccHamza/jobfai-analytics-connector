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
      stageKey
      stageName
      stageOrder
      benchmark
      optimalTime
      description
    }
  }
`;

export const CREATE_COMPETENCE = gql`
  mutation CreateCompetence($input: CompetenceInput!) {
    createCompetence(input: $input) {
      competenceId
      competenceKey
      competenceName
      description
      benchmark
      weight
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_METRIC = gql`
  mutation CreateCompetenceMetric($input: CompetenceMetricInput!) {
    createCompetenceMetric(input: $input) {
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

export const CREATE_PARAMETER = gql`
  mutation CreateParameter($input: MetricParameterInput!) {
    createMetricParameter(input: $input) {
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

export const CREATE_CONSTANT = gql`
  mutation CreateConstant($input: ConstantParameterInput!) {
    createConstantParameter(input: $input) {
      constId
      constKey
      constName
      constValue
      constDescription
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_GAME_METRIC = gql`
  mutation CreateGameMetric($input: GameMetricInput!) {
    createGameMetric(input: $input) {
      metricId
      metricKey
      metricName
      metricDescription
      benchmark
      formula
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_GAME_METRIC_PARAMETER = gql`
  mutation CreateGameMetricParameter($input: GameMetricParameterInput!) {
    createGameMetricParameter(input: $input) {
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

export const ASSIGN_METRIC_TO_STAGE = gql`
  mutation AssignMetricToStage($input: StageMetricInput!) {
    assignMetricToStage(input: $input) {
      stageId
      metricId
    }
  }
`;

export const ASSIGN_METRIC_TO_COMPETENCE = gql`
  mutation AssignMetricToCompetence($input: CompetenceMetricInput!) {
    assignMetricToCompetence(input: $input) {
      competenceId
      metricId
    }
  }
`;

// Update mutations
export const UPDATE_COMPETENCE = gql`
  mutation UpdateCompetence($input: CompetenceUpdateInput!) {
    updateCompetence(input: $input) {
      competenceId
      competenceKey
      competenceName
      description
      benchmark
      weight
    }
  }
`;

export const UPDATE_METRIC = gql`
  mutation UpdateMetric($input: CompetenceMetricUpdateInput!) {
    updateCompetenceMetric(input: $input) {
      metricId
      metricKey
      metricName
      metricDescription
      benchmark
      formula
      weight
    }
  }
`;

export const UPDATE_STAGE = gql`
  mutation UpdateStage($input: StageUpdateInput!) {
    updateStage(input: $input) {
      stageId
      stageKey
      stageName
      stageOrder
      benchmark
      optimalTime
      description
    }
  }
`;

export const UPDATE_CONSTANT = gql`
  mutation UpdateConstant($input: ConstantParameterUpdateInput!) {
    updateConstantParameter(input: $input) {
      constId
      constKey
      constName
      constValue
      constDescription
    }
  }
`;

// Deletion mutations
export const DELETE_COMPETENCE = gql`
  mutation DeleteCompetence($competenceId: ID!) {
    deleteCompetence(competenceId: $competenceId)
  }
`;

export const DELETE_METRIC = gql`
  mutation DeleteMetric($metricId: ID!) {
    deleteCompetenceMetric(metricId: $metricId)
  }
`;

export const DELETE_STAGE = gql`
  mutation DeleteStage($stageId: ID!) {
    deleteStage(stageId: $stageId)
  }
`;

export const DELETE_CONSTANT = gql`
  mutation DeleteConstant($constId: ID!) {
    deleteConstantParameter(constId: $constId)
  }
`;

// Remove relations mutations
export const REMOVE_METRIC_FROM_STAGE = gql`
  mutation RemoveMetricFromStage($input: StageMetricInput!) {
    removeMetricFromStage(input: $input)
  }
`;

export const REMOVE_METRIC_FROM_COMPETENCE = gql`
  mutation RemoveMetricFromCompetence($input: CompetenceMetricInput!) {
    removeMetricFromCompetence(input: $input)
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
