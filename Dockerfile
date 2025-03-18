# Node.js resmi imajını kullan
FROM node:18

# Çalışma dizinini ayarla
WORKDIR /app

# Bağımlılıkları yüklemek için package.json ve package-lock.json dosyalarını kopyala
COPY package.json package-lock.json ./

# Bağımlılıkları yükle
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# Uygulamanın 3000 portunu aç
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "index.js"]
