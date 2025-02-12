module default {
  type User {
    required property username -> str {
      constraint exclusive;
    };
    required property password -> str;
    required property nickname -> str;
    property created_at -> datetime {
      default := datetime_current();
    };
  }
}