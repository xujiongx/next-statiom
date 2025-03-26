CREATE MIGRATION m1mi6tdby23mz6ak6mdd7lqvarszpw3fru7i7x4c2hyp3ffh3ap2wa
    ONTO m1quizcdzdyi237id3cxodfy37vukbx4mdmmmuio4qafcnj34maehq
{
  ALTER TYPE community::Comment {
      CREATE REQUIRED LINK post: community::Post {
          SET REQUIRED USING (<community::Post>{});
      };
  };
};
