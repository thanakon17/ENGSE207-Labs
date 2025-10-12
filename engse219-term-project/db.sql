-- Stardew Valley Database Script (db.sql)
-- Part 1: DDL (Data Definition Language) - Table Structure

-- To ensure a clean setup, drop existing tables in reverse order of creation
DROP TABLE IF EXISTS Equipped_Items;
DROP TABLE IF EXISTS Farmer_Inventory;
DROP TABLE IF EXISTS Items;
DROP TABLE IF EXISTS ItemTypes;
DROP TABLE IF EXISTS SlotTypes;
DROP TABLE IF EXISTS Farmer_Skills;
DROP TABLE IF EXISTS Skills;
DROP TABLE IF EXISTS Farmers;
DROP TABLE IF EXISTS Players;

-- Create all tables
CREATE TABLE Players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Farmers (
    farmer_id INT PRIMARY KEY AUTO_INCREMENT,
    player_id INT NOT NULL,
    farm_name VARCHAR(100) NOT NULL,
    money BIGINT NOT NULL DEFAULT 500 CHECK (money >= 0),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE
);

CREATE TABLE Skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Farmer_Skills (
    farmer_id INT,
    skill_id INT,
    level INT NOT NULL DEFAULT 0 CHECK (level BETWEEN 0 AND 10),
    xp INT NOT NULL DEFAULT 0,
    PRIMARY KEY (farmer_id, skill_id),
    FOREIGN KEY (farmer_id) REFERENCES Farmers(farmer_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);

CREATE TABLE ItemTypes (
    item_type_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_type_id INT NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    buff_combat INT NOT NULL DEFAULT 0,
    buff_defense INT NOT NULL DEFAULT 0,
    buff_luck INT NOT NULL DEFAULT 0,
    FOREIGN KEY (item_type_id) REFERENCES ItemTypes(item_type_id)
);

CREATE TABLE Farmer_Inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    farmer_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    FOREIGN KEY (farmer_id) REFERENCES Farmers(farmer_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Items(item_id)
);

CREATE TABLE SlotTypes (
    slot_type_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Equipped_Items (
    farmer_id INT,
    slot_type_id INT,
    inventory_id INT NOT NULL UNIQUE,
    PRIMARY KEY (farmer_id, slot_type_id),
    FOREIGN KEY (farmer_id) REFERENCES Farmers(farmer_id) ON DELETE CASCADE,
    FOREIGN KEY (slot_type_id) REFERENCES SlotTypes(slot_type_id),
    FOREIGN KEY (inventory_id) REFERENCES Farmer_Inventory(inventory_id) ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX idx_farmers_player_id ON Farmers(player_id);
CREATE INDEX idx_inventory_farmer_id ON Farmer_Inventory(farmer_id);

-- ===================================================================

-- Part 2: DML (Data Manipulation Language) - Sample Data

-- Insert Players
INSERT INTO Players (username) VALUES ('ConcernedApe'), ('Gamer123'), ('WebApp_User');

-- Insert Farmers
INSERT INTO Farmers (player_id, farm_name, money) VALUES (1, 'Stardew Farm', 150000), (2, 'Gemini Farm', 75000), (3, 'Pelican Farm', 120000);

-- Insert Master Data for Skills
INSERT INTO Skills (name) VALUES ('Farming'), ('Mining'), ('Foraging'), ('Fishing'), ('Combat');

-- Insert Gemini Farm's Skill Levels (farmer_id = 2)
INSERT INTO Farmer_Skills (farmer_id, skill_id, level, xp) VALUES
(2, 1, 7, 6500), (2, 2, 8, 8100), (2, 3, 6, 4200), (2, 4, 5, 2800), (2, 5, 8, 8500);

-- Insert Stardew Farm's Skill Levels (farmer_id = 1)
INSERT INTO Farmer_Skills (farmer_id, skill_id, level, xp) VALUES
(1, 1, 10, 15000), (1, 2, 10, 15000), (1, 3, 10, 15000), (1, 4, 10, 15000), (1, 5, 10, 15000);

-- Insert Master Data for ItemTypes & SlotTypes
INSERT INTO ItemTypes (name) VALUES ('Tool'), ('Boots'), ('Ring'), ('Hat'), ('Seed');
INSERT INTO SlotTypes (name) VALUES ('Ring1'), ('Ring2'), ('Boots'), ('Hat');

-- Insert Sample Items
INSERT INTO Items (item_type_id, name, description, buff_defense, buff_luck) VALUES
(2, 'Space Boots', 'They''re otherworldly.', 4, 4),
(3, 'Iridium Band', 'Glows, attracts items, and increases attack power.', 0, 0),
(3, 'Lucky Ring', 'The wearer feels a little luckier.', 0, 1),
(3, 'Slime Charmer Ring', 'Prevents damage from slimes.', 0, 0);

INSERT INTO Items (item_type_id, name) VALUES (1, 'Iridium Axe'), (1, 'Parsnip Seeds');

-- Insert Gemini Farm's Inventory (farmer_id = 2)
INSERT INTO Farmer_Inventory (farmer_id, item_id, quantity) VALUES
(2, 1, 1), -- Space Boots, inv_id=1
(2, 2, 1), -- Iridium Band, inv_id=2
(2, 3, 1), -- Lucky Ring, inv_id=3
(2, 5, 1), -- Iridium Axe, inv_id=4
(2, 6, 20); -- Parsnip Seeds, inv_id=5

-- Equip Items for Gemini Farm
INSERT INTO Equipped_Items (farmer_id, slot_type_id, inventory_id) VALUES
(2, 3, 1), -- Equip Space Boots (slot_id=3 'Boots')
(2, 1, 2), -- Equip Iridium Band (slot_id=1 'Ring1')
(2, 2, 3); -- Equip Lucky Ring (slot_id=2 'Ring2')