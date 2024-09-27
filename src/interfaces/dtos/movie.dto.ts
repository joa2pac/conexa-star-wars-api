/* istanbul ignore file */
import { IsString, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @IsOptional()
  @IsString()
  movieId?: string;

  
  @IsOptional()
  @IsString()
  synopsis?: string;


  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cast?: string[];

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genre?: string[];

  @IsOptional()
  @IsString()
  rating?: string;

  @IsOptional()
  @IsString()
  releaseDate?: string;

  @IsOptional()
  @IsString()
  created?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
