CREATE TABLE User (
  id int auto_increment not null primary key,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  username VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE Deck (
  id int auto_increment not null primary key,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  title VARCHAR(255),
  side VARCHAR(255),
  description VARCHAR(8000),
  published Boolean DEFAULT false,
  deleted Boolean DEFAULT false,
  authorId INT NOT NULL,
  FOREIGN KEY (authorId) REFERENCES User(id)
);
create table Card (
  id int auto_increment not null primary key,
  card_id int,
  side VARCHAR(255),
  rarity VARCHAR(255),
  card_set VARCHAR(255),
  front_title VARCHAR(1000),
  front_imageUrl VARCHAR(255),
  front_type VARCHAR(255),
  front_subType VARCHAR(255),
  front_destiny VARCHAR(255),
  front_power VARCHAR(255),
  front_deploy VARCHAR(255),
  front_forfeit VARCHAR(255),
  front_gametext VARCHAR(5000),
  front_lore VARCHAR(5000),
  counterpart VARCHAR(255),
  gemp_card_id VARCHAR(255)
);
CREATE TABLE DeckCard(
  id int auto_increment not null primary key,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  cardId INTEGER NOT NULL,
  FOREIGN KEY (cardId) REFERENCES Card(id),
  deckId INTEGER NOT NULL,
  FOREIGN KEY (deckId) REFERENCES Deck(id),
  is_in_side_deck Boolean DEFAULT false,
  is_starting_card Boolean DEFAULT false
);
create table DeckRating (
  id int auto_increment not null primary key,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  rating float NOT NULL,
  authorId INTEGER NOT NULL,
  FOREIGN KEY (authorId) REFERENCES User(id),
  deckId INTEGER NOT NULL,
  FOREIGN KEY (deckId) REFERENCES Deck(id)
);
create table Comment (
  id int auto_increment not null primary key,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  comment VARCHAR(8000),
  authorId INTEGER NOT NULL,
  FOREIGN KEY (authorId) REFERENCES User(id),
  deckId INTEGER,
  FOREIGN KEY (deckId) REFERENCES Deck(id),
  cardId INTEGER,
  FOREIGN KEY (cardId) REFERENCES Card(id)
);
