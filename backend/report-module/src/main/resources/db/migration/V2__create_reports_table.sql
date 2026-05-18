CREATE TABLE IF NOT EXISTS reports (
                                       report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                       user_id UUID NOT NULL,
                                       latitude DOUBLE PRECISION NOT NULL,
                                       longitude DOUBLE PRECISION NOT NULL,
                                       photo_url VARCHAR(500),
                                       description TEXT,
                                       status VARCHAR(50) NOT NULL DEFAULT 'NEW',
                                       created_at TIMESTAMP NOT NULL,
                                       updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS cleaning_tasks (
                                              task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                              report_id UUID NOT NULL REFERENCES reports(report_id),
                                              cleaner_id UUID NOT NULL,
                                              before_photo VARCHAR(500),
                                              after_photo VARCHAR(500),
                                              verified BOOLEAN NOT NULL DEFAULT FALSE,
                                              status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
                                              created_at TIMESTAMP NOT NULL,
                                              updated_at TIMESTAMP NOT NULL
);