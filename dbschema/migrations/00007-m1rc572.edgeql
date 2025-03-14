CREATE MIGRATION m1rc572u6hgnylazwqgxspqvy6gh6mlmlvq24xqbioor35dnr3eaea
    ONTO m13y3mrw3kmmmlyvhvfw6cbcunhxjfxhj75kcshfltavx7p5aw3xeq
{
  ALTER TYPE default::User {
      DROP LINK conversations;
  };
};
