USE recruitment_test;

CREATE TABLE `ActionType` (
  `actionTypeId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`actionTypeId`),
  UNIQUE KEY `actionTypeId_UNIQUE` (`actionTypeId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ActionTypeItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `actionTypeId` int NOT NULL,
  `userId` int NOT NULL,
  `value` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `actionTypeIdUser_idx` (`actionTypeId`),
  KEY `userIdAction_idx` (`userId`),
  KEY `postIdAction_idx` (`postId`),
  CONSTRAINT `actionTypeIdUser` FOREIGN KEY (`actionTypeId`) REFERENCES `ActionType` (`actionTypeId`),
  CONSTRAINT `postIdAction` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`),
  CONSTRAINT `userIdAction` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `CommentPost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `postId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `postIdComm_idx` (`postId`),
  KEY `userIdComm_idx` (`userId`),
  CONSTRAINT `postIdComm` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`),
  CONSTRAINT `userIdComm` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Company` (
  `companyId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `address` varchar(300) NOT NULL,
  `description` text,
  `img_url` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`companyId`),
  UNIQUE KEY `companyId_UNIQUE` (`companyId`)
) ENGINE=InnoDB AUTO_INCREMENT=5985 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Major` (
  `majorId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(70) NOT NULL,
  PRIMARY KEY (`majorId`),
  UNIQUE KEY `majorId_UNIQUE` (`majorId`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `MajorItem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `majorId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `majorIdMajor_idx` (`majorId`),
  KEY `userIdMajor_idx` (`userId`),
  CONSTRAINT `majorIdMajor` FOREIGN KEY (`majorId`) REFERENCES `Major` (`majorId`),
  CONSTRAINT `userIdMajor` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=36192 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Post` (
  `postId` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `extra_requirements` text NOT NULL,
  `description` text NOT NULL,
  `job_benefits` text NOT NULL,
  `salary_type` varchar(30) NOT NULL,
  `experience` varchar(50) DEFAULT NULL,
  `job_type` varchar(30) NOT NULL,
  `num_hiring` int DEFAULT NULL,
  `valid_through` date NOT NULL,
  `address` varchar(300) DEFAULT NULL,
  `post_url` varchar(250) DEFAULT NULL,
  `qualification` varchar(70) DEFAULT NULL,
  `position` varchar(150) DEFAULT NULL,
  `contact_name` varchar(100) DEFAULT NULL,
  `min_value` int DEFAULT NULL,
  `max_value` int DEFAULT NULL,
  PRIMARY KEY (`postId`),
  UNIQUE KEY `postId_UNIQUE` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=16385 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `PostCompany` (
  `postId` int NOT NULL,
  `companyId` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `companyId_idx` (`companyId`),
  KEY `postId_idx` (`postId`),
  CONSTRAINT `companyIdPost` FOREIGN KEY (`companyId`) REFERENCES `Company` (`companyId`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `postIdComp` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`)
) ENGINE=InnoDB AUTO_INCREMENT=16384 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `RatePost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rate` int NOT NULL,
  `postId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userIdRate_idx` (`userId`),
  KEY `postIdRate_idx` (`postId`),
  CONSTRAINT `postIdRate` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`),
  CONSTRAINT `userIdRate` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `User` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `experience` varchar(50) DEFAULT NULL,
  `qualification` varchar(70) DEFAULT NULL,
  `year_of_birth` date NOT NULL,
  `gender` varchar(20) NOT NULL,
  `job_type` varchar(30) DEFAULT NULL,
  `salary` varchar(30) DEFAULT NULL,
  `is_lock` tinyint NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userId_UNIQUE` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WishList` (
  `wishListId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`wishListId`),
  KEY `userIdWL_idx` (`userId`),
  KEY `postIdWL_idx` (`postId`),
  CONSTRAINT `postIdWL` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`),
  CONSTRAINT `userIdWL` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WorkPlace` (
  `workPlaceId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`workPlaceId`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WorkPlacePost` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `workPlaceId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `postId_idx` (`postId`),
  KEY `workPlaceId_idx` (`workPlaceId`),
  CONSTRAINT `postIdWP` FOREIGN KEY (`postId`) REFERENCES `Post` (`postId`),
  CONSTRAINT `workPlaceIdPost` FOREIGN KEY (`workPlaceId`) REFERENCES `WorkPlace` (`workPlaceId`)
) ENGINE=InnoDB AUTO_INCREMENT=18842 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `WorkPlaceUser` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workPlaceId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `workPlaceIdUser_idx` (`workPlaceId`),
  KEY `userIdWP_idx` (`userId`),
  CONSTRAINT `userIdWP` FOREIGN KEY (`userId`) REFERENCES `User` (`userId`),
  CONSTRAINT `workPlaceIdUser` FOREIGN KEY (`workPlaceId`) REFERENCES `WorkPlace` (`workPlaceId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE recruitment_test.Major AUTO_INCREMENT = 1;
ALTER TABLE recruitment_test.WorkPlace AUTO_INCREMENT = 1;
ALTER TABLE recruitment_test.User AUTO_INCREMENT = 1;
ALTER TABLE recruitment_test.Post AUTO_INCREMENT = 1;
ALTER TABLE recruitment_test.Company AUTO_INCREMENT = 1;
ALTER TABLE recruitment_test.MajorItem AUTO_INCREMENT = 1;
ALTER TABLE recruitment_test.MajorPost AUTO_INCREMENT = 1;
ALTER TABLE recruitment_test.WorkPlaceUser AUTO_INCREMENT = 1;
ALTER TABLE recruitment_test.WorkPlacePost AUTO_INCREMENT = 1;
ALTER TABLE recruitment_test.PostCompany AUTO_INCREMENT = 1;