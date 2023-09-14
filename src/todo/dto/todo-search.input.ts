import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';

@InputType()
export class TodoSearchInput {
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'The title of the todo cannot be empty' })
  @Matches(/^[a-zA-Z0-9.:\s]+$/, {
    message: 'Only alphanumeric characters and whitespaces are allowed for the Title field',
  }) // Validation rule: Only alphanumeric characters and whitespaces are allowed
  title?: string; // The title to search for (nullable)

  @Field({ nullable: true })
  @Matches(/^[a-zA-Z0-9\s\-_.,;:!?(){}[\]@#$^&+=<>]*$/, {
    message: 'Description contains unsafe special characters',
  }) // Validation rule: Description should contain safe special characters
  description?: string; // The description to search for (nullable)
}
