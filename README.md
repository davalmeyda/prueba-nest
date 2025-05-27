# Prueba Técnica - Debugging Simple

## Para el Candidato

### 🎯 Objetivo
Identificar y corregir 3 errores simples en un sistema básico de tareas implementado en NestJS.

### ⏱️ Tiempo estimado
15-30 minutos

### 🚀 Inicio Rápido

```bash
# Instalar dependencias
pnpm install

# Ejecutar el proyecto
pnpm start:dev
```

El servidor estará en `http://localhost:3000`

### 📋 Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/tasks` | Crear tarea |
| GET | `/tasks` | Listar todas las tareas |
| GET | `/tasks/overdue` | Obtener tareas vencidas |
| GET | `/tasks/priority/:priority` | Obtener tareas por prioridad |
| GET | `/tasks/:id` | Obtener tarea por ID |
| PUT | `/tasks/:id` | Actualizar tarea |
| DELETE | `/tasks/:id` | Eliminar tarea |

### 🐛 Tu Tarea

1. **Ejecuta los tests** - `pnpm test` y `pnpm test:e2e` (algunos fallarán)
2. **Prueba el sistema** - Crea tareas y prueba todos los endpoints
3. **Encuentra los errores** - ¿Qué no funciona como debería?
4. **Corrige los errores** - Revisa el código y arregla los problemas
5. **Verifica** - Los tests deben pasar después de tus correcciones
6. **Documenta** - Crea `SOLUCION.md` con lo que encontraste

### 📝 Ejemplo de Uso

```bash
# Crear tarea
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi tarea", "priority": "medium", "dueDate": "2024-01-01T00:00:00Z"}'

# Obtener tareas vencidas
curl http://localhost:3000/tasks/overdue

# Obtener tareas por prioridad
curl http://localhost:3000/tasks/priority/high
```

### ⚠️ Reglas
- NO modifiques la estructura de archivos
- Mantén el código simple
- Los tests deben pasar después de tus correcciones
- Documenta tus cambios

---