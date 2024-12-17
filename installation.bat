curl -fsSL https://fnm.vercel.app/install | bash
fnm env --use-on-cd | Out-String | Invoke-Expression
fnm use --install-if-missing 22

node -v
npm -v

npm init -y
npm install express
npm install cors
npm install mongodb
npm install mongoose
npm install gridfs-stream
npm install multer-gridfs-storage
npm install multer@1.4.4
npm install sonner
