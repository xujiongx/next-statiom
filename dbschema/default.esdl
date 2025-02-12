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

  type Conversation {
    required property title -> str;
    required property created_at -> datetime {
      default := datetime_current();
    };
    required property updated_at -> datetime {
      default := datetime_current();
    };
    required link user -> User;
    multi link messages -> Message;
  }

  type Message {
    required property content -> str;
    required property role -> str;
    required property timestamp -> datetime {
      default := datetime_current();
    };
    required link conversation -> Conversation;
  }
}