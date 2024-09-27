import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (_request: any, rawJwtToken: string, done: (err: any, pem?: any | null) => void) => {
        try {
          const jwtHeader = jwt.decode(rawJwtToken, { complete: true })?.header;
      
          if (!jwtHeader || !jwtHeader.kid) {
            throw new Error('Invalid JWT: Missing header or kid');
          }
      
          const jwksUrl = this.configService.get<string>('COGNITO_JWKS_URL');
          const { data } = await axios.get(jwksUrl);
          const jwk = data.keys.find((key: any) => key.kid === jwtHeader.kid);
          
          if (!jwk) {
            throw new Error(`JWK with kid ${jwtHeader.kid} not found`);
          }
      
          const pem = jwkToPem(jwk);
          done(null, pem);
        } catch (error) {
          console.error('Error in secretOrKeyProvider:', error);
          done(error);
        }
      },
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
