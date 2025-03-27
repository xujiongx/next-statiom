module default {
  type User {
    required property username -> str {
      constraint exclusive;
    };
    required property password -> str;
    required property nickname -> str;
    required property created_at -> datetime {
      default := datetime_current();
    };
    
    # 微信相关字段
    property wechat_open_id -> str {
      constraint exclusive;
    }
    property avatar -> str;
  }

  type Conversation {
    required property title -> str;
    required property session_id -> str {
      constraint exclusive;
    };
    required property created_at -> datetime {
      default := datetime_current();
    };
    required property updated_at -> datetime {
      default := datetime_current();
    };
    required link user -> User;
  }

  type Message {
    required property content -> str;
    required property role -> str;
    required property timestamp -> datetime;
    required link conversation -> Conversation {
      on target delete delete source;
    };
  }
}