CREATE MIGRATION m1gkbyczabiz4fg37b53pu6rsf5vpvqu2lary3bj4ttbyrdahoxe3q
    ONTO m1lyfi6425kujw3uqqz6bbnyochxojph5vf4nwf4x2rpjna4o67ewa
{
  CREATE TYPE default::Conversation {
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE REQUIRED PROPERTY updated_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
  CREATE TYPE default::Message {
      CREATE REQUIRED LINK conversation: default::Conversation;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY role: std::str;
      CREATE REQUIRED PROPERTY timestamp: std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::Conversation {
      CREATE MULTI LINK messages: default::Message;
  };
};
