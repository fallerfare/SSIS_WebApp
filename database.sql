-- Colleges table
CREATE TABLE IF NOT EXISTS public.colleges (
    college_code VARCHAR(15) PRIMARY KEY,
    college_name VARCHAR(100) NOT NULL
);

ALTER TABLE public.colleges
    OWNER TO postgres;

-- Programs table
CREATE TABLE IF NOT EXISTS public.programs (
    program_code VARCHAR(15) PRIMARY KEY,
    program_name VARCHAR(100) NOT NULL,
    college_code VARCHAR(15) NOT NULL,
    CONSTRAINT fk_program_college FOREIGN KEY (college_code) 
        REFERENCES public.colleges(college_code)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

ALTER TABLE public.programs
    OWNER TO postgres;

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
    id_number VARCHAR(9) PRIMARY KEY CHECK (char_length(id_number) = 9),
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
	gender VARCHAR(7) NOT NULL CHECK (gender in ('Male', 'Female', 'Others')),
    email VARCHAR(100) UNIQUE,
    year_level INT CHECK (year_level BETWEEN 1 AND 5),
    program_code VARCHAR(15) NOT NULL,
    CONSTRAINT fk_student_program FOREIGN KEY (program_code) 
        REFERENCES public.programs(program_code)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

ALTER TABLE public.students
    OWNER TO postgres;
