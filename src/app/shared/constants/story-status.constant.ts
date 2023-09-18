import { StoryStatusEnum } from "../enum/story-status.enum";
import { ConstantType } from "./constant.type";

export const StoryStatusConstant: ConstantType[] = [
    {
        code: StoryStatusEnum.TODO,
        value: 'Todo'
    },
    {
        code: StoryStatusEnum.IN_PROGRESS,
        value: 'In progress'
    },
    {
        code: StoryStatusEnum.BLOCKED,
        value: 'Blocked'
    },
    {
        code: StoryStatusEnum.DONE,
        value: 'Done'
    }
];
