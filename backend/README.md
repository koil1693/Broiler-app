# Broiler Backend (Java 21 + Spring Boot 3.x)

## Prereqs
- JDK 21 installed and selected in your IDE/CI
- MySQL 8 running locally

## Run
```sql
CREATE DATABASE broiler_db;
CREATE USER 'broiler_user'@'%' IDENTIFIED BY 'broiler_pass';
GRANT ALL PRIVILEGES ON broiler_db.* TO 'broiler_user'@'%';
FLUSH PRIVILEGES;
```
```bash
mvn spring-boot:run
```
Swagger UI: `/swagger-ui/index.html`

Auth:
- `POST /api/auth/login` with `{ "username":"admin","password":"admin123" }` → JWT
- Use `Authorization: Bearer <token>` for secured endpoints
