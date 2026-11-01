import Dexie, { type Table } from "dexie";

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  status: "Planning" | "In Progress" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface Capture {
  id: string;
  projectId: string | null;
  content: string;
  type: "Idea" | "Bug" | "Note" | "Next Step";
  createdAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  createdAt: Date;
  updatedAt: Date;
}

class ContextDropDB extends Dexie {
  projects!: Table<Project, string>;
  captures!: Table<Capture, string>;
  tasks!: Table<Task, string>;

  constructor() {
    super("ContextDropDB");

    this.version(1).stores({
      projects: "id, name, status, updatedAt",
      captures: "id, projectId, type, createdAt",
    });

    this.version(2).stores({
      projects: "id, name, status, updatedAt",
      captures: "id, projectId, type, createdAt",
      tasks: "id, projectId, status, createdAt, updatedAt",
    });
  }
}

export const db = new ContextDropDB();
