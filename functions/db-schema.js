// db schema
const db = {
  users: [
    {
      userId: "dsfhsdjhflsfdh",
      email: "test@test.com",
      handle: "user",
      createdAt: "2020-01-04T19:23:12.102Z",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/socialape-4ad65.appspot.com/o/avatar-8d55ac86.png?alt=media",
      bio: "Hello, my name is ...",
      website: "https://user.com",
      location: "Saint-Pertersburg, Russia"
    }
  ],
  posts: [
    {
      userHandler: "user",
      body: "This is the post body",
      createdAt: "2020-01-04T19:23:12.102Z",
      likeCount: 5,
      commentCount: 10
    }
  ],
  comments: [
    {
      userHandle: "user",
      postId: "78f7g87sgs87g7g09",
      body: "some nice comment",
      createdAt: "2020-01-04T19:23:12.102Z"
    }
  ],
  likes: [
    {
      userHandle: "user",
      postId: "dsjfjjhds98dsng97"
    }
  ],
  notifications: [
    {
      recepient: "user",
      sender: "anoter",
      read: "true | false",
      postId: "djhdfg98dfnfd8",
      type: "like | comment",
      createdAt: "2020-01-04T19:23:12.102Z"
    }
  ]
};

// redux state
const userDetails = {
  credentials: {
    userId: "fdhfdhgfh5345fdgd",
    email: "user@email.com",
    handle: "user",
    createdAt: "2020-01-04T19:23:12.102Z",
    imageUrl:
      "https://firebasestorage.googleapis.com/v0/b/socialape-4ad65.appspot.com/o/avatar-8d55ac86.png?alt=media",
    bio: "Hello, my name is...",
    website: "https://user.com",
    location: "Saint-Petersburg, Russia"
  },
  likes: [
    { userHandle: "user", postId: "sdjfsh8uhsdhf87" },
    { userHandle: "user", postId: "fdgdh878sdhf6d6" }
  ]
};
