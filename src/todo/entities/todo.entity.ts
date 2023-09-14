import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field()
  id: number; // The unique identifier for the todo item

  @Field({ description: 'The title of the todo' })
  title: string; // The title of the todo item

  @Field({
    nullable: true,
    description: 'What the todo is all about',
  })
  description: string | null; // The description of the todo item (nullable)

  @Field({
    nullable: true,
    description: 'Used to determine if a todo has been achieved or not',
  })
  completed?: boolean | null; // Whether the todo is completed (nullable)

  @Field()
  createdAt: Date; // The timestamp when the todo was created

  @Field()
  updatedAt: Date; // The timestamp when the todo was last updated
}
