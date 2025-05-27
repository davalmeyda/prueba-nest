import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('/tasks (POST)', () => {
    it('should reject task creation without title', async () => {
      const response = await request(app.getHttpServer()).post('/tasks').send({
        priority: 'medium',
      });

      // Debería fallar porque title es requerido
      expect(response.status).toBe(400);
    });

    it('should create task with valid data', async () => {
      const response = await request(app.getHttpServer()).post('/tasks').send({
        title: 'Test Task',
        priority: 'medium',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Test Task');
    });
  });

  describe('/tasks/priority/:priority (GET)', () => {
    it('should return tasks with specified priority', async () => {
      // Crear tareas con diferentes prioridades
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'High Task', priority: 'high' });

      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Medium Task', priority: 'medium' });

      // Obtener tareas de prioridad alta
      const response = await request(app.getHttpServer()).get(
        '/tasks/priority/high',
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(Array.isArray(response.body) && response.body.length > 0).toBe(
        true,
      );
      if (Array.isArray(response.body) && response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('priority', 'high');
      }
    });
  });

  describe('/tasks/overdue (GET)', () => {
    it('should return overdue tasks correctly', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Crear tarea vencida
      await request(app.getHttpServer()).post('/tasks').send({
        title: 'Overdue Task',
        priority: 'high',
        dueDate: yesterday.toISOString(),
      });

      // Crear tarea no vencida
      await request(app.getHttpServer()).post('/tasks').send({
        title: 'Future Task',
        priority: 'medium',
        dueDate: tomorrow.toISOString(),
      });

      // Crear tarea sin fecha límite
      await request(app.getHttpServer()).post('/tasks').send({
        title: 'No Due Date Task',
        priority: 'low',
      });

      // Obtener tareas vencidas
      const overdueResponse = await request(app.getHttpServer()).get(
        '/tasks/overdue',
      );

      expect(overdueResponse.status).toBe(200);
      expect(Array.isArray(overdueResponse.body)).toBe(true);

      // Este test fallará porque forEach con async/await no espera las verificaciones
      expect((overdueResponse.body as any[]).length).toBe(1); // Debería haber 1 tarea vencida

      if ((overdueResponse.body as any[]).length > 0) {
        expect((overdueResponse.body as any[])[0]).toHaveProperty(
          'title',
          'Overdue Task',
        );
      }
    });
  });
});
