CREATE TABLE `ActionType` (
  `actionTypeId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`actionTypeId`),
  UNIQUE KEY `actionTypeId_UNIQUE` (`actionTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ActionTypeItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `actionTypeId` int NOT NULL,
  `userId` int NOT NULL,
  `value` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `actionTypeIdUser_idx` (`actionTypeId`),
  KEY `userIdAction_idx` (`userId`),
  CONSTRAINT `actionTypeIdUser` FOREIGN KEY (`actionTypeId`) REFERENCES `ActionType` (`actionTypeId`),
  CONSTRAINT `userIdAction` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Comment` (
  `commentId` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  PRIMARY KEY (`commentId`),
  UNIQUE KEY `commentId_UNIQUE` (`commentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `CommentPost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commentId` int NOT NULL,
  `postId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `commentIdComm_idx` (`commentId`),
  KEY `postIdComm_idx` (`postId`),
  KEY `userIdComm_idx` (`userId`),
  CONSTRAINT `commentIdComm` FOREIGN KEY (`commentId`) REFERENCES `Comment` (`commentId`),
  CONSTRAINT `postIdComm` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`),
  CONSTRAINT `userIdComm` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Company` (
  `companyId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  `address` varchar(300) NOT NULL,
  `description` text,
  `img_url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`companyId`),
  UNIQUE KEY `companyId_UNIQUE` (`companyId`)
) ENGINE=InnoDB AUTO_INCREMENT=518 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Major` (
  `majorId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  PRIMARY KEY (`majorId`),
  UNIQUE KEY `majorId_UNIQUE` (`majorId`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `MajorItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `majorId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `majorIdMajor_idx` (`majorId`),
  KEY `userIdMajor_idx` (`userId`),
  CONSTRAINT `majorIdMajor` FOREIGN KEY (`majorId`) REFERENCES `Major` (`majorId`),
  CONSTRAINT `userIdMajor` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `MajorPost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `majorId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_MajorPost_1_idx` (`majorId`),
  KEY `postIdMajor_idx` (`postId`),
  CONSTRAINT `majorIdPost` FOREIGN KEY (`majorId`) REFERENCES `Major` (`majorId`),
  CONSTRAINT `postIdMajor` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=1754 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Post` (
  `postId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `extra_requirements` text NOT NULL,
  `description` text NOT NULL,
  `job_benefits` text NOT NULL,
  `salary` varchar(30) NOT NULL,
  `experience` varchar(50) DEFAULT NULL,
  `job_type` varchar(30) NOT NULL,
  `num_hiring` int DEFAULT NULL,
  `valid_through` date NOT NULL,
  `address` varchar(300) NOT NULL,
  `post_url` varchar(250) DEFAULT NULL,
  `qualification` varchar(70) DEFAULT NULL,
  `position` varchar(70) DEFAULT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`postId`),
  UNIQUE KEY `postId_UNIQUE` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=1059 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `PostCompany` (
  `postId` int NOT NULL,
  `companyId` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `companyId_idx` (`companyId`),
  KEY `postId_idx` (`postId`),
  CONSTRAINT `companyIdPost` FOREIGN KEY (`companyId`) REFERENCES `Company` (`companyId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `postIdComp` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=1046 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Rate` (
  `rateId` int NOT NULL AUTO_INCREMENT,
  `rate` int NOT NULL,
  PRIMARY KEY (`rateId`),
  UNIQUE KEY `rateId_UNIQUE` (`rateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `RatePost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rateId` int NOT NULL,
  `postId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userIdRate_idx` (`userId`),
  KEY `postIdRate_idx` (`postId`),
  KEY `rateId_idx` (`rateId`),
  CONSTRAINT `postIdRate` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`),
  CONSTRAINT `rateId` FOREIGN KEY (`rateId`) REFERENCES `Rate` (`rateId`),
  CONSTRAINT `userIdRate` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `User` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `experience` varchar(50) DEFAULT NULL,
  `qualification` varchar(30) DEFAULT NULL,
  `yearOfBirth` int NOT NULL,
  `gender` varchar(20) NOT NULL,
  `job_type` varchar(30) DEFAULT NULL,
  `salary` varchar(30) DEFAULT NULL,
  `is_lock` tinyint NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userId_UNIQUE` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WishList` (
  `WishList` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`WishList`),
  KEY `userIdWL_idx` (`userId`),
  KEY `postIdWL_idx` (`postId`),
  CONSTRAINT `postIdWL` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`),
  CONSTRAINT `userIdWL` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WorkPlace` (
  `workPlaceId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`workPlaceId`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WorkPlacePost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `workPlaceId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `postId_idx` (`postId`),
  KEY `workPlaceId_idx` (`workPlaceId`),
  CONSTRAINT `postIdWP` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`),
  CONSTRAINT `workPlaceIdPost` FOREIGN KEY (`workPlaceId`) REFERENCES `WorkPlace` (`workPlaceId`)
) ENGINE=InnoDB AUTO_INCREMENT=1271 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WorkPlaceUser` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workPlaceId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `workPlaceIdUser_idx` (`workPlaceId`),
  KEY `userIdWP_idx` (`userId`),
  CONSTRAINT `userIdWP` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`),
  CONSTRAINT `workPlaceIdUser` FOREIGN KEY (`workPlaceId`) REFERENCES `WorkPlace` (`workPlaceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
SELECT * FROM recruitment.Post;