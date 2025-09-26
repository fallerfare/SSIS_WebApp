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
    college_code VARCHAR(15) NOT NULL,
    CONSTRAINT fk_student_program FOREIGN KEY (program_code) 
        REFERENCES public.programs(program_code),
    CONSTRAINT fk_student_college FOREIGN KEY (college_code) 
        REFERENCES public.colleges(college_code)
);

ALTER TABLE public.students
    OWNER TO postgres;

-- Colleges
INSERT INTO public.colleges (college_code, college_name) VALUES
('CCS', 'College of Computer Studies'),
('COE', 'College of Engineering'),
('CASS', 'College of Arts and Social Sciences'),
('CBAA', 'College of Business Administration and Accountancy'),
('CHS', 'College of Health Sciences');

-- Programs
INSERT INTO public.programs (program_code, program_name, college_code) VALUES
-- CCS
('BSCS', 'Bachelor of Science in Computer Science', 'CCS'),
('BSIT', 'Bachelor of Science in Information Technology', 'CCS'),
('BSIS', 'Bachelor of Science in Information Systems', 'CCS'),
('BSCA', 'Bachelor of Science in Computer Applications', 'CCS'),

-- COE
('BSCvE', 'Bachelor of Science in Civil Engineering', 'COE'),
('BSEE', 'Bachelor of Science in Electrical Engineering', 'COE'),
('BSME', 'Bachelor of Science in Mechanical Engineering', 'COE'),
('BSECE', 'Bachelor of Science in Electronics Engineering', 'COE'),
('BSChE', 'Bachelor of Science in Chemical Engineering', 'COE'),

-- CASS
('BSPSY', 'Bachelor of Science in Psychology', 'CASS'),
('BSPHY', 'Bachelor of Science in Physics', 'CASS'),
('BSBIO', 'Bachelor of Science in Biology', 'CASS'),
('BSPOL', 'Bachelor of Arts in Political Science', 'CASS'),
('BSCOM', 'Bachelor of Arts in Communication', 'CASS'),

-- CBAA
('BSBA', 'Bachelor of Science in Business Administration', 'CBAA'),
('BSA', 'Bachelor of Science in Accountancy', 'CBAA'),
('BSMKT', 'Bachelor of Science in Marketing Management', 'CBAA'),
('BSHRM', 'Bachelor of Science in Human Resource Management', 'CBAA'),
('BSFIN', 'Bachelor of Science in Financial Management', 'CBAA'),

-- CHS
('BSN', 'Bachelor of Science in Nursing', 'CHS'),
('BSMT', 'Bachelor of Science in Medical Technology', 'CHS'),
('BSRAD', 'Bachelor of Science in Radiologic Technology', 'CHS'),
('BSPharm', 'Bachelor of Science in Pharmacy', 'CHS'),
('BSDENT', 'Doctor of Dental Medicine', 'CHS');

-- Students
INSERT INTO public.students 
(id_number, first_name, middle_name, last_name, gender, email, year_level, program_code, college_code) 
VALUES
('2023-0000', 'Juan', 'Santos', 'Dela Cruz', 'Male', 'juan.delacruz@example.com', 1, 'BSCS', 'CCS'),
('2023-0001', 'Maria', 'Lopez', 'Reyes', 'Female', 'maria.reyes@example.com', 2, 'BSIT', 'CCS'),
('2023-0002', 'Jose', 'Cruz', 'Santiago', 'Male', 'jose.santiago@example.com', 3, 'BSIS', 'CCS'),
('2023-0003', 'Ana', 'Ramos', 'Garcia', 'Female', 'ana.garcia@example.com', 1, 'BSCA', 'CCS'),
('2023-0004', 'Paolo', 'Luis', 'Torres', 'Male', 'paolo.torres@example.com', 4, 'BSCA', 'CCS'),

('2023-0005', 'Carla', 'Jimenez', 'Navarro', 'Female', 'carla.navarro@example.com', 2, 'BSPOL', 'CASS'),
('2023-0006', 'Rafael', 'Mendoza', 'Salazar', 'Male', 'rafael.salazar@example.com', 3, 'BSPSY', 'CASS'),
('2023-0007', 'Liza', 'Perez', 'Castillo', 'Female', 'liza.castillo@example.com', 1, 'BSCOM', 'CASS'),
('2023-0008', 'Miguel', 'Fernandez', 'Aquino', 'Male', 'miguel.aquino@example.com', 4, 'BSBIO', 'CASS'),
('2023-0009', 'Sophia', 'Velasco', 'Marquez', 'Female', 'sophia.marquez@example.com', 2, 'BSPHY', 'CASS'),

('2023-0010', 'Mark', 'Antonio', 'Villanueva', 'Male', 'mark.villanueva@example.com', 1, 'BSA', 'CBAA'),
('2023-0011', 'Jasmine', 'Reyes', 'Santos', 'Female', 'jasmine.santos@example.com', 2, 'BSBA', 'CBAA'),
('2023-0012', 'Kevin', 'Martinez', 'Domingo', 'Male', 'kevin.domingo@example.com', 3, 'BSMKT', 'CBAA'),
('2023-0013', 'Andrea', 'Delos', 'Angeles', 'Female', 'andrea.angeles@example.com', 1, 'BSFIN', 'CBAA'),
('2023-0014', 'Patrick', 'Rosario', 'Diaz', 'Male', 'patrick.diaz@example.com', 5, 'BSHRM', 'CBAA'),

('2023-0015', 'Hannah', 'Gomez', 'Rivera', 'Female', 'hannah.rivera@example.com', 1, 'BSN', 'CHS'),
('2023-0016', 'David', 'Castro', 'Flores', 'Male', 'david.flores@example.com', 2, 'BSN', 'CHS'),
('2023-0017', 'Angela', 'Roxas', 'Mendoza', 'Female', 'angela.mendoza@example.com', 3, 'BSMT', 'CHS'),
('2023-0018', 'Ethan', 'De', 'Leon', 'Male', 'ethan.leon@example.com', 4, 'BSRAD', 'CHS'),
('2023-0019', 'Chloe', 'Uy', 'Tan', 'Female', 'chloe.tan@example.com', 1, 'BSDENT', 'CHS');

