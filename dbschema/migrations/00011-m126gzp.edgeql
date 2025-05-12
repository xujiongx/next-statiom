CREATE MIGRATION m126gzp2rsucsrovpqmfzfc324iqz22qr5ogqdxc2dxrfhf2v6cfpa
    ONTO m1b4xihd5xus54zbknimaqm5zatbjf3qq2braiig4fujs67ftvn3za
{
  ALTER TYPE community::Post {
      CREATE PROPERTY images: std::json;
  };
};
