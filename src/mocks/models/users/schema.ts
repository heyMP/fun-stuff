import * as v from 'valibot';

export const UserSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  name: v.string() 
});
export type User = v.InferOutput<typeof UserSchema>;

export const UsersSchema = v.array(UserSchema);
export type Users = v.InferOutput<typeof UsersSchema>;

/**
 * API
 *
 * /users GET
 */
export const GetUsersResponseSchema = UsersSchema;
export type GetUsersResponse = v.InferOutput<typeof GetUsersResponseSchema>;

/**
 * API
 *
 * /users/create POST
 */
export const CreateUserRequestSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});
export type CreateUserRequest = v.InferOutput<typeof CreateUserRequestSchema>;

export const CreateUserResponseSchema = UserSchema;
export type CreateUserResponse = v.InferOutput<typeof CreateUserResponseSchema>;

/**
 * API
 *
 * /users/:id DELETE
 */
export const DeleteUserRequestSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
});
export type DeleteUserRequest = v.InferOutput<typeof DeleteUserRequestSchema>;

export const DeleteUserResponseSchema = v.void();
export type DeleteUserResponse = v.InferOutput<typeof DeleteUserResponseSchema>;

