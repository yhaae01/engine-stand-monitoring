import { RoleDTO } from "../../role/dto/role.dto";

export interface UserDTO {
  role_roleid: number;
  role?: RoleDTO;
  name: string;
  email: string;
  nopeg: string;
  username: string;
  pmo: number;
}