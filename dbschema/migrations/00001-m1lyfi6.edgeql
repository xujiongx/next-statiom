CREATE MIGRATION m1lyfi6425kujw3uqqz6bbnyochxojph5vf4nwf4x2rpjna4o67ewa
    ONTO initial
{
  CREATE TYPE default::User {
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY nickname: std::str;
      CREATE REQUIRED PROPERTY password: std::str;
      CREATE REQUIRED PROPERTY username: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
