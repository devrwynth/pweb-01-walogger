bash fnm-install.sh
source /root/.bashrc
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
npm install multer


