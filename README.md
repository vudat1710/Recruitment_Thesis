# Recruitment Thesis

### Setup environment and data

- Python 3, npm, MySQL and MySQL Workbench installed in your server machine.
- Move to outer directory then run
```sh
$ pip install -r requirements.txt
``` 
to setup python environment for crawler and recommender modules (these modules written in Python).
- From outer directory, move to app directory then run 
```sh
$ npm install
``` 
in the current folder, `client`, and `client-admin` to install packages required.
- Open MySQL Workbench, select your MySQL Connection and run the SQL script `script.sql` provided in the outer directory.
- Change all database related constant variables in `constants.py` provided in `path_to_recruitment_thesis_dir/crawler/crawler` directory.
- In order to get data for our application, do the following steps:
> If there is no data in our database, move to the outer directory then run:
```sh
$ sh run.sh $1 $2
```
> In order to get data pushed into our database daily, use the following command to setup a cronjob for crawling and pushing data:
```sh
$ crontab -e > press o > 0 0 * * * sh path_to_recruitment_thesis_dir/run.sh $1 $2
```
> with $1 (either "daily" or other string) is the param to decide whether the crawler will do a daily type of crawling or not (In the first case, $1 could be any string except for "daily". In the second case, $1 should be "daily"), and $2 is the path to our recruitment thesis directory (without the "/" at the end of $2). For example:
```sh
$ sh run.sh all /home/vudat1710/Download/Thesis/Recruitment_Thesis
```
- Now we are good to go

### Starting the program

- From outer directory, user the following commands to start recommender backend module:
```sh
$ cd recommender/
$ python app.py
```
- From outer directory:
```sh
$ cd app/
$ npm run dev
```
to start backend and client frontend. To start admin frontend, use the following commands:
```sh
$ cd client-admin/
$ npm start
```