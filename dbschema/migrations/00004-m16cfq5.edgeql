CREATE MIGRATION m16cfq522jtd7oack5lngiwhimhnxxt2gbwhrrriw5dvo3c4d2yrgq
    ONTO m1qrcuwoshx6khpzdv55hk5rw3oh46oxszzce4lfp6yonorkzsnz4q
{
  ALTER TYPE default::Conversation {
      ALTER PROPERTY session_id {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.session_id);
  };
};
