CREATE MIGRATION m1gqyvwymbfpyhdwdpk7mahbb6taakp345maglz4nnitf6u3u3dxwq
    ONTO m126gzp2rsucsrovpqmfzfc324iqz22qr5ogqdxc2dxrfhf2v6cfpa
{
  CREATE TYPE default::ScheduledTask {
      CREATE REQUIRED PROPERTY createdAt: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY cronExpression: std::str;
      CREATE REQUIRED PROPERTY handler: std::str;
      CREATE REQUIRED PROPERTY isActive: std::bool {
          SET default := true;
      };
      CREATE PROPERTY lastRun: std::datetime;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY nextRun: std::datetime;
  };
};
