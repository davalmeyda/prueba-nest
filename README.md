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

## Para el Evaluador

### 🐛 Errores Introducidos

#### 1. Validación de título incorrecta (DTO)
**Ubicación:** `src/tasks/dto/create-task.dto.ts`
**Problema:** El título usa `@IsOptional()` en lugar de `@IsNotEmpty()`
**Impacto:** Se pueden crear tareas sin título
**Solución:** Cambiar `@IsOptional()` por `@IsNotEmpty()`

#### 2. Filtro de prioridad invertido (Servicio)
**Ubicación:** `src/tasks/tasks.service.ts` - método `getTasksByPriority`
**Problema:** Usa `!==` en lugar de `===`
**Impacto:** Devuelve tareas que NO tienen la prioridad especificada
**Solución:** Cambiar `task.priority !== priority` por `task.priority === priority`

#### 3. Uso incorrecto de forEach con async/await (Servicio)
**Ubicación:** `src/tasks/tasks.service.ts` - método `getOverdueTasks`
**Problema:** Usa `forEach` con funciones `async`, pero no espera las verificaciones asíncronas
**Impacto:** El método retorna inmediatamente sin esperar las verificaciones, resultando en un array vacío aunque haya tareas vencidas
**Solución:** Reemplazar `forEach` con `for...of` o usar `Promise.all()` con `map()` para esperar todas las verificaciones asíncronas

### 📊 Criterios de Evaluación

#### Excelente (90-100%)
- Encuentra los 3 errores
- Los corrige correctamente
- Todos los tests pasan
- Documenta claramente lo que hizo

#### Bueno (70-89%)
- Encuentra al menos 2 errores
- Los corrige correctamente
- La mayoría de tests pasan
- Documenta su trabajo

#### Insuficiente (<70%)
- Encuentra menos de 2 errores
- Las correcciones no funcionan
- Los tests siguen fallando

### 🧪 Tests

Los tests están diseñados para **fallar** hasta que se corrijan los errores:

- **Test unitarios** (`pnpm test`): Verifican la lógica del servicio
- **Test e2e** (`pnpm test:e2e`): Verifican la validación del DTO y endpoints

### ⏱️ Tiempo Esperado
- **Lectura y comprensión**: 5 minutos
- **Ejecución de tests y pruebas**: 5-10 minutos  
- **Identificación de errores**: 5-10 minutos
- **Corrección**: 5-10 minutos
- **Verificación y documentación**: 5 minutos

**Total**: 15-30 minutos

¡Buena suerte! 🚀 