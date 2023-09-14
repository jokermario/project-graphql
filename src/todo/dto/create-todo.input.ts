import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field({ description: 'The title of the todo' })
  @IsNotEmpty({ message: 'The title of the todo cannot be empty' }) // Validation rule: title must not be empty
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'Only alphanumeric characters and whitespaces are allowed for the Title field',
  }) // Validation rule: title must consist of alphanumeric characters and whitespaces
  title: string; // The title of the todo

  @Field({
    nullable: true,
    description: 'What the todo is all about',
  })
  @Matches(/^[a-zA-Z0-9\s\-_.,;:!?(){}[\]@#$^&+=<>]*$/, {
    message: 'Description contains unsafe special characters',
  }) // Validation rule: Description should contain safe special characters
  description: string; // The description of the todo (nullable)
}
