module community {
  # 帖子表
  type Post {
    required property title -> str {
      constraint max_len_value(200);
    };
    required property content -> str;
    required property created_at -> datetime {
      default := datetime_current();
    };
    property updated_at -> datetime;
    required link author -> default::User;  # 修改这里，指向 default 模块中的 User
    multi link comments -> Comment;
    multi link likes -> default::User;  # 同样修改这里
    property view_count -> int64 {
      default := 0;
    };
    property tags -> array<str>;
    property status -> PostStatus {
      default := PostStatus.Published;
    };
  }

  # 评论表
  type Comment {
    required property content -> str;
    required property created_at -> datetime {
      default := datetime_current();
    };
    property updated_at -> datetime;
    required link author -> default::User;  # 修改这里
    link parent_comment -> Comment;
    multi link likes -> default::User;  # 修改这里
  }

  # 用户活动表
  type Activity {
    required property type -> ActivityType;
    required property created_at -> datetime {
      default := datetime_current();
    };
    required link user -> default::User;  # 修改这里
    link post -> Post;
    link comment -> Comment;
  }

  # 通知表
  type Notification {
    required property type -> NotificationType;
    required property content -> str;
    required property created_at -> datetime {
      default := datetime_current();
    };
    property read -> bool {
      default := false;
    };
    required link recipient -> default::User;  # 修改这里
    link actor -> default::User;  # 修改这里
    link post -> Post;
    link comment -> Comment;
  }

  # 话题表
  type Topic {
    required property name -> str {
      constraint exclusive;
    };
    required property description -> str;
    property icon -> str;
    property created_at -> datetime {
      default := datetime_current();
    };
    multi link posts -> Post;
    property post_count -> int64 {
      default := 0;
    };
  }

  # 用户关注关系表
  type UserFollow {
    required link follower -> default::User;  # 修改这里
    required link following -> default::User;  # 修改这里
    required property created_at -> datetime {
      default := datetime_current();
    };
    constraint exclusive on ((.follower, .following));
  }

  # 枚举类型
  scalar type PostStatus extending enum<'Draft', 'Published', 'Archived'>;
  scalar type ActivityType extending enum<'Post', 'Comment', 'Like', 'Follow'>;
  scalar type NotificationType extending enum<'Like', 'Comment', 'Mention', 'Follow', 'System'>;
}