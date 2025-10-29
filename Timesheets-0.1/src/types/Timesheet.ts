export interface Timesheet {
  id: string;
  name: string;
  date: string;
  loginTime: string;
  logoutTime: string;
  project: string;
  task: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Completed"; 
  createdAt?: number;
}
