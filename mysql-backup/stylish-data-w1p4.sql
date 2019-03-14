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
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` varchar(100) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` mediumtext,
  `price` int(11) DEFAULT '0',
  `texture` varchar(100) DEFAULT NULL,
  `wash` varchar(100) DEFAULT NULL,
  `place` varchar(100) DEFAULT NULL,
  `note` varchar(100) DEFAULT NULL,
  `story` mediumtext,
  `color_codes` varchar(100) DEFAULT NULL,
  `color_names` varchar(100) DEFAULT NULL,
  `sizes` varchar(100) DEFAULT NULL,
  `main_image_path` text,
  `other_images_path` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (6,'sdjf123lj','厚實毛呢格子外套','高抗寒素材選用，保暖也時尚有型',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','實品顏色以單品照為主','你絕對不能錯過的超值商品','334455,FFFFFF','深藍,白色','S,M          ',NULL,NULL),(7,'adsvds','ad','advdv',3243,'avdvc','adva','asdvad','advasdv','asdvdsv','334455,FFFFFF','深藍,白色','S,M      ',NULL,NULL),(8,'asdvads','ad','advdv',3243,'avdvc','adva','asdvad','advasdv','asdvdsv','334455,FFFFFF','深藍,白色','S,M      ',NULL,NULL),(9,'vxcvzxv','adva','cvxzv',34234,'asvzcxv','adfv','zvwfe','dbsdb','fdbsdb','FFFFFF,FFDDDD,DDFFBB,DDF0FF,CCCCCC,BB7744,334455','白色,粉紅,亮綠,淺藍,淺灰,淺棕,深藍','            S,M,L,XL,F     ',NULL,NULL),(10,'sdfbfssbfd','sdfbsfdb','sdbvsvb',12331,'wrh','werw','wergw','fegf','dgfsdg','FFFFFF,FFDDDD,DDFFBB,DDF0FF,CCCCCC,BB7744,334455','白色,粉紅,亮綠,淺藍,淺灰,淺棕,深藍','S,M,L,XL,F',NULL,NULL),(11,'asdadsf','asdvasdv','dasvav',5345,'dsfv','dfvd','sbf','adfb','fbqefb','FFDDDD,DDFFBB','粉紅,亮綠','S,M,L,XL,F',NULL,NULL),(12,'sdjf123lj','厚實毛呢格子外套','',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','','','FFFFFF,FFDDDD','白色,粉紅','S,M,L',NULL,NULL),(13,'sdjf123lj','厚實毛呢格子外套','',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','','','FFFFFF,FFDDDD','白色,粉紅','S,M',NULL,NULL),(14,'sdjf123lj','厚實毛呢格子外套','',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','','','FFFFFF,FFDDDD','白色,粉紅','S,M,L',NULL,NULL),(15,'sdjf123lj','厚實毛呢格子外套',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'publicuploads1550573899451-main.jpg','publicuploads1550573899453-0.jpg,publicuploads1550573899453-1.jpg'),(16,'sdjf123lj','厚實毛呢格子外套',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'publicuploads1550574155448-main.jpg','publicuploads1550574155450-0.jpg,publicuploads1550574155451-1.jpg'),(17,'sdjf123lj','厚實毛呢格子外套',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'publicuploads1550578405955-main.jpg','publicuploads1550578405957-0.jpg,publicuploads1550578405958-1.jpg'),(18,'a','b',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'public\\uploads\\1550573899451-main.jpg',NULL),(19,'a','b',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'publicuploads1550573899451-main.jpg',NULL),(20,'sdjf123lj','厚實毛呢格子外套',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'publicuploads1550579560344-main.jpg','publicuploads1550579560346-0.jpg,publicuploads1550579560346-1.jpg'),(21,'a','b',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'public\\uploads\\1550580737268-main.jpg',NULL),(22,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','','','','public\\uploads\\1550633986642-main.jpg','public\\uploads\\1550633986643-0.jpg,public\\uploads\\1550633986644-1.jpg'),(23,'sdjf123lj','厚實毛呢格子外套','qfwfasd',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','qdf','asdf','FFFFFF,FFDDDD','白色,粉紅','S,M,L','public\\uploads\\1550634298421-main.jpg','public\\uploads\\1550634298422-0.jpg,public\\uploads\\1550634298423-1.jpg'),(24,'sdjf123lj','厚實毛呢格子外套','vcxbs',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','adf','z','FFFFFF,FFDDDD','白色,粉紅','S,M,L','public\\uploads\\1550634599808-main.jpg','public\\uploads\\1550634599810-0.jpg,public\\uploads\\1550634599810-1.jpg'),(25,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','','','','public\\uploads\\1550635023726-main.jpg','public\\uploads\\1550635023729-0.jpg,public\\uploads\\1550635023731-1.jpg'),(26,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','','','','public\\uploads\\1550635081164-main.jpg','public\\uploads\\1550635081173-0.jpg,public\\uploads\\1550635081179-1.jpg'),(27,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','','','','public\\uploads\\1550635143235-main.jpg','public\\uploads\\1550635143240-0.jpg,public\\uploads\\1550635143242-1.jpg'),(28,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','','','','public\\uploads\\1550635233143-main.jpg','public\\uploads\\1550635233150-0.jpg,public\\uploads\\1550635233153-1.jpg'),(29,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','','','','public\\uploads\\1550635317380-main.jpg','public\\uploads\\1550635317384-0.jpg,public\\uploads\\1550635317387-1.jpg'),(30,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','','','','public\\uploads\\1550635336005-main.jpg','public\\uploads\\1550635336009-0.jpg,public\\uploads\\1550635336010-1.jpg'),(31,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','FFFFFF,FFDDDD','白色,粉紅','S,M','public\\uploads\\1550636214933-main.jpg','public\\uploads\\1550636214937-0.jpg,public\\uploads\\1550636214939-1.jpg'),(32,'sdjf123lj','厚實毛呢格子外套','',2200,'棉、聚脂纖維','手洗（水溫40度','韓國','','','FFFFFF,FFDDDD','白色,粉紅','S,M','public\\uploads\\1550637209746-main.jpg','public\\uploads\\1550637209749-0.jpg,public\\uploads\\1550637209751-1.jpg'),(33,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','FFFFFF,FFDDDD','白色,粉紅','S,M','public/uploads/1550637430578-main.jpg','public/uploads/1550637430580-0.jpg,public/uploads/1550637430580-1.jpg'),(34,'sdjf123lj','厚實毛呢格子外套','',2200,'','','','','','FFFFFF,FFDDDD','白色,粉紅','S,M','public/uploads/1550637575475-main.jpg','public/uploads/1550637575477-0.jpg,public/uploads/1550637575478-1.jpg');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
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
  `product_type` varchar(45) DEFAULT NULL,
  `color_code` varchar(45) DEFAULT NULL,
  `color_name` varchar(45) DEFAULT NULL,
  `size` varchar(45) DEFAULT NULL,
  `variant_price` int(11) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  PRIMARY KEY (`variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variants`
--

LOCK TABLES `variants` WRITE;
/*!40000 ALTER TABLE `variants` DISABLE KEYS */;
INSERT INTO `variants` VALUES (1,'sdfasdf','1','dsavad','adfd','fref',0,0),(2,'sdjf123lj','1','FFFFFF','白色','S',0,0),(3,'sdjf123lj','2','FFFFFF','白色','M',0,0),(4,'sdjf123lj','3','FFFFFF','白色','L',0,0),(5,'sdjf123lj','4','FFDDDD','粉紅','S',0,0),(6,'sdjf123lj','5','FFDDDD','粉紅','M',0,0),(7,'sdjf123lj','6','FFDDDD','粉紅','L',0,0),(8,'sdjf123lj','1','FFFFFF','白色','S',0,0),(9,'sdjf123lj','2','FFFFFF','白色','M',0,0),(10,'sdjf123lj','3','FFFFFF','白色','L',0,0),(11,'sdjf123lj','4','FFFFFF','白色','XL',0,0),(12,'sdjf123lj','5','FFDDDD','粉紅','S',0,0),(13,'sdjf123lj','6','FFDDDD','粉紅','M',0,0),(14,'sdjf123lj','7','FFDDDD','粉紅','L',0,0),(15,'sdjf123lj','8','FFDDDD','粉紅','XL',0,0),(16,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(17,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(18,'sdjf123lj','3','FFDDDD','粉紅','S',2200,0),(19,'sdjf123lj','4','FFDDDD','粉紅','M',2200,0),(20,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(21,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(22,'sdjf123lj','3','FFFFFF','白色','L',2200,0),(23,'sdjf123lj','4','FFDDDD','粉紅','S',2200,0),(24,'sdjf123lj','5','FFDDDD','粉紅','M',2200,0),(25,'sdjf123lj','6','FFDDDD','粉紅','L',2200,0),(26,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(27,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(28,'sdjf123lj','3','FFDDDD','粉紅','S',2200,0),(29,'sdjf123lj','4','FFDDDD','粉紅','M',2200,0),(30,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(31,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(32,'sdjf123lj','3','FFFFFF','白色','L',2200,0),(33,'sdjf123lj','4','FFDDDD','粉紅','S',2200,0),(34,'sdjf123lj','5','FFDDDD','粉紅','M',2200,0),(35,'sdjf123lj','6','FFDDDD','粉紅','L',2200,0),(36,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(37,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(38,'sdjf123lj','3','FFFFFF','白色','L',2200,0),(39,'sdjf123lj','4','FFDDDD','粉紅','S',2200,0),(40,'sdjf123lj','5','FFDDDD','粉紅','M',2200,0),(41,'sdjf123lj','6','FFDDDD','粉紅','L',2200,0),(42,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(43,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(44,'sdjf123lj','3','FFFFFF','白色','L',2200,0),(45,'sdjf123lj','4','FFDDDD','粉紅','S',2200,0),(46,'sdjf123lj','5','FFDDDD','粉紅','M',2200,0),(47,'sdjf123lj','6','FFDDDD','粉紅','L',2200,0),(48,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(49,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(50,'sdjf123lj','3','FFDDDD','粉紅','S',2200,0),(51,'sdjf123lj','4','FFDDDD','粉紅','M',2200,0),(52,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(53,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(54,'sdjf123lj','3','FFDDDD','粉紅','S',2200,0),(55,'sdjf123lj','4','FFDDDD','粉紅','M',2200,0),(56,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(57,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(58,'sdjf123lj','3','FFDDDD','粉紅','S',2200,0),(59,'sdjf123lj','4','FFDDDD','粉紅','M',2200,0),(60,'sdjf123lj','1','FFFFFF','白色','S',2200,0),(61,'sdjf123lj','2','FFFFFF','白色','M',2200,0),(62,'sdjf123lj','3','FFDDDD','粉紅','S',2200,0),(63,'sdjf123lj','4','FFDDDD','粉紅','M',2200,0);
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

-- Dump completed on 2019-02-20  6:15:14
