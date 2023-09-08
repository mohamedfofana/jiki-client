import { IProject } from "./project.model";

export interface ICategory {
    id: number;
    project: IProject;
    title: string;
}