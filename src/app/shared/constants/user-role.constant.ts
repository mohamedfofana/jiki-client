import { UserRoleEnum } from "../enum/user-role-enum";
import { ConstantType } from "./constant.type";

export const UserRoleConstant: ConstantType[] = [
    {
        code: UserRoleEnum.ADMIN,
        value: 'Admin'
    },
    {
        code: UserRoleEnum.USER,
        value: 'User'
    },
    {
        code: UserRoleEnum.QA,
        value: 'QA'
    }
];
