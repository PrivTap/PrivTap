#!/bin/sh

cd ./frontend
npm i
npm run build

cd ..

cd ./backend
npm i
npm run build
export EXPRESS_STATIC_FILES=../frontend/dist
npm run start