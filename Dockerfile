# Temel Node.js image'ini kullan
FROM node:18-alpine

# Çalışma dizinini ayarla
WORKDIR /app

# Paket dosyalarını kopyala
COPY package.json  ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama dosyalarını kopyala
COPY . .

# Uygulamanın çalışacağı portu belirt
EXPOSE 3000

# Uygulamayı başlat
CMD ["node", "index.js"]
