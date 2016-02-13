#!/bin/bash 

if [ $# -eq 0 ] 
then
	echo "No Arguments Supplied"
	exit 1 
fi

if ! [ -d "/var/www/$1" ]
then 
	echo "Project does not exist!" 
	exit 1
fi 

cd /var/www/$1 && git pull 
if ! [ $? -eq 0 ]
then 
    echo 'Failed to pull update!'
    exit 1
fi 

cd /var/www/$1 && npm install && npm test
if ! [ $? -eq 0 ]
then 
    echo "Test failed!"
    cd /var/www/$1 && git reset --hard HEAD@{1}
    exit 1
fi 

if [ `forever list | grep $1 | wc -l` -eq 0 ]
then 
    echo "Service not found!"
    exit 1
fi     

forever restart $1
