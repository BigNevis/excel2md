# Usa una imagen base de Node.js
FROM node:18-alpine as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración
COPY package*.json ./

# Instala las dependencias
RUN npm ci

# Copia el resto de los archivos del proyecto
COPY . .

# Construye la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copia los archivos necesarios de la etapa de build
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start"]