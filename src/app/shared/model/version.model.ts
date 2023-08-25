import { IProject } from "./project.model";

export interface IVersion {
    id: number;
    project: IProject;
    version: string;
}