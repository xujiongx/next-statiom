CREATE MIGRATION m1qrcuwoshx6khpzdv55hk5rw3oh46oxszzce4lfp6yonorkzsnz4q
    ONTO m1gkbyczabiz4fg37b53pu6rsf5vpvqu2lary3bj4ttbyrdahoxe3q
{
  ALTER TYPE default::Conversation {
      CREATE REQUIRED PROPERTY session_id: std::str {
          SET REQUIRED USING (<std::str>{});
      };
  };
};
