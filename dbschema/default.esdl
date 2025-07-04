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

  # 在现有模式中添加
  type ScheduledTask {
    required property name -> str;
    required property cronExpression -> str;
    required property handler -> str;
    required property isActive -> bool {
      default := true;
    };
    property lastRun -> datetime;
    property nextRun -> datetime;
    required property createdAt -> datetime {
      default := datetime_current();
    };
  }
}