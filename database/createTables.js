const pool = require("../config/db");

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS standards (
      id SERIAL PRIMARY KEY,
      std_id VARCHAR(20) UNIQUE NOT NULL,
      std_name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sections (
      id SERIAL PRIMARY KEY,
      section_id VARCHAR(20) UNIQUE NOT NULL,
      section_name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS academic_levels (
      id SERIAL PRIMARY KEY,
      level_id VARCHAR(20) UNIQUE NOT NULL,
      level_name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blocks (
      id SERIAL PRIMARY KEY,
      block_id VARCHAR(20) UNIQUE NOT NULL,
      block_name VARCHAR(100) UNIQUE NOT NULL,
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS class_rooms (
      id SERIAL PRIMARY KEY,
      room_id VARCHAR(20) UNIQUE NOT NULL,
      block_id INT REFERENCES blocks(id) ON DELETE CASCADE,
      block_name VARCHAR(100) DEFAULT '',
      floor VARCHAR(50) DEFAULT '',
      room_no VARCHAR(100) DEFAULT '',
      capacity INT DEFAULT 0,
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS combined_stds (
      id SERIAL PRIMARY KEY,
      standard_id INT REFERENCES standards(id) ON DELETE CASCADE,
      section_id INT REFERENCES sections(id) ON DELETE CASCADE,
      academic_level_id INT REFERENCES academic_levels(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (standard_id, section_id, academic_level_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS class_allocations (
      id SERIAL PRIMARY KEY,
      combined_std_id INT REFERENCES combined_stds(id) ON DELETE CASCADE,
      class_room_id INT REFERENCES class_rooms(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(combined_std_id, class_room_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      admission_number VARCHAR(20) UNIQUE NOT NULL,
      ad_roll_no VARCHAR(20) UNIQUE NOT NULL,
      class_roll_no VARCHAR(20) DEFAULT '',
      academic_year VARCHAR(20) DEFAULT '',
      admission_date VARCHAR(20) DEFAULT '',
      first_name VARCHAR(50) DEFAULT '',
      last_name VARCHAR(50) DEFAULT '',
      class_name VARCHAR(100) DEFAULT '',
      section_name VARCHAR(100) DEFAULT '',
      gender VARCHAR(20) DEFAULT '',
      date_of_birth VARCHAR(20) DEFAULT '',
      status VARCHAR(20) DEFAULT 'Active',
      primary_contact VARCHAR(10) DEFAULT '',
      email VARCHAR(100) DEFAULT '',
      blood_group VARCHAR(20) DEFAULT '',
      house VARCHAR(50) DEFAULT '',
      religion VARCHAR(50) DEFAULT '',
      category VARCHAR(50) DEFAULT '',
      caste VARCHAR(50) DEFAULT '',
      mother_tongue VARCHAR(50) DEFAULT '',
      language_known TEXT DEFAULT '',
      father_name VARCHAR(100) DEFAULT '',
      father_email VARCHAR(100) DEFAULT '',
      father_phone VARCHAR(20) DEFAULT '',
      father_occupation VARCHAR(100) DEFAULT '',
      mother_name VARCHAR(100) DEFAULT '',
      mother_email VARCHAR(100) DEFAULT '',
      mother_phone VARCHAR(20) DEFAULT '',
      mother_occupation VARCHAR(100) DEFAULT '',
      guardian_type VARCHAR(50) DEFAULT '',
      guardian_name VARCHAR(100) DEFAULT '',
      guardian_relation VARCHAR(100) DEFAULT '',
      guardian_phone VARCHAR(20) DEFAULT '',
      guardian_email VARCHAR(100) DEFAULT '',
      guardian_occupation VARCHAR(100) DEFAULT '',
      guardian_address TEXT DEFAULT '',
      sibling_in_school TEXT DEFAULT '',
      siblings TEXT DEFAULT '[]',
      current_address TEXT DEFAULT '',
      permanent_address TEXT DEFAULT '',
      route VARCHAR(100) DEFAULT '',
      vehicle_number VARCHAR(100) DEFAULT '',
      pickup_point VARCHAR(100) DEFAULT '',
      hostel VARCHAR(100) DEFAULT '',
      room_no VARCHAR(100) DEFAULT '',
      medical_condition TEXT DEFAULT '',
      allergies TEXT DEFAULT '',
      medications TEXT DEFAULT '',
      previous_school_name VARCHAR(150) DEFAULT '',
      previous_school_address TEXT DEFAULT '',
      bank_name VARCHAR(100) DEFAULT '',
      branch VARCHAR(100) DEFAULT '',
      ifsc_number VARCHAR(50) DEFAULT '',
      other_info TEXT DEFAULT '',
      photo TEXT DEFAULT '',
      father_photo TEXT DEFAULT '',
      mother_photo TEXT DEFAULT '',
      guardian_photo TEXT DEFAULT '',
      birth_certificate TEXT DEFAULT '',
      medical_document TEXT DEFAULT '',
      transfer_certificate TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS subjects (
      id SERIAL PRIMARY KEY,
      subject_name VARCHAR(100) NOT NULL,
      subject_code VARCHAR(20) NOT NULL UNIQUE,
      short_form VARCHAR(20) DEFAULT '',
      status VARCHAR(20) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS allote_subjects (
      id SERIAL PRIMARY KEY,
      academic_level_id INT REFERENCES academic_levels(id) ON DELETE CASCADE,
      subject_ids TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(academic_level_id)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id SERIAL PRIMARY KEY,
      teacher_id VARCHAR(20) UNIQUE NOT NULL,
      first_name VARCHAR(100) DEFAULT '',
      last_name VARCHAR(100) DEFAULT '',
      class_name VARCHAR(100) DEFAULT '',
      subject VARCHAR(100) DEFAULT '',
      gender VARCHAR(20) DEFAULT '',
      primary_contact VARCHAR(20) DEFAULT '',
      email VARCHAR(100) DEFAULT '',
      blood_group VARCHAR(20) DEFAULT '',
      date_of_joining VARCHAR(20) DEFAULT '',
      father_name VARCHAR(100) DEFAULT '',
      mother_name VARCHAR(100) DEFAULT '',
      date_of_birth VARCHAR(20) DEFAULT '',
      marital_status VARCHAR(50) DEFAULT '',
      language_known TEXT DEFAULT '[]',
      qualification VARCHAR(150) DEFAULT '',
      work_experience VARCHAR(100) DEFAULT '',
      previous_school VARCHAR(150) DEFAULT '',
      previous_school_address TEXT DEFAULT '',
      previous_school_phone VARCHAR(20) DEFAULT '',
      address TEXT DEFAULT '',
      permanent_address TEXT DEFAULT '',
      pan_number VARCHAR(50) DEFAULT '',
      status VARCHAR(20) DEFAULT 'Active',
      notes TEXT DEFAULT '',
      epf_no VARCHAR(50) DEFAULT '',
      basic_salary VARCHAR(50) DEFAULT '',
      contract_type VARCHAR(50) DEFAULT '',
      work_shift VARCHAR(50) DEFAULT '',
      work_location VARCHAR(100) DEFAULT '',
      date_of_leaving VARCHAR(20) DEFAULT '',
      medical_leaves VARCHAR(20) DEFAULT '',
      casual_leaves VARCHAR(20) DEFAULT '',
      maternity_leaves VARCHAR(20) DEFAULT '',
      sick_leaves VARCHAR(20) DEFAULT '',
      account_name VARCHAR(100) DEFAULT '',
      account_number VARCHAR(50) DEFAULT '',
      bank_name VARCHAR(100) DEFAULT '',
      ifsc_code VARCHAR(50) DEFAULT '',
      branch_name VARCHAR(100) DEFAULT '',
      route VARCHAR(100) DEFAULT '',
      vehicle_number VARCHAR(100) DEFAULT '',
      pickup_point VARCHAR(100) DEFAULT '',
      hostel VARCHAR(100) DEFAULT '',
      room_no VARCHAR(100) DEFAULT '',
      facebook TEXT DEFAULT '',
      instagram TEXT DEFAULT '',
      linked_in TEXT DEFAULT '',
      youtube TEXT DEFAULT '',
      twitter_url TEXT DEFAULT '',
      photo TEXT DEFAULT '',
      resume TEXT DEFAULT '',
      joining_letter TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    ALTER TABLE subjects
    ADD COLUMN IF NOT EXISTS short_form VARCHAR(20) DEFAULT '';
  `);

  await pool.query(`
    ALTER TABLE students
    ADD COLUMN IF NOT EXISTS class_roll_no VARCHAR(20) DEFAULT '';
  `);

  await pool.query(`
    ALTER TABLE students
    ADD COLUMN IF NOT EXISTS siblings TEXT DEFAULT '[]';
  `);
  await pool.query(`
  CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    bus_id VARCHAR(20) UNIQUE NOT NULL,
    bus_name VARCHAR(20) UNIQUE NOT NULL,
    bus_registration_no VARCHAR(50) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_no VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS routes (
    id SERIAL PRIMARY KEY,
    area VARCHAR(100) NOT NULL,
    route_name VARCHAR(100) NOT NULL,
    bus_name VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

await pool.query(`
  ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS bus_name VARCHAR(20) DEFAULT '';
`);

await pool.query(`
  ALTER TABLE routes
  ADD COLUMN IF NOT EXISTS bus_name VARCHAR(20) DEFAULT '';
`);
};

module.exports = createTables;