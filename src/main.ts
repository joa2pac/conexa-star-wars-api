/* istanbul ignore file */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('Star Wars API')
    .setDescription('API that integrates external Star Wars API')
    .setVersion('1.0')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'http://localhost:4566/_aws/cognito-idp/oauth2/authorize',
          tokenUrl: 'http://localhost:4566/_aws/cognito-idp/oauth2/token',
          refreshUrl: 'http://localhost:4566/_aws/cognito-idp/oauth2/token',
          scopes: {
            'openid': 'openid',
            'profile': 'Profile access',
            'email': 'Email access',
          },
        },
      },
    })
    .build();
    
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const clientId = configService.get<string>('COGNITO_USER_POOL_CLIENT_ID')
  
  app.enableCors();
  
  app.setGlobalPrefix('api');
  
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:3000/api/oauth2-redirect.html',
      persistAuthorization: true,
      initOAuth: {
        clientId
      }
    },
  });
  
  await app.listen(3000);
}

bootstrap();
