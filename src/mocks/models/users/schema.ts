import * as v from 'valibot';

export const UserSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  name: v.string() 
});

export const UsersSchema = v.array(UserSchema);

export type Users = v.InferOutput<typeof UsersSchema>;

export type User = v.InferOutput<typeof UserSchema>;
