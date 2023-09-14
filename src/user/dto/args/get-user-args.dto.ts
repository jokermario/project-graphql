import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ArgsType()
export class GetUserArgs {
  @Field()
  @IsString()
  @IsNotEmpty()
  _email: string;

  @Field()
  @IsNotEmpty()
  _password: string;
}
