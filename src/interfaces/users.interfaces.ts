type TUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  active: boolean;
};

interface loginRequest {
  email: string;
  password: string;
}

type TUserRequest = Omit<TUser, "id">;

type TUserResponse = Omit<TUser, "password">;

export { TUserRequest, TUserResponse, TUser, loginRequest };
