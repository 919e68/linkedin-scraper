DELIMITER //
-- start: proc_insert_to_be_scrape
DROP PROCEDURE IF EXISTS proc_insert_to_be_scrape //
CREATE PROCEDURE proc_insert_to_be_scrape
(
  IN param_slug NVARCHAR(100),
  IN param_profile_url NVARCHAR(200),
  IN param_profile_name NVARCHAR(200)
)
BEGIN
  IF NOT EXISTS(SELECT 1 FROM profiles WHERE slug = param_slug) THEN
    INSERT INTO profiles (slug, profile_url, profile_name)
    VALUES (param_slug, param_profile_url, param_profile_name);
  END IF;
END //
-- end: proc_insert_to_be_scrape
