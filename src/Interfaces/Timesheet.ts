export interface Timesheet{
    description: string;
    id:string;
    name:string;
    date:string;
    loginTime:string;
    logoutTime:string;
    project:string;
    task:string;
    taskhours:string;
    priority:string;
    status:string;
    leaves?:string;
    hours?:string;
}


