# pweb-01-walogger
wa loger

## Local
1. Melakukan instalasi paket yang dibutuhkan

    `npm init -y`
   
    `npm install express`
   
    `npm install cors`
   
    `npm install mongodb`
   
    `npm install mongoose`
   
    `npm install gridfs-stream`
   
    `npm install multer`


3. Menjalankan Backend:

    `node server/index.js`


3. Membuka dan menjalankan Client/Index.html

    Frontend: [http://127.0.0.1:5500/client/index.html](http://localhost:5500/client/index.html)

    Backend: [http://127.0.0.1:3000/](http://localhost:3000/)

## Deployed
  Froentend: [http://34.122.120.242/](http://34.122.120.242/)
  
  Backend: [http://34.122.120.242/](http://34.122.120.242/)

## Langkah - Langkah Deployment


### Prerequisite

Langkah - langkah ini kami lakukan pada Debian, tapi seharusnya dapat bekerja di distribusi linux lainnya.

1. Port 3000 terbuka
2. node.js dan npm sudah terinstall
3. nginx sudah terinstall
4. git sudah terinstall
5. unzip sudah terinstall



### Langkah - Langkah

1. Pindah ke directory `/var/www/html/` dan jalankan command `sudo git clone https://github.com/devrwynth/pweb-01-walogger.git` untuk mengclone repo ke directory tersebut
   
   ![image](https://github.com/user-attachments/assets/a9b37ec1-db3b-4f34-b4f5-70efa6e3e4fe)

2. Masuk ke directory `pweb-01-walogger` dan jalankan `sudo bash installation.bat` untuk menginstall dependensi aplikasi.

   ![image](https://github.com/user-attachments/assets/1eb50332-752d-4f8d-b42e-6169f3ec389f)

3. Pindah ke directory `client` pada folder aplikasi dan jalankan `sudo sed -i 's/localhost/[IP SERVER]/g' *` untuk mengganti semua tulisan `localhost` menjadi IP server. Ubah [IP SERVER] dengan IP server. Jalankan command yang sama pada directory `server`

   ![image](https://github.com/user-attachments/assets/98b9ba8b-a34e-4f7d-a997-89ef864a211f)

4. Pindah ke directory `/etc/nginx/sites-available/` dan edit file `default`, mengganti bagian root menjadi `/var/www/html/pweb-01-walogger/client`

    ![image](https://github.com/user-attachments/assets/9109e636-c537-45b2-8df4-9ba9df9d2a01)

5. Jalankan `sudo systemctl reload nginx` untuk mengupdate setting nginx.

   ![image](https://github.com/user-attachments/assets/8325cdbf-07ce-43a9-9e1a-86247c75796e)

6. Pindah ke directory `/var/www/html/pweb-01-walogger/server` dan jalankan `sudo node index.js` untuk menyalakan server. Frontend dapat diakses pada port 80, sedangkan backend dapat diakses pada port 3000.

   ![image](https://github.com/user-attachments/assets/44f856a7-29d9-4909-8c2b-db57347f2e62)

   ![image](https://github.com/user-attachments/assets/e06f6cb9-71d8-4390-9a62-8702e32fb440)


    Alternatifnya, jika aplikasi ingin dinyalakan bahkan setelah logout dari linux, agar server tidak mati, server dapat dinyalakan dengan `pm2`. `pm2` dapat diinstal dengan menjalankan `sudo npm install pm2 -g`. Server dapat dinyalakan dengan `pm2 start /var/www/html/pweb-01-walogger/server/index.js` dan dimatikan dengan `pm2 stop /var/www/html/pweb-01-walogger/server/index.js`


    ![image](https://github.com/user-attachments/assets/4f4fdcaa-b5b2-4e23-a84d-39fd5796ebaa)

    ![image](https://github.com/user-attachments/assets/cd420664-62cc-4bad-b25d-7e46322ab465)

    

