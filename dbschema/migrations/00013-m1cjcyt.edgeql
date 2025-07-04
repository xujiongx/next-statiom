CREATE MIGRATION m1cjcytr46d54uspoxazzq4yxqizkg6qs3gze67greph4osfqtzxaq
    ONTO m1gqyvwymbfpyhdwdpk7mahbb6taakp345maglz4nnitf6u3u3dxwq
{
  ALTER TYPE default::ScheduledTask {
      CREATE REQUIRED LINK user: default::User {
          SET REQUIRED USING (<default::User>{});
      };
  };
};
