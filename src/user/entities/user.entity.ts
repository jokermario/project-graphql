import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id?: number;

  @Field({ description: 'The email of the user' })
  email: string; // The email of the user

  @Field({ description: 'The password of the user' })
  password?: string; // The password of the user
}
