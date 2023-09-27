import { UserJobtitleEnum } from "../enum/user-jobTitle.enum";
import { ConstantType } from "./constant.type";

export const UserJobTitleConstant: ConstantType[] = [
    {
        code: UserJobtitleEnum.MANAGER,
        value: 'Manager'
    },
    {
        code: UserJobtitleEnum.ANALYST,
        value: 'Analyst'
    },
    {
        code: UserJobtitleEnum.SOFT_DEV,
        value: 'Software Developer'
    },
    {
        code: UserJobtitleEnum.SCRUM_MASTER,
        value: 'Scrum master'
    },
    {
        code: UserJobtitleEnum.TEAM_LEADER,
        value: 'Team leader'
    },
    {
        code: UserJobtitleEnum.QA,
        value: 'QA'
    }
];
