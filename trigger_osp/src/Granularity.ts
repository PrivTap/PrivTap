export enum operation {
    r = "Read",
    w = "Write",
}

export enum authorizationType {
    r_user = "Read access to your profile information",
    r_post = "Read access to your posts",
    w_post = "Write access to your posts"
}

export enum location {
    user = "/user",
    post = "/post"
}

export enum postGranularity {
    none = "None",
    content = "Only the last post content",
    date = "Only the last post date",
    all = "Everything regarding the last post"
}

export enum userGranularity {
    none = "None",
    username = "Only the username",
    email = "Only the email",
    all = "Everything regarding your profile"
}
