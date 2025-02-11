#DevTinder API List

authRouter - Post /signup - Post /login - Post /logout

profileRouter - Get /profile/view - Patch /profile/edit - Patch /profile/password

connectionRequestRouter - Post /request/send/intersted/:userId - Post /request/send/ignored/:userId - Post /request/review/accepted/:userId - Post /request/review/rejected/:userId

userRouter - Get /user/connections - Get /user/requests - Get /user/feed - gets you the profile of other users on you platform

status - ignored, intrested, accepted, rejected
