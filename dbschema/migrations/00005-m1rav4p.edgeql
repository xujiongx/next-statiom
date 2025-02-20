CREATE MIGRATION m1rav4peoc3vfywlvvoulspxw5pkod3ndknfmjzpix6dqxliwzjpkq
    ONTO m16cfq522jtd7oack5lngiwhimhnxxt2gbwhrrriw5dvo3c4d2yrgq
{
  ALTER TYPE default::Conversation {
      DROP INDEX ON (.session_id);
      ALTER LINK messages {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
  ALTER TYPE default::Message {
      ALTER PROPERTY timestamp {
          RESET default;
      };
  };
  ALTER TYPE default::User {
      CREATE MULTI LINK conversations: default::Conversation {
          ON TARGET DELETE DELETE SOURCE;
      };
      ALTER PROPERTY created_at {
          SET REQUIRED USING (<std::datetime>{});
      };
  };
};
