import { SprintDurationEnum } from "../enum/sprint-duration.enum";
import { ConstantType } from "./constant.type";

export const SprintDurationConstant: ConstantType[] = [
    {
        code: SprintDurationEnum.W2,
        value: '2 weeks'
    },
    {
        code: SprintDurationEnum.W3,
        value: '3 weeks'
    },    
    {
        code: SprintDurationEnum.W4,
        value: '4 weeks'
    }
];