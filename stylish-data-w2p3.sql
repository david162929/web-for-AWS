-- MySQL dump 10.13  Distrib 5.7.24, for Linux (x86_64)
--
-- Host: localhost    Database: stylish
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaigns` (
  `campaigns_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` varchar(100) NOT NULL,
  `picture_path` varchar(100) DEFAULT '',
  `story` mediumtext,
  PRIMARY KEY (`campaigns_id`),
  UNIQUE KEY `campaigns_id_UNIQUE` (`campaigns_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (1,'sdjf123lj','public\\uploads\\1551082629426-201807202140.jpg','ahulgasdo;hsadof8as;oifhasivihsad;vihsaiosad'),(2,'gejgil844','public\\uploads\\1551082972952-201807242222.jpg','於是，\r\n我也想要給你，\r\n一個那麼美好的自己。\r\n不朽《與自己和好如初》'),(3,'fasdgada','public\\uploads\\1551083030846-201807242228.jpg','永遠~\r\n展現自信與專業~\r\n無法抵擋的男人魅力。\r\n~復古《再一次經典》'),(4,'ubkp24455','public/uploads/1551085818072-201807242228.jpg','alusdih;sdaofnas;asd;dsianvlksav;sdiv'),(5,'fasdgada','public/uploads/1551089844560-0.jpg','測試測試\r\n測試測試');
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT '',
  `description` mediumtext,
  `price` int(11) DEFAULT '0',
  `texture` varchar(100) DEFAULT '',
  `wash` varchar(100) DEFAULT '',
  `place` varchar(100) DEFAULT '',
  `note` varchar(100) DEFAULT '',
  `story` mediumtext,
  `color_codes` varchar(100) DEFAULT '',
  `color_names` varchar(100) DEFAULT '',
  `sizes` varchar(100) DEFAULT '',
  `main_image_path` text,
  `other_images_path` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (38,'sdjf123lj','厚實毛呢格子外套','women','fgvcvzx',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','asdvv','asdcvc','FFFFFF,FFDDDD','白色,粉紅','S,M','public\\uploads\\1550733214021-main.jpg','public\\uploads\\1550733214023-0.jpg,public\\uploads\\1550733214023-1.jpg'),(39,'gejgil844','厚實毛呢格子外套','women','sdfgsdf',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','sdfgsdfb','sfdhsfdbs','FFFFFF,FFDDDD,DDFFBB,DDF0FF,CCCCCC,BB7744,334455','白色,粉紅,亮綠,淺藍,淺灰,淺棕,深藍','S,M,L','public\\uploads\\1550733430704-main.jpg','public\\uploads\\1550733430705-0.jpg,public\\uploads\\1550733430705-1.jpg,public\\uploads\\1550733430707-main.jpg'),(40,'fasdgada','厚實毛呢格子外套','men','rybsdyv',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','tvrsdyvrt','65une6','CCCCCC,BB7744,334455','淺灰,淺棕,深藍','S,M','public\\uploads\\1550823619842-main.jpg','public\\uploads\\1550823619852-1.jpg'),(41,'ubkp24455','厚實毛呢格子外套','men','r968pnb',1100,'棉、聚脂纖維','手洗（水溫40度','韓國','978j67t7mij7t','yttuninuyi','FFFFFF,FFDDDD','白色,粉紅','S,M,L,XL','public\\uploads\\1550823831631-0.jpg','public\\uploads\\1550823831636-1.jpg,public\\uploads\\1550823831638-main.jpg'),(42,'67878j767','厚實毛呢格子外套','accessories','th strsr',300,'棉、聚脂纖維','手洗（水溫40度','韓國','btuetyvukuy','ryubuybry','CCCCCC,BB7744,334455','淺灰,淺棕,深藍','S,M','public\\uploads\\1550823900478-main.jpg','public\\uploads\\1550823900482-0.jpg,public\\uploads\\1550823900484-1.jpg'),(43,'odnygoinv','厚實毛呢格子外套','men','savcwr',50,'棉、聚脂纖維','手洗（水溫40度','韓國','itktuikt','tbyjtbku','FFFFFF,FFDDDD','白色,粉紅','S,M,L,XL','public\\uploads\\1550824852473-main.jpg','public\\uploads\\1550824852476-0.jpg,public\\uploads\\1550824852477-1.jpg,public\\uploads\\1550824852477-main.jpg'),(44,'787878787','厚實毛呢格子外套','women','dfgsdfgv',8787,'棉、聚脂纖維','手洗（水溫40度','韓國',' adbdfs','h fgmjh','FFFFFF,FFDDDD','白色,粉紅','S,M','public\\uploads\\1550824911266-1.jpg','public\\uploads\\1550824911267-1.jpg'),(45,'111112121','厚實毛呢格子外套','accessories','asdfasdf',3243,'棉、聚脂纖維','手洗（水溫40度','韓國','adfgadfg','agadgad','FFFFFF,FFDDDD','白色,粉紅','S,M','public\\uploads\\1551063398100-main.jpg','public\\uploads\\1551063398102-0.jpg,public\\uploads\\1551063398103-1.jpg'),(46,'jfiogjrg','厚實毛呢格子外套','women','vdgsdfh',3,'棉、聚脂纖維','手洗（水溫40度','韓國','sdfsdfg','ssdfbs','FFFFFF,FFDDDD','白色,粉紅','S,M','public\\uploads\\1551065576370-main.jpg','public\\uploads\\1551065576371-0.jpg,public\\uploads\\1551065576372-1.jpg,public\\uploads\\1551065576373-main.jpg');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `picture` varchar(100) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `access_expired` bigint(20) DEFAULT NULL,
  `access_token_fb` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,NULL,'native','test','test@test.com','test','','251a28065eb4d4b3b39a826f936049dce3e2234cae7f9ac60b64ed750dc230b4',3600,NULL),(2,NULL,'native','test1','test1@test.com','test1','','29be8e6bfd720728ffec481f132df904730f529ea8379dfd190f13c4dd0c2133',3600,NULL),(3,NULL,'native','test2','test2@test.com','test2','','8e53ca7ecf69a3a627d289be599e638771c8112b003f94961adff8b5f37c5470',3600,NULL),(4,NULL,'native','test3','test3@test.com','test3','','d1bb2b63d6396463d32db5d14e195990616a67623239fa830a935237a162a716',3600,NULL),(5,NULL,'native','test4','test4@test.com','test4','','e191b2b64fbc5d55c8f6d990c37ae2069039072cec8e1e433ddd879c16dc0d68',3600,NULL),(6,NULL,'native','test5','test5@test.com','test5','','041801c91a0aa80e0bf258e6ffc21564b423a738adf3c5e1210d7bb39f75a7de',3600,NULL),(7,NULL,'native','test6','test6@test.com','test6','','292b1a5d893428234aad82a1a1672bad657284ec9f9da6e9ea3d623e53ca3218',3600,NULL),(8,NULL,'native','test7','test7@test.com','test7','','2fdfe751b083d650947aa2e6af452cee4b87e164c961c099792edf7587032181',3600,NULL),(9,NULL,'native','test8','test8@test.com','test8','','d3af186f11b19a2d2c07667c15ec1b15b039d08df18d977f1f5ab0a872b5cbb2',3600,NULL),(10,NULL,'native','test9','test9@test.com','test9','','df4e49badf3f2fbd75573b7c0669fd5aaecee74e53a959172691797a908d5210',3600,NULL),(11,NULL,'native','test10','test10@test.com','test10','','ce5dbe87006fc79f304614a8f79049435d952931a2fa418e0e3c89e53a33719e',3600,NULL),(12,NULL,'native','test11','test11@test.com','test11','','7b838635c99b9c92cff307c1189c543b3d186206bcfc03c25d655c1bff8d5938',3600,NULL),(13,NULL,'native','test12','test12@test.com','test12','','277a28c72b15d2007556b4f0574bf29f0e6d81c7eb7695b59628529a4565c1ff',1551345963666,'EAAFqxw9GAHQBAMjf1xQzvDF8eFkuTtw1PMEpQey5h02p6X676j80I2wCVYvHyzVkHeSfmN4Q9JYcGQf1SBaAR9N9oXW67eeZChtdoUTxaxfhpYbsS0OMSLMay7uH1JvGrUaZBQGGaZCWKuPdX3YDt3mtWG1lJzvp5DJeSwEpDPSjjEqIX1083ILeLfvBngZD'),(14,NULL,'native','test13','test13@test.com','test13','','91937e3f5871224242a9b13a1233dd64f4f5133817bacede7c824200a167a3e9',1551332265142,NULL),(15,NULL,'facebook','David Chen','en16292901@gmail.com',NULL,'','fec44809b89276c193326cbb1653ddec5f45632cba8f706ea0b79a84c89552a1',1551347715063,'EAAFqxw9GAHQBALUQqQI3QrSIyWMSJj2d7MkWmun2bO7NkZBZBCdYalxIZAt7cOZBeVeXSBryFA06AZBZAsHFBHhhTXbwf4myDpkCc0zKWcjicYDj6sNu2OzGhQy6scuyGZBzfOBVcvyumxzmQgMwqdB36zuoM8DsBLR9NiIfMyTyo0rlOQUmQWj8vpiPJzGubb0ilpT8hZCWEwZDZD');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variants`
--

DROP TABLE IF EXISTS `variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variants` (
  `variant_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` varchar(100) NOT NULL,
  `product_type` varchar(45) DEFAULT '',
  `color_code` varchar(45) DEFAULT '',
  `color_name` varchar(45) DEFAULT '',
  `size` varchar(45) DEFAULT '',
  `variant_price` int(11) DEFAULT '0',
  `stock` int(11) DEFAULT '0',
  PRIMARY KEY (`variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=164 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variants`
--

LOCK TABLES `variants` WRITE;
/*!40000 ALTER TABLE `variants` DISABLE KEYS */;
INSERT INTO `variants` VALUES (99,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(100,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(101,'sdjf123lj','3','FFDDDD','粉紅','S',2200,0),(102,'sdjf123lj','4','FFDDDD','粉紅','M',2200,0),(103,'gejgil844','1','FFFFFF','白色','S',2200,0),(104,'gejgil844','2','FFFFFF','白色','M',2200,0),(105,'gejgil844','3','FFFFFF','白色','L',2200,0),(106,'gejgil844','4','FFDDDD','粉紅','S',2200,0),(107,'gejgil844','5','FFDDDD','粉紅','M',2200,0),(108,'gejgil844','6','FFDDDD','粉紅','L',2200,0),(109,'gejgil844','7','DDFFBB','亮綠','S',2200,0),(110,'gejgil844','8','DDFFBB','亮綠','M',2200,0),(111,'gejgil844','9','DDFFBB','亮綠','L',2200,0),(112,'gejgil844','10','DDF0FF','淺藍','S',2200,0),(113,'gejgil844','11','DDF0FF','淺藍','M',2200,0),(114,'gejgil844','12','DDF0FF','淺藍','L',2200,0),(115,'gejgil844','13','CCCCCC','淺灰','S',2200,0),(116,'gejgil844','14','CCCCCC','淺灰','M',2200,0),(117,'gejgil844','15','CCCCCC','淺灰','L',2200,0),(118,'gejgil844','16','BB7744','淺棕','S',2200,0),(119,'gejgil844','17','BB7744','淺棕','M',2200,0),(120,'gejgil844','18','BB7744','淺棕','L',2200,0),(121,'gejgil844','19','334455','深藍','S',2200,0),(122,'gejgil844','20','334455','深藍','M',2200,0),(123,'gejgil844','21','334455','深藍','L',2200,0),(124,'fasdgada','1','CCCCCC','淺灰','S',2200,0),(125,'fasdgada','2','CCCCCC','淺灰','M',2200,0),(126,'fasdgada','3','BB7744','淺棕','S',2200,0),(127,'fasdgada','4','BB7744','淺棕','M',2200,0),(128,'fasdgada','5','334455','深藍','S',2200,0),(129,'fasdgada','6','334455','深藍','M',2200,0),(130,'ubkp24455','1','FFFFFF','白色','S',1100,0),(131,'ubkp24455','2','FFFFFF','白色','M',1100,0),(132,'ubkp24455','3','FFFFFF','白色','L',1100,0),(133,'ubkp24455','4','FFFFFF','白色','XL',1100,0),(134,'ubkp24455','5','FFDDDD','粉紅','S',1100,0),(135,'ubkp24455','6','FFDDDD','粉紅','M',1100,0),(136,'ubkp24455','7','FFDDDD','粉紅','L',1100,0),(137,'ubkp24455','8','FFDDDD','粉紅','XL',1100,0),(138,'67878j767','1','CCCCCC','淺灰','S',300,0),(139,'67878j767','2','CCCCCC','淺灰','M',300,0),(140,'67878j767','3','BB7744','淺棕','S',300,0),(141,'67878j767','4','BB7744','淺棕','M',300,0),(142,'67878j767','5','334455','深藍','S',300,0),(143,'67878j767','6','334455','深藍','M',300,0),(144,'odnygoinv','1','FFFFFF','白色','S',50,0),(145,'odnygoinv','2','FFFFFF','白色','M',50,0),(146,'odnygoinv','3','FFFFFF','白色','L',50,0),(147,'odnygoinv','4','FFFFFF','白色','XL',50,0),(148,'odnygoinv','5','FFDDDD','粉紅','S',50,0),(149,'odnygoinv','6','FFDDDD','粉紅','M',50,0),(150,'odnygoinv','7','FFDDDD','粉紅','L',50,0),(151,'odnygoinv','8','FFDDDD','粉紅','XL',50,0),(152,'787878787','1','FFFFFF','白色','S',8787,0),(153,'787878787','2','FFFFFF','白色','M',8787,0),(154,'787878787','3','FFDDDD','粉紅','S',8787,0),(155,'787878787','4','FFDDDD','粉紅','M',8787,0),(156,'111112121','1','FFFFFF','白色','S',3243,0),(157,'111112121','2','FFFFFF','白色','M',3243,0),(158,'111112121','3','FFDDDD','粉紅','S',3243,0),(159,'111112121','4','FFDDDD','粉紅','M',3243,0),(160,'jfiogjrg','1','FFFFFF','白色','S',3,0),(161,'jfiogjrg','2','FFFFFF','白色','M',3,0),(162,'jfiogjrg','3','FFDDDD','粉紅','S',3,0),(163,'jfiogjrg','4','FFDDDD','粉紅','M',3,0);
/*!40000 ALTER TABLE `variants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-27  9:56:18
