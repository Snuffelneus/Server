Server
======

Server software and Database of Snuffelneus

===============================
List of Database tables and description:

User
Holds list of users using a unique identifier.

SensorType
All different types of sensors connected to the Snuffleneus according to an unique name.

Reading
Holds info for a particular reading of a user/Snuffelneus.

Data
Value of a sensor measured by a reading


===============================

Creation scripts for the tables:

	CREATE TABLE [dbo].[Data] (
		[Id]           INT        IDENTITY (1, 1) NOT NULL,
		[SensorTypeId] INT        NOT NULL,
		[Value]        FLOAT (53) NOT NULL,
		[ReadingId]    INT        NOT NULL
	);

	CREATE TABLE [dbo].[Reading] (
		[Id]        INT        IDENTITY (1, 1) NOT NULL,
		[UserId]    INT        NOT NULL,
		[Created]   DATETIME   NOT NULL,
		[Latitude]  FLOAT (53) NOT NULL,
		[Longitude] FLOAT (53) NOT NULL
	);

	CREATE TABLE [dbo].[SensorType] (
		[Id]   INT          IDENTITY (1, 1) NOT NULL,
		[Name] VARCHAR (24) NOT NULL
	);

	CREATE TABLE [dbo].[User] (
		[Id]     INT           IDENTITY (1, 1) NOT NULL,
		[Secret] NVARCHAR (32) NOT NULL
	);