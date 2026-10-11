-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-10-2026 a las 04:03:04
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `my_english_adventure`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `daily_assignment_verbs`
--

CREATE TABLE `daily_assignment_verbs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `assignment_id` bigint(20) UNSIGNED NOT NULL,
  `verb_id` bigint(20) UNSIGNED NOT NULL,
  `position_number` tinyint(3) UNSIGNED NOT NULL
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `daily_learning_assignments`
--

CREATE TABLE `daily_learning_assignments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `day_number` int(10) UNSIGNED NOT NULL,
  `status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  `assigned_at` datetime NOT NULL DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `students`
--

CREATE TABLE `students` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `student_learning_progress`
--

CREATE TABLE `student_learning_progress` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `current_day` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `last_completed_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `student_verb_mastery`
--

CREATE TABLE `student_verb_mastery` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `verb_id` bigint(20) UNSIGNED NOT NULL,
  `needs_reinforcement` tinyint(1) NOT NULL DEFAULT 0,
  `learned_at` datetime NOT NULL DEFAULT current_timestamp(),
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `verbs`
--

CREATE TABLE `verbs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `base_form` varchar(100) NOT NULL,
  `translation_es` varchar(255) NOT NULL,
  `past_form` varchar(100) NOT NULL,
  `past_participle` varchar(100) NOT NULL,
  `pronunciation` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `verb_examples`
--

CREATE TABLE `verb_examples` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `verb_id` bigint(20) UNSIGNED NOT NULL,
  `tense` enum('present','past','future') NOT NULL,
  `sentence_en` text NOT NULL,
  `sentence_es` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `verb_review_sessions`
--

CREATE TABLE `verb_review_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_verb_mastery_id` bigint(20) UNSIGNED NOT NULL,
  `session_type` enum('scheduled','voluntary') NOT NULL,
  `review_date` date NOT NULL,
  `completed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `all_answers_correct` tinyint(1) NOT NULL,
  `counts_for_mastery` tinyint(1) NOT NULL DEFAULT 0,
  `mastery_counted_date` date GENERATED ALWAYS AS (case when `counts_for_mastery` = 1 then `review_date` else NULL end) STORED
) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `daily_assignment_verbs`
--
ALTER TABLE `daily_assignment_verbs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_assignment_verb` (`assignment_id`,`verb_id`),
  ADD UNIQUE KEY `uq_assignment_position` (`assignment_id`,`position_number`),
  ADD KEY `idx_daily_assignment_verb_id` (`verb_id`);

--
-- Indices de la tabla `daily_learning_assignments`
--
ALTER TABLE `daily_learning_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_student_learning_day` (`student_id`,`day_number`);

--
-- Indices de la tabla `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_students_email` (`email`);

--
-- Indices de la tabla `student_learning_progress`
--
ALTER TABLE `student_learning_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_learning_progress_student` (`student_id`);

--
-- Indices de la tabla `student_verb_mastery`
--
ALTER TABLE `student_verb_mastery`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_student_verb_mastery` (`student_id`,`verb_id`),
  ADD KEY `idx_mastery_verb` (`verb_id`);

--
-- Indices de la tabla `verbs`
--
ALTER TABLE `verbs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_verbs_base_form` (`base_form`);

--
-- Indices de la tabla `verb_examples`
--
ALTER TABLE `verb_examples`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_verb_examples_verb_id` (`verb_id`);

--
-- Indices de la tabla `verb_review_sessions`
--
ALTER TABLE `verb_review_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_mastery_one_per_day` (`student_verb_mastery_id`,`mastery_counted_date`),
  ADD KEY `idx_review_mastery_date` (`student_verb_mastery_id`,`review_date`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `daily_assignment_verbs`
--
ALTER TABLE `daily_assignment_verbs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `daily_learning_assignments`
--
ALTER TABLE `daily_learning_assignments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `students`
--
ALTER TABLE `students`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `student_learning_progress`
--
ALTER TABLE `student_learning_progress`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `student_verb_mastery`
--
ALTER TABLE `student_verb_mastery`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `verbs`
--
ALTER TABLE `verbs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `verb_examples`
--
ALTER TABLE `verb_examples`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `verb_review_sessions`
--
ALTER TABLE `verb_review_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `daily_assignment_verbs`
--
ALTER TABLE `daily_assignment_verbs`
  ADD CONSTRAINT `fk_assignment_verbs_assignment` FOREIGN KEY (`assignment_id`) REFERENCES `daily_learning_assignments` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assignment_verbs_verb` FOREIGN KEY (`verb_id`) REFERENCES `verbs` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `daily_learning_assignments`
--
ALTER TABLE `daily_learning_assignments`
  ADD CONSTRAINT `fk_daily_assignment_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `student_learning_progress`
--
ALTER TABLE `student_learning_progress`
  ADD CONSTRAINT `fk_learning_progress_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `student_verb_mastery`
--
ALTER TABLE `student_verb_mastery`
  ADD CONSTRAINT `fk_mastery_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_mastery_verb` FOREIGN KEY (`verb_id`) REFERENCES `verbs` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `verb_examples`
--
ALTER TABLE `verb_examples`
  ADD CONSTRAINT `fk_verb_examples_verb` FOREIGN KEY (`verb_id`) REFERENCES `verbs` (`id`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `verb_review_sessions`
--
ALTER TABLE `verb_review_sessions`
  ADD CONSTRAINT `fk_review_session_mastery` FOREIGN KEY (`student_verb_mastery_id`) REFERENCES `student_verb_mastery` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
