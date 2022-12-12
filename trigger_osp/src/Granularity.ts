export enum authorizationType {
    r_user = "Read-only access to your profile information",
    r_post = "Read-only access to your posts",
    w_post = "Full access to your posts"
}

export enum operation {
    r = "Read",
    w = "Write"
}

export enum location {
    user = "/user",
    post = "/post"
}

export enum postGranularity {
    none = "None",
    last = "Only the last post",
    next = "Only the next shared posts",
    all_previous = "All the previously shared posts",
    all_next = "All the posts published from now",
    all = "All the previously shared post and all posts shared from now"
}

export enum userGranularity {
    none = "None",
    username = "Only the username",
    email = "Only the email",
    all = "Both username and email"
}
