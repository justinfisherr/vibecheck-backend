const mongoose = require("mongoose");
const Counter = require("../models/counter");

const userSchema = new mongoose.Schema({
  user_info: {
    vibe_id: String,
    user_id: String,
    username: String,
    profile_img: String,
  },
  user_data: {
    top_artists: [
      {
        artist_name: String,
        artist_img: String,
        genres: [String],
      },
    ],
    top_songs: [
      {
        song_name: String,
        artist_name: String,
        song_img: String,
        genres: [String],
        preview_url: String,
        url: String,
      },
    ],
    top_genres: { type: Map, of: Object },
    total_genres: Number,
  },
});

/**
 * createVibeID - creates a properly formatted vibe_id. It uses a database Counter to create it.
 * Everytime the counter is accessed its also incremented to ensure for no duplicates.
 *
 * @returns a formated vibe_id
 */
async function createVibeID() {
  const { count } = await Counter.findOneAndUpdate({}, { $inc: { count: 1 } });
  return (vibeId = "v" + count.toString());
}

/**
 * PreSave middleware. Used to check if the user needs a vibe_id. A user gets assigned
 * a new vibe_id if they haven't been assigned an vibe_id and their Spotify username length
 * is greater than 15. If not then we just assign their vibe_id to be their Spotify username
 */

userSchema.pre("save", async function (next) {
  //If there exists a user with the vibe_id of the current user's userID
  //usernameTaken will be truthy.
  const usernameTaken = await mongoose.model("users", userSchema).findOne({
    "user_info.vibe_id": this.user_info.user_id,
  });
  //If username is taken or their id is greater than 15, we create a new vibe_id.
  if (usernameTaken || this.user_info.user_id.length > 15) {
    this.user_info.vibe_id = await createVibeID();
  } else {
    this.user_info.vibe_id = this.user_info.user_id;
  }

  next();
});

module.exports = {
  User: mongoose.model("User", userSchema),
  createVibeID: createVibeID,
};
