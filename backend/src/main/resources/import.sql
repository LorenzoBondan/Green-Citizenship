INSERT INTO tb_user (name, email, password) VALUES ('Alex', 'alex@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');
INSERT INTO tb_user (name, email, password) VALUES ('Maria', 'maria@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');
INSERT INTO tb_user (name, email, password) VALUES ('Bob', 'bob@gmail.com', '$2a$10$eACCYoNOHEqXve8aIWT8Nu3PkMXWBaOxJ9aORUYzfMQCbVBIhZ8tG');

INSERT INTO tb_role (authority) VALUES ('ROLE_CITIZEN');
INSERT INTO tb_role (authority) VALUES ('ROLE_ADMIN');

INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 2);
INSERT INTO tb_user_role (user_id, role_id) VALUES (3, 1);

INSERT INTO tb_category (name) VALUES ('Sugestão');
INSERT INTO tb_category (name) VALUES ('Crítica');
INSERT INTO tb_category (name) VALUES ('Aprovação');
INSERT INTO tb_category (name) VALUES ('Outro');

INSERT INTO tb_post (category_id, is_urgent, status, user_id, date, description, title) VALUES (1, true, 1, 1, TIMESTAMP WITHOUT TIME ZONE '2025-01-01T15:00:00', 'Descrição de sugestão sustentável', 'Sugestão sustentável');
INSERT INTO tb_post (category_id, is_urgent, status, user_id, date, description, title) VALUES (2, false, 2, 2, TIMESTAMP WITHOUT TIME ZONE '2025-02-01T16:00:00', 'Descrição de crítica sustentável', 'Crítica sustentável');
INSERT INTO tb_post (category_id, is_urgent, status, user_id, date, description, title) VALUES (3, true, 1, 3, TIMESTAMP WITHOUT TIME ZONE '2025-03-01T17:00:00', 'Descrição de aprovação sustentável', 'Aprovação sustentável');

INSERT INTO tb_comment (post_id, user_id, date, text) VALUES (1, 2, TIMESTAMP WITHOUT TIME ZONE '2025-01-01T15:00:00', 'Great insights!');
INSERT INTO tb_comment (post_id, user_id, date, text) VALUES (2, 3, TIMESTAMP WITHOUT TIME ZONE '2025-01-01T15:00:00', 'Very informative!');
INSERT INTO tb_comment (post_id, user_id, date, text) VALUES (3, 1, TIMESTAMP WITHOUT TIME ZONE '2025-01-01T15:00:00', 'I totally agree!');

INSERT INTO tb_like (comment_id, post_id, user_id) VALUES (null, 1, 3);
INSERT INTO tb_like (comment_id, post_id, user_id) VALUES (null, 2, 1);
INSERT INTO tb_like (comment_id, post_id, user_id) VALUES (null, 2, 3);
INSERT INTO tb_like (comment_id, post_id, user_id) VALUES (null, 3, 2);
INSERT INTO tb_like (comment_id, post_id, user_id) VALUES (1, null, 3);
INSERT INTO tb_like (comment_id, post_id, user_id) VALUES (2, null, 1);
INSERT INTO tb_like (comment_id, post_id, user_id) VALUES (3, null, 2);

INSERT INTO tb_notification (is_read, user_id, date, text) VALUES (false, 1, TIMESTAMP WITHOUT TIME ZONE '2025-01-01T15:00:00', 'Notification test 1');
INSERT INTO tb_notification (is_read, user_id, date, text) VALUES (true, 2, TIMESTAMP WITHOUT TIME ZONE '2025-01-01T15:00:00', 'Notification test 2');
INSERT INTO tb_notification (is_read, user_id, date, text) VALUES (false, 3, TIMESTAMP WITHOUT TIME ZONE '2025-01-01T15:00:00', 'Notification test 3');
