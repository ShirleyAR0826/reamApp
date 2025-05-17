CREATE TABLE Assets (
    Id INT PRIMARY KEY IDENTITY(1,1),
    AssetName NVARCHAR(100),
    Location NVARCHAR(100),
    DateAcquired DATE
);

GO

CREATE PROCEDURE usp_InsertAsset
    @AssetName NVARCHAR(100),
    @Location NVARCHAR(100),
    @DateAcquired DATE
AS
BEGIN
    INSERT INTO Assets (AssetName, Location, DateAcquired)
    VALUES (@AssetName, @Location, @DateAcquired)
END;

GO

SELECT * FROM Assets
WHERE DateAcquired >= DATEADD(YEAR, -5, GETDATE());

GO

CREATE TABLE AssetAudit (
    AuditId INT IDENTITY(1,1),
    AssetId INT,
    Action NVARCHAR(10),
    ActionDate DATETIME DEFAULT GETDATE()
);

GO

CREATE TRIGGER trg_AuditInsert ON Assets
AFTER INSERT
AS
BEGIN
    INSERT INTO AssetAudit (AssetId, Action)
    SELECT Id, 'INSERT' FROM inserted;
END;
