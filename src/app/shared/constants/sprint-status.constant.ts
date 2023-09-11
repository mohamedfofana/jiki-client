import { SprintStatusEnum } from "../enum/sprint-status.enum";
import { ConstantType } from "./constant.type";

export const SprintStatusConstant: ConstantType[] = [
    {
        code: SprintStatusEnum.CREATED,
        value: 'Created'
    },
    {
        code: SprintStatusEnum.IN_PROGRESS,
        value: 'In progress'
    },
    {
        code: SprintStatusEnum.CLOSED,
        value: 'Closed'
    }
];
