import { Injectable } from '@nestjs/common';
import { CognitoIdentityProviderClient, AdminInitiateAuthCommand, AuthFlowType } from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private cognitoClient: CognitoIdentityProviderClient;

  constructor(private configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('COGNITO_REGION'),
    });
  }

  async authenticate(username: string, password: string) {
    const params = {
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      UserPoolId: this.configService.get<string>('COGNITO_USER_POOL_ID'),
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const command = new AdminInitiateAuthCommand(params);
    const response = await this.cognitoClient.send(command);

    return response.AuthenticationResult;
  }
}
