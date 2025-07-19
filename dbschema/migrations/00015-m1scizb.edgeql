CREATE MIGRATION m1scizb5bosjxxx5wvv4t7ucykk67tjvnuss37mt4vdunixmxiguea
    ONTO m1wd3kfag5umub6nqghpquyqo45aer4v4hocutbliskdrtbghenk7a
{
  CREATE TYPE default::Favorite {
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY category: std::str;
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
  };
};
