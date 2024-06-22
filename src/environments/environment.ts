import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
  production: false,
  httpUrl: 'https://api-esm.gmf-aeroasia.co.id/v1/rest',
  apiUrl: 'https://api-esm.gmf-aeroasia.co.id/api/rest',
  keycloakUrl: 'https://dev-auth.gmf-aeroasia.co.id/auth',
  baseUrl: 'https://esm.gmf-aeroasia.co.id',
  serviceUrl: 'https://api-esm.gmf-aeroasia.co.id',
  logger: ['error', 'log', 'warn', 'debug'],
  localKey: 'st+NnHcipOHKvd0WCcBjqLKbo9nV8sY0',
  realm: 'engine-stand',
  keycloakClientId: 'engine-stand',
};
