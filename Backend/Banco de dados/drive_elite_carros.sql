-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: drive_elite
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carros`
--

DROP TABLE IF EXISTS `carros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `modelo` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ano` int NOT NULL,
  `preco` decimal(12,2) NOT NULL,
  `quilometragem` int DEFAULT NULL,
  `motor` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cambio` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoria` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cor` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descricao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `imagem` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status_id` int NOT NULL,
  `velocidade_max` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `carros_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carros`
--

LOCK TABLES `carros` WRITE;
/*!40000 ALTER TABLE `carros` DISABLE KEYS */;
INSERT INTO `carros` VALUES (4,'Porsche','911 Carrera S',2021,1250000.00,23450,'3.0 Boxer Twin-Turbo','Automático PDK','Esportivo','Roxo','Carro esportivo de luxo com 450cv e alto desempenho.','porsche-roxa.png',1,308),(6,'Ferrari','F8 Tributo',2022,3500000.00,5000,'3.9 V8 Biturbo','Automático','Esportivo','Vermelho','Superesportivo italiano com desempenho extremo.','ferrari-f8.png',1,340),(7,'Lamborghini','Huracán EVO',2021,4200000.00,8000,'5.2 V10','Automático','Esportivo','Roxo','Design agressivo com motor V10 aspirado.','lamborghini-huracan.png',1,325),(8,'McLaren','720S',2020,3800000.00,12000,'4.0 V8 Biturbo','Automático','Esportivo','Rosa','Leve, rápido e extremamente tecnológico.','mclaren-720s.png',1,341),(9,'Aston Martin','DB11',2019,2800000.00,15000,'4.0 V8','Automático','Formula 1','Cinza','Luxo britânico com performance refinada.','aston-martin-db11.png',1,300),(10,'Bugatti','Chiron',2023,15000000.00,1000,'8.0 W16 Quad-Turbo','Automático','Hipercarro','Azul','Um dos carros mais rápidos do mundo.','bugatti-chiron.png',1,420),(12,'Rolls-Royce','Cullinan',2024,7500000.00,0,'6.75 V12 Twin-Turbo','Automático','SUV','Branco','O SUV mais luxuoso do mundo. Conforto absoluto com motor V12.','rolls-royce.png',1,250);
/*!40000 ALTER TABLE `carros` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-21 18:24:09
