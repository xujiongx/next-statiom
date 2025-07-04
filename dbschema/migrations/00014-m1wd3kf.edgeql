CREATE MIGRATION m1wd3kfag5umub6nqghpquyqo45aer4v4hocutbliskdrtbghenk7a
    ONTO m1cjcytr46d54uspoxazzq4yxqizkg6qs3gze67greph4osfqtzxaq
{
  CREATE TYPE default::Image {
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY url: std::str;
  };
};
