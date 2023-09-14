import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Matches } from 'class-validator';

@InputType()
export class UpdateTodoInput {
  // Inherit properties from the CreateTodoInput class using PartialType

  @Field()
  id: number; // The unique identifier of the todo item to be updated

  @Field({ nullable: true, description: 'The title of the todo' })
  @IsNotEmpty({ message: 'The title of the todo cannot be empty' })
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'Only alphanumeric characters and whitespaces are allowed for the Title field',
  }) // Validation rule: Only alphanumeric characters and whitespaces are allowed
  title: string; // The updated title of the todo item (nullable)

  @Field({
    nullable: true,
    description: 'What the todo is all about',
  })
  @Matches(/^[a-zA-Z0-9\s\-_.,;:!?(){}[\]@#$^&+=<>]*$/, {
    message: 'Description contains unsafe special characters',
  }) // Validation rule: Description should contain safe special characters
  description?: string | null; // The updated description of the todo item (nullable)

  @Field({
    nullable: true,
    description: 'Used to determine if a todo has been achieved or not.',
  })
  completed?: boolean | null; // Whether the todo item is completed (nullable)

  @Field()
  updatedAt: Date; // The timestamp when the todo item was last updated
}
