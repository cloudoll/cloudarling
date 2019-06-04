cd ..
git checkout mysql
export NODE_ENV=product;
node index.js
# pm2 start index.js --name=cloudarling