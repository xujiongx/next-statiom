CREATE MIGRATION m1quizcdzdyi237id3cxodfy37vukbx4mdmmmuio4qafcnj34maehq
    ONTO m1rc572u6hgnylazwqgxspqvy6gh6mlmlvq24xqbioor35dnr3eaea
{
  CREATE MODULE community IF NOT EXISTS;
  CREATE TYPE community::Comment {
      CREATE REQUIRED LINK author: default::User;
      CREATE MULTI LINK likes: default::User;
      CREATE LINK parent_comment: community::Comment;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY updated_at: std::datetime;
  };
  CREATE SCALAR TYPE community::PostStatus EXTENDING enum<Draft, Published, Archived>;
  CREATE TYPE community::Post {
      CREATE MULTI LINK comments: community::Comment;
      CREATE REQUIRED LINK author: default::User;
      CREATE MULTI LINK likes: default::User;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY status: community::PostStatus {
          SET default := (community::PostStatus.Published);
      };
      CREATE PROPERTY tags: array<std::str>;
      CREATE REQUIRED PROPERTY title: std::str {
          CREATE CONSTRAINT std::max_len_value(200);
      };
      CREATE PROPERTY updated_at: std::datetime;
      CREATE PROPERTY view_count: std::int64 {
          SET default := 0;
      };
  };
  CREATE SCALAR TYPE community::ActivityType EXTENDING enum<Post, Comment, `Like`, Follow>;
  CREATE TYPE community::Activity {
      CREATE LINK comment: community::Comment;
      CREATE LINK post: community::Post;
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY type: community::ActivityType;
  };
  CREATE SCALAR TYPE community::NotificationType EXTENDING enum<`Like`, Comment, Mention, Follow, System>;
  CREATE TYPE community::Notification {
      CREATE LINK comment: community::Comment;
      CREATE LINK actor: default::User;
      CREATE LINK post: community::Post;
      CREATE REQUIRED LINK recipient: default::User;
      CREATE REQUIRED PROPERTY content: std::str;
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY read: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY type: community::NotificationType;
  };
  CREATE TYPE community::Topic {
      CREATE MULTI LINK posts: community::Post;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE PROPERTY icon: std::str;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY post_count: std::int64 {
          SET default := 0;
      };
  };
  CREATE TYPE community::UserFollow {
      CREATE REQUIRED LINK follower: default::User;
      CREATE REQUIRED LINK following: default::User;
      CREATE CONSTRAINT std::exclusive ON ((.follower, .following));
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
