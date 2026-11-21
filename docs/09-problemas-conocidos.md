# Problemas conocidos

**[COMPLETAR: confirmen cada fila reproduciéndola en el ambiente desplegado antes de entregar. Borren las que no apliquen y agreguen las que el equipo conozca. Si no hay ninguno, escriban "No hay problemas conocidos".]**

| Problema | Cómo se reproduce | Impacto | Historia relacionada |
|---|---|---|---|
| La sesión se cierra a los 15 minutos aunque la cookie dura 7 días: el frontend no usa `POST /auth/refresh` para renovar el access token. | 1. Iniciar sesión. 2. Esperar más de 15 minutos (`JWT_EXPIRES_IN`). 3. Navegar a cualquier página: se redirige a `/login?motivo=vencida`. | Medio | **[COMPLETAR: historia de inicio de sesión]** |
| Los archivos subidos (fotos de incidencias y adjuntos de comunicados) se guardan en la carpeta `uploads/` del servidor. Si la plataforma no tiene un disco persistente, se pierden al redesplegar o reiniciar. | 1. Subir una foto a una incidencia. 2. Redesplegar el backend. 3. Abrir la incidencia: la imagen ya no carga. | **[COMPLETAR: Bajo, medio o alto]** | **[COMPLETAR: H de incidencias y de comunicados]** |
| **[COMPLETAR: historias pendientes y defectos que conozcan]** | **[COMPLETAR]** | **[COMPLETAR]** | **[COMPLETAR]** |
