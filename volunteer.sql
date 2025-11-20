-- =========================================
-- 0. TẠO DATABASE (nếu cần)
-- =========================================
-- Chạy lệnh này trong postgres, sau đó \c để connect
-- CREATE DATABASE volunteer_hub ENCODING 'UTF8';

-- \c volunteer_hub;

-- =========================================
-- 1. XÓA BẢNG CŨ (NẾU CÓ) THEO ĐÚNG THỨ TỰ
-- =========================================

-- DROP TABLE IF EXISTS volunteer_registrations CASCADE;
-- DROP TABLE IF EXISTS tasks CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS locations CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- =========================================
-- 2. TẠO BẢNG USERS
-- =========================================

CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(120)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    phone           VARCHAR(20),
    role            VARCHAR(20)     NOT NULL
        CHECK (role IN ('VOLUNTEER', 'ORGANIZER', 'ADMIN')),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =========================================
-- 3. TẠO BẢNG LOCATIONS (ĐỊA ĐIỂM DỰ ÁN)
-- =========================================

CREATE TABLE locations (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(150)    NOT NULL,       -- VD: "Xã A, Huyện B, Tỉnh C"
    province        VARCHAR(100),
    district        VARCHAR(100),
    ward            VARCHAR(100),
    address_detail  VARCHAR(255),
    note            TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =========================================
-- 4. TẠO BẢNG PROJECTS (DỰ ÁN THIỆN NGUYỆN)
-- =========================================

CREATE TABLE projects (
    id              BIGSERIAL       PRIMARY KEY,
    title           VARCHAR(200)    NOT NULL,
    description     TEXT,
    location_id     BIGINT          NOT NULL,
    created_by      BIGINT          NOT NULL, -- FK -> users.id (ORGANIZER / ADMIN)
    start_date      DATE,
    end_date        DATE,
    status          VARCHAR(20)     NOT NULL
        CHECK (status IN ('PLANNED', 'OPEN', 'CLOSED', 'COMPLETED')),
    max_volunteers  INT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_projects_location
        FOREIGN KEY (location_id) REFERENCES locations (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_projects_created_by
        FOREIGN KEY (created_by) REFERENCES users (id)
        ON DELETE RESTRICT
);

-- Một vài index hữu ích
CREATE INDEX idx_projects_location_id ON projects (location_id);
CREATE INDEX idx_projects_status      ON projects (status);

-- =========================================
-- 5. TẠO BẢNG TASKS (CÔNG VIỆC TRONG DỰ ÁN)
-- =========================================

CREATE TABLE tasks (
    id                  BIGSERIAL       PRIMARY KEY,
    project_id          BIGINT          NOT NULL,
    title               VARCHAR(200)    NOT NULL,
    description         TEXT,
    required_volunteers INT,
    status              VARCHAR(20)     NOT NULL
        CHECK (status IN ('OPEN', 'FULL', 'DONE')),
    start_time          TIMESTAMPTZ,
    end_time            TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_tasks_project
        FOREIGN KEY (project_id) REFERENCES projects (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_tasks_project_id ON tasks (project_id);
CREATE INDEX idx_tasks_status     ON tasks (status);

-- =========================================
-- 6. TẠO BẢNG VOLUNTEER_REGISTRATIONS (TRANSACTION)
--    TNV ĐĂNG KÝ THAM GIA DỰ ÁN / TASK
-- =========================================

CREATE TABLE volunteer_registrations (
    id              BIGSERIAL       PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    project_id      BIGINT          NOT NULL,
    task_id         BIGINT,             -- có thể NULL nếu đăng ký chung cho project
    status          VARCHAR(20)     NOT NULL
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED')),
    registered_at   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    note            TEXT,

    CONSTRAINT fk_registrations_user
        FOREIGN KEY (user_id)    REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_registrations_project
        FOREIGN KEY (project_id) REFERENCES projects (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_registrations_task
        FOREIGN KEY (task_id)    REFERENCES tasks (id)
        ON DELETE SET NULL
);

-- Chống việc 1 user đăng ký trùng 1 project + task nhiều lần
ALTER TABLE volunteer_registrations
ADD CONSTRAINT uq_registration_unique
UNIQUE (user_id, project_id, task_id);

CREATE INDEX idx_registrations_user_id    ON volunteer_registrations (user_id);
CREATE INDEX idx_registrations_project_id ON volunteer_registrations (project_id);
CREATE INDEX idx_registrations_status     ON volunteer_registrations (status);

--ERD:
-- users (1) — (N) projects qua projects.created_by
-- locations (1) — (N) projects qua projects.location_id
-- projects (1) — (N) tasks qua tasks.project_id
-- users (1) — (N) volunteer_registrations qua volunteer_registrations.user_id
-- projects (1) — (N) volunteer_registrations qua volunteer_registrations.project_id
-- tasks (1) — (N) volunteer_registrations qua volunteer_registrations.task_id (nullable)
