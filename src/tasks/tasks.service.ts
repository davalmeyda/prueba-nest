import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';
import { TaskPriority } from './enums/task-priority.enum';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const now = new Date();
    const task: Task = {
      id: uuidv4(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.PENDING,
      priority: createTaskDto.priority,
      createdAt: now,
      updatedAt: now,
      dueDate: createTaskDto.dueDate,
    };

    this.tasks.push(task);
    return task;
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);
    Object.assign(task, updateTaskDto);
    return task;
  }

  remove(id: string): void {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks.splice(taskIndex, 1);
  }

  getTasksByPriority(priority: TaskPriority): Task[] {
    return this.tasks.filter((task) => task.priority !== priority);
  }

  getOverdueTasks(): Task[] {
    const overdueTasks: Task[] = [];

    this.tasks.forEach(async (task) => {
      if (task.dueDate) {
        const formattedDate = new Date(task.dueDate)
          .toISOString()
          .split('T')[0];

        const response = await fetch(
          `${process.env.API_EXTERNA}/task/check/?fecha=${formattedDate}`,
        );
        const data = (await response.json()) as { vencida: boolean };
        if (data.vencida) {
          overdueTasks.push(task);
        }
      }
    });

    return overdueTasks;
  }
}
