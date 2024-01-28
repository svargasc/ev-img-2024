url: https://events2024-3dfea1b2c04b.herokuapp.com/

create database eventsBrews;

use eventsBrews;

create table users(
id int auto_increment primary key,
username varchar(50) not null,
email varchar(50) not null,
password longtext,
img_profile varchar(255)
);

create table clients(
id int auto_increment primary key,
name varchar(50) not null,
email varchar(50) not null,
password longtext
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(100),
  description VARCHAR(200),
  address VARCHAR(100),
  dates VARCHAR(100),
  img_event VARCHAR(255),
  done BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE event_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT,
  image_url VARCHAR(255),
  FOREIGN KEY (event_id) REFERENCES events(id)
);
