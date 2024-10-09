CREATE DATABASE Task3;

USE Task3;

CREATE TABLE PetrolStations (
	PetrolStationID varchar(25) NOT NULL PRIMARY KEY,
	Name varchar(100),
	Address varchar(100),
	PhoneNumber varchar(12),
	NumberOfPumps int,
	OperationalStatus varchar(12),
	OwnerName varchar(25),
);

CREATE TABLE Products (
	ProductID varchar(25) NOT NULL PRIMARY KEY,
	Name varchar(25),
	Unit varchar(12),
	SalePrice float
)

CREATE TABLE PumpStations (
	PumpStationID varchar(25) NOT NULL PRIMARY KEY,
	PetrolStationID varchar(25) FOREIGN KEY REFERENCES PetrolStations(PetrolStationID),
	ProductID varchar(25) FOREIGN KEY REFERENCES Products(ProductID),
	PumpNumber int,
	OperationalStatus varchar(12),
	TotalFuelDispensed float,
	ToTalFuelRemaining float,
)


CREATE TABLE Transactions (
	TransactionID varchar(25) NOT NULL PRIMARY KEY,
	PetrolStationID varchar(25) FOREIGN KEY REFERENCES PetrolStations(PetrolStationID),
	PumpStationID varchar(25) FOREIGN KEY REFERENCES PumpStations(PumpStationID),
	TransactionDateTime datetime,
	Total float,
	PaymentMethod varchar(12),
	TransactionStatus varchar(12)
)


CREATE TABLE TransactionDetails (
	TransactionDetailID varchar(25) NOT NULL PRIMARY KEY,
	TransactionID varchar(25) FOREIGN KEY REFERENCES Transactions(TransactionID),
	ProductID varchar(25) FOREIGN KEY REFERENCES Products(ProductID),
	ProductName varchar(25),
	Unit varchar(12),
	Quantity float,
	SalePrice float,
	SubTotal float, 
	TransactionDateTime datetime,
	Total float,
	PaymentMethod varchar(12),
	TransactionStatus varchar(12)
)

CREATE INDEX idx_PetrolStation_OnTime ON Transactions(PetrolStationID, TransactionDateTime);
-- Giúp truy vấn thống kê nhanh hơn trong việc thống kê giao dịch theo Trạm bơm với 1 khoảng thời gian
CREATE INDEX idx_PetrolStation__PumpStation_OnTime ON Transactions(PetrolStationID, PumpStationID, TransactionDateTime);
-- Giúp truy vấn thống kê nhanh hơn trong việc thống kê giao dịch theo Trạm bơm, trụ bơm với 1 khoảng thời gian
