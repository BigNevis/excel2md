# Etapa de construcción
FROM node:18-alpine as build
WORKDIR /app

# Copiar solo los archivos necesarios para la instalación de dependencias
COPY package*.json ./
COPY .npmrc ./  

# Instalar dependencias
RUN npm ci

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine
WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de construcción
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./  
COPY --from=build /app/server.js ./

# Instalar solo las dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "server.js"]