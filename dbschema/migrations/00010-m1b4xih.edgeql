CREATE MIGRATION m1b4xihd5xus54zbknimaqm5zatbjf3qq2braiig4fujs67ftvn3za
    ONTO m1mi6tdby23mz6ak6mdd7lqvarszpw3fru7i7x4c2hyp3ffh3ap2wa
{
  ALTER TYPE default::User {
      CREATE PROPERTY avatar: std::str;
      CREATE PROPERTY wechat_open_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
