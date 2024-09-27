import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminConfirmSignUpCommand,
  AdminDeleteUserCommand,
  ListUsersCommand,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class CognitoService {
  private readonly cognitoClient: CognitoIdentityProviderClient;
  private readonly userPoolId: string;

  constructor(private readonly configService: ConfigService) {
    this.userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');

    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async listUsers() {
    const command = new ListUsersCommand({
      UserPoolId: this.userPoolId,
    });
    return this.cognitoClient.send(command);
  }

  async createUser(username: string, email: string, temporaryPassword: string) {
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: [{ Name: 'email', Value: email }],
      TemporaryPassword: temporaryPassword,
      MessageAction: 'SUPPRESS',
    });
  
    await this.cognitoClient.send(createUserCommand);
  
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      Password: temporaryPassword,
      Permanent: true,
    });
  
    await this.cognitoClient.send(setPasswordCommand);
  
    if (this.configService.get<string>('COGNITO_ENDPOINT')) {
      const confirmSignUpCommand = new AdminConfirmSignUpCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });
  
      return this.cognitoClient.send(confirmSignUpCommand);
    }
  
    return { message: 'User created with permanent password.' };
  }

  async setUserPassword(username: string, password: string) {
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      Password: password,
      Permanent: true,
    });
    return this.cognitoClient.send(setPasswordCommand);
  }

  async addUserToGroup(username: string, groupName: string) {
    const command = new AdminAddUserToGroupCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      GroupName: groupName,
    });
    return this.cognitoClient.send(command);
  }

  async deleteUser(username: string) {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });
    return this.cognitoClient.send(command);
  }
}
