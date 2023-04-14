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

userSchema.pre("save", async function (next) {
  if (this.user_info.user_id.length > 15) {
    const { count } = await Counter.findOneAndUpdate(
      {},
      { $inc: { count: 1 } }
    );
    const vibeId = "v" + count.toString();
    this.user_info.vibe_id = vibeId;
  } else {
    this.user_info.vibe_id = this.user_info.user_id;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
