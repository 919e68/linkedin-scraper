-- start: profiles table
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE IF NOT EXISTS profiles (
  id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  slug NVARCHAR(100) NOT NULL,
  profile_url NVARCHAR(200) NOT NULL,
  profile_name NVARCHAR(200) NULL,
  is_ready TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_profile` (`slug`)
);
-- end: profiles table
