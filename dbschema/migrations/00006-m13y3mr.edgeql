CREATE MIGRATION m13y3mrw3kmmmlyvhvfw6cbcunhxjfxhj75kcshfltavx7p5aw3xeq
    ONTO m1rav4peoc3vfywlvvoulspxw5pkod3ndknfmjzpix6dqxliwzjpkq
{
  ALTER TYPE default::Conversation {
      DROP LINK messages;
  };
  ALTER TYPE default::Message {
      ALTER LINK conversation {
          ON TARGET DELETE DELETE SOURCE;
      };
  };
};
