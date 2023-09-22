import { UserRole } from "./UserRole";

export interface UserDto  {
  id:number;
  uuid: string;
  email:string;
  username:string;
  password:string;
  stage: number;
  role: UserRole;
}